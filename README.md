# Etsy Keyword Research Lab — MVP 0.1

A Chrome Manifest V3 extension starter that organizes 40 Etsy keyword research methods, generates seed-based keyword ideas, opens selected research sources, validates manually sourced metrics against the stated assignment thresholds, saves records locally, and exports CSV.

## Install (Chrome / Edge)
1. Extract the ZIP to a normal folder.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select this folder (the folder containing `manifest.json`).
5. Click the extension icon and pin it if desired.

## Included
- All 40 methods, organized into six groups.
- Seed keyword expansion for digital, physical, or unsure product types.
- Opens up to eight selected source tabs per click.
- Strict validation: competition < 50,000; views > 5,000; price > $2; fav/view > 1%; Google volume Green/Good; trend stable/growing; target-country demand confirmed; KD < 50.
- Missing evidence fails validation; saves records in `chrome.storage.local`; exports idea and validation CSV files.

## Important limits
- This is a functional MVP scaffold, not a magic scraper and not a claim that all 40 methods can be automated against every website.
- Most keyword metrics require a source/tool account or official API. This version does not log in to RankKK/eRank/EverBee, does not call paid APIs, and does not fabricate volume, sales, tags, or competition.
- Website HTML and access policies change. Etsy and third-party services may restrict automated collection; use official APIs/exports where available and respect each site's terms, login/privacy boundaries, and rate limits.
- "A–Z" currently generates simple letter variants, not verified autocomplete suggestions.
- Trend/country checks are manual fields; add connectors only after selecting providers and checking their current API terms, pricing, and credentials.

## Suggested next milestones
1. Add a user-triggered Etsy results capture for visible titles and listing links.
2. Add provider adapters with explicit API credentials and per-provider metric provenance.
3. Add keyword clustering, intent labels, seasonal calendar, evidence snapshots, and weighted scoring.
4. Add tests and a settings page for API keys stored locally.
