# Google Sheets Trend Backend

This is the fallback backend when Supabase is unavailable or overkill.

## What it does

- Accepts `GET ?action=list&limit=12` to read the latest signals
- Accepts `POST` JSON to append a new signal row
- Stores data in a plain Google Sheet tab named `signals`

## Setup

1. Create a Google Sheet.
2. Create a Google Apps Script project.
3. Paste in [`Code.gs`](./Code.gs).
4. Set script properties:
   - `SMART_CITY_SIGNAL_SHEET_ID`
   - `SMART_CITY_SIGNAL_SECRET`
5. Deploy as a web app with access set to the audience you need.

## Expected columns

The script manages these automatically:

- `id`
- `city_id`
- `source`
- `channel`
- `text_body`
- `sentiment_label`
- `sentiment_score`
- `themes`
- `observed_at`
- `ingested_at`

## Wiring to the app

Set these environment variables:

```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment/exec
GOOGLE_APPS_SCRIPT_SECRET=shared-secret
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment/exec
```

`/api/smart-city-signals` can proxy this endpoint server-side, which is cleaner than calling Apps Script directly from the browser.
