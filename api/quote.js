// Vercel serverless function — server-side proxy for Yahoo Finance
// Fetches from Yahoo Finance with no CORS restrictions (server-to-server)
export default async function handler(req, res) {
  const { sym } = req.query;

  if (!sym || typeof sym !== 'string' || !/^[A-Z0-9^=./-]{1,20}$/i.test(sym)) {
    return res.status(400).json({ error: 'Invalid or missing sym parameter' });
  }

  const encoded = encodeURIComponent(sym);
  const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];

  for (const host of hosts) {
    try {
      const url = `https://${host}/v8/finance/chart/${encoded}?interval=1d&range=14d`;
      const upstream = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StationConsole/1.0)',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!upstream.ok) continue;

      const json = await upstream.json();
      const result = json?.chart?.result?.[0];
      if (!result) continue;

      const closes = (result.indicators?.quote?.[0]?.close ?? []).filter(v => v != null);
      if (closes.length < 2) continue;

      const price     = closes[closes.length - 1];
      const prevClose = closes[closes.length - 2];
      const change    = price - prevClose;
      const changePct = (change / prevClose) * 100;

      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
      return res.status(200).json({ price, change, changePct, closes: closes.slice(-10) });
    } catch (_) {
      // try next host
    }
  }

  return res.status(502).json({ error: `All upstream sources failed for ${sym}` });
}
