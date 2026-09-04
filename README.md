# FreshPress Laundry — Staff App (interactive demo)

A mobile-first laundry & ironing shop management prototype for field staff.
Plain **HTML + CSS + vanilla JS**, `localStorage` persistence, no framework, no build step.

## Run

```bash
python -m http.server 4173
# then open http://localhost:4173
```

Or just open `index.html` in a browser (works from `file://`; a server is only needed for
reliable `localStorage`).

## What it does

Create customer → record clothes (visual grid, per-garment split across Wash / Iron /
Wash + Iron) → auto-priced review → create order → invoice → track
Pickup → Processing → Ready → Out for Delivery → Delivered → record payment
(Cash / UPI / Card) → simulated WhatsApp notifications → customer feedback (1–5★).
Plus Customers, Orders (filter/search), Pricing (editable), Reports, Settings.

All data is mock. Reset via **Settings → Reset Demo Data** or `window.__freshpress.reset()`.

## Layout

| File | Purpose |
|---|---|
| `index.html` | device frame + mount points |
| `styles.css` | full design system |
| `script.js` | state, seed data, router, screens, events |
| `assets/` | clothing photos + branding |
| `DESIGN_SYSTEM.md` | how it should look |
| `BUILD_PROGRESS.md` | current state + next-session handoff |
| `Laundry_Management_Claude_Master_Prompt.md` | original brief |
| `reference ui images/` | the 8 reference screenshots |
