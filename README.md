# ASCII Dashboard

A fullscreen terminal-aesthetic dashboard. Phosphor green. Spaceship console vibes.

## Features
- Live weather (Open-Meteo, no API key)
- AP News + Guardian RSS feeds (unified + topic)
- Commodities: WTI, Brent, Natural Gas, Gold (Yahoo Finance)
- Animated radar canvas
- Fullscreen mode (hides browser chrome)
- Configurable via Settings page

## How to Run

A local static server is required (browsers block cross-origin fetch from `file://`).

**Option A — Node (no install):**
```
npx serve .
```
Open http://localhost:3000

**Option B — VS Code:**
Install "Live Server" extension → right-click `index.html` → "Open with Live Server"

**Option C — Python:**
```
python -m http.server 8080
```
Open http://localhost:8080

## Settings
Click ⚙ SETTINGS in the dashboard header to configure:
- Weather location
- Topic feeds (live event tracking)
- News category filters
- Refresh intervals

## Planned (v2)
- Real PC telemetry via Node.js companion module
