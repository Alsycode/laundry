# Laundry Management System — Build Progress

> Single source of truth for the **current development state**. A future session should be
> able to resume from this file + the codebase alone, without the old chat history.

---

## Project Overview

**FreshPress Laundry** — a mobile-first laundry & ironing shop management app for **field staff**.

Staff visit customers, collect clothes, and use the app to:
- Select or create the customer
- Record collected clothes (visual clothing cards), quantities, and service
  (Wash / Iron / Wash + Iron) per item
- Auto-calculate price → review → create the order
- Generate / show the bill (invoice)
- Track the order: Pickup → Processing → Ready → Out for Delivery → Delivered
- Record payment (Cash / UPI / Card / Other), track Paid / Partial / Pending
- Simulate WhatsApp customer notifications at each milestone
- Collect customer feedback (1–5 stars) after delivery

Central concept: **One Order = one customer's batch of clothes.**
`Customer → Clothes → Services → Price → Payment → Status → Delivery → WhatsApp → Feedback`

The customer experience in this demo is only **WhatsApp (simulated) + a feedback link**.
No real backend, auth, WhatsApp API, or payment gateway — **mock data + localStorage only**.

## Stack

- HTML5 (`index.html` — device frame + mount points only)
- CSS3 (`styles.css` — full design-system stylesheet, CSS variables)
- Vanilla JavaScript (`script.js` — IIFE; state, seed data, router, screens, events)
- `localStorage` persistence (key `freshpress_v1`)
- No framework, no build step. Runs from any static file server.

## Architecture (script.js, top → bottom)

1. **Constants** — `CATALOG` (11 clothing types), `DEFAULT_PRICING` (`[wash, iron, washiron]`),
   `SERVICE_*`, `FLOW` (5 statuses), `STATUS_LABEL`, `NEXT_ACTION`, `METHODS`.
2. **State + persistence** — `state` (in-memory), `persist()`, `load()`, `emptyDraft()`,
   `defaultSettings()`. Persisted slices: customers, orders, pricing, feedback, settings, seq.
3. **Seed** — `seed()` builds 29 orders (counts tuned to the reference dashboard:
   pickup 5 / processing 8 / ready+ofd 4 / delivered 12), 7 customers, demo order **#1028**
   = Anjali Mehta, 4 items, ₹305. Older orders numbered 1000↓, today's 5 = 1024–1028.
4. **Domain helpers** — `rupee`, `uid`, `orderById`, `customerById`, `calcSubtotal`,
   `calcTotal`, `amountPaid`, `amountDue`, `customerStats`, `dashCounts`, `priceFor`.
5. **Navigation** — `navigate(name, params, {replace})`, `back()`, `state.ui.history` stack.
   `MAIN_TABS` decide when bottom nav shows.
6. **`icon(name)`** — inline SVG sprite (stroke, currentColor, `.ic` class sized by CSS).
7. **Components** — `appBar`, `statusChip`, `payChip`, `stepper`, `orderTimeline`,
   `bottomNav`, `itemVisual`, `emptyState`, `esc`/`attr`.
8. **`screens`** map — each returns an HTML string; `render()` mounts into `#app`.
9. **WhatsApp sim** — `waMessage(order, kind, asTemplate)`, `simulateWhatsApp()`.
10. **Toast / sheet / modal** — `toast()`, `openSheet`/`closeSheet`, `openModal`/`closeModal`,
    `whatsAppPreviewModal`, `paymentSheet`/`renderPaymentSheet`.
11. **Events** — delegated `click` / `input` on `document`, big `data-action` switch.
12. **Boot** — `load(); render();` + `window.__freshpress` debug hook
    (`.state()`, `.reset()`).

---

## Overall Progress

█████████░ 93%

Current Phase: **Phase 6 — Polish**
Current Status: **Core product complete + real clothing/branding artwork wired in +
multi-service per-garment configure. Manually tested end-to-end.**

---

## Feature Progress

### Core Navigation
- [x] Home dashboard
- [x] Orders navigation + list + filters + search
- [x] Customers navigation + list + search
- [x] Customer detail (history, spent, pending)
- [x] More navigation
- [x] Mobile bottom navigation (hidden on flow screens)
- [x] SPA navigation, no page reloads, back stack

### Order Creation
- [x] Customer search
- [x] Customer selection
- [x] Customer creation (new customer persisted)
- [x] Inline edits to an existing customer during order
- [x] 3-step indicator (Customer / Add Items / Review)
- [x] Add clothing items (visual grid, All / Popular / Recent tabs)
- [x] Per-type count badge on the grid
- [x] Multi-service configure: one quantity stepper per service (Wash / Iron / Wash + Iron)
      so a garment can be split across services in a single add
- [x] Grouped item cards (one card per garment group, per-service sub-rows, item total)
      on Order Summary + Order Detail
- [x] Group-level edit / delete on Order Summary
- [x] Special instructions (200-char counter, stored per group)
- [x] Dynamic pricing (live per-service line totals + total on the Add-to-Order button)
- [x] Order summary with edit / delete / add-more
- [x] Totals computed from live state (subtotal / discount / total)
- [x] Order creation
- [x] Edit an existing order (reuses the summary screen)

### Billing
- [x] Invoice / bill screen (shop header, itemized, totals, payment status)
- [x] Payment status (Paid / Partial / Pending)
- [x] Mark as Paid (payment bottom sheet)
- [x] "Download PDF" via `window.print()`
- [x] "Share Bill" → WhatsApp preview modal
- [ ] True PDF file export (print-to-PDF only for now)

### WhatsApp (simulated)
- [x] Simulated send + "WhatsApp message sent ✓" toast with Preview
- [x] Message preview modal
- [x] Milestone messages: created / payment / ready / out_for_delivery / delivered
- [x] Templates screen (5 templates with `{{placeholders}}`)
- [ ] Real WhatsApp Business API integration (out of scope for demo)

### Delivery / Feedback
- [x] Status flow: Pickup → Processing → Ready → Out for Delivery → Delivered
- [x] Order timeline (4 nodes + "Out for delivery" pill)
- [x] Advance-status button with correct next label + notification
- [x] Dashboard counts + order cards + detail stay in sync on status change
- [x] Delivered customer-facing screen (hero, follow-us, tagline)
- [x] Feedback form (interactive 1–5 stars + comment)
- [x] "Thank you 💚" confirmation
- [x] Feedback stored in state + localStorage, attached to the order

### Management
- [x] Customers screen + detail
- [x] Orders screen + filters + search
- [x] Pricing screen (editable table, persisted, affects new orders only)
- [x] WhatsApp Templates screen
- [x] Reports screen (totals + orders-by-status bars)
- [x] Staff screen (static)
- [x] Settings screen (business info, social, **Reset Demo Data**)

### Platform / polish
- [x] localStorage persistence (survives refresh)
- [x] Reset demo data
- [x] Desktop = centered 390px phone frame with faux status bar; ≤480px = full screen
- [x] Bottom sheet / modal / toast constrained to the phone frame
- [x] `prefers-reduced-motion` handling
- [x] Micro-interactions (screen fade, button press, sheet slide, success check)
- [x] Real clothing photography — 11 PNGs in `assets/clothing/`, wired via `clothPic()`
      with emoji fallback; used on grid, configure hero, summary/detail thumbs
- [x] Brand logo (invoice) + folded-towels hero (Order Created + Delivered), with fallbacks
- [ ] Service icons still emoji stand-ins (`💧`, `♽`) — could be inline SVG
- [ ] Discount is always ₹0 (no UI to set it yet)

---

## Screens

| Screen | Design | UI | Functionality | Status |
|---|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ | Complete |
| New Order / Customer | ✓ | ✓ | ✓ | Complete |
| Add Items (grid) | ✓ | ✓ | ✓ | Complete |
| Configure Item | ✓ | ✓ | ✓ | Complete |
| Order Summary | ✓ | ✓ | ✓ | Complete |
| Order Created | ✓ | ✓ | ✓ | Complete |
| Order Details | ✓ | ✓ | ✓ | Complete |
| Payment Sheet | ✓ | ✓ | ✓ | Complete |
| Invoice / Bill | ✓ | ✓ | ✓ | Complete (print only) |
| Delivered (customer) | ✓ | ✓ | ✓ | Complete |
| Feedback Form | ✓ | ✓ | ✓ | Complete |
| Customers | ✓ | ✓ | ✓ | Complete |
| Customer Detail | ✓ | ✓ | ✓ | Complete |
| Orders | ✓ | ✓ | ✓ | Complete |
| More | ✓ | ✓ | ✓ | Complete |
| Pricing | ✓ | ✓ | ✓ | Complete |
| WhatsApp Templates | ✓ | ✓ | ✓ | Complete |
| Reports | ✓ | ✓ | ✓ | Complete (lightweight) |
| Staff | ~ | ✓ | ~ | Lightweight demo |
| Settings | ✓ | ✓ | ✓ | Complete |

---

## Current Working State

Everything in the main journey works and was manually tested in-browser
(via a Python static server + scripted DOM interaction):

Dashboard → New Order → pick Anjali → Add Shirt/Iron ×3, Jeans/Wash ×2, T-shirt/Iron ×4,
Saree/Wash+Iron ×1 → Review (₹305) → Create Order (#1029) → Order Created + WhatsApp toast
→ View Bill → Order Detail → advance through all 5 statuses (WhatsApp sim each) →
Record Payment (UPI, ₹305) → Paid + toast + WhatsApp → Delivered screen → Give Feedback
→ 5 stars + comment → Thank you. Reload → state persisted.

Last completed: sheet/modal/toast reparented into the phone frame so they render correctly
on desktop; item ids + customer ids moved off the order-number counter so new orders start
at #1029; commit-item now returns to the Add-Items grid (press "Review (N)" when done).

---

## Development Log

### Session 2 (2026-09-04)
Completed:
- **Multi-service configure**: reworked `screens.configureItem` to three per-service quantity
  steppers; new editor model `{type, groupId, qty:{wash,iron,washiron}, instructions, editing}`;
  `commit-item` upserts one flat line item per non-zero service sharing a `groupId`;
  added `groupItems()`; Order Summary + Order Detail now render grouped cards; `edit-group` /
  `delete-group` replace per-line `edit-item` / `delete-item`.
- **Real artwork**: user supplied 11 clothing PNGs + logo + towels hero. Renamed
  `bedsheets.png`→`bedsheet.png`, branding files to `logo.png` / `hero-towels.png`; downscaled
  + optimised all (~22 MB → ~5.3 MB) with PIL. Added `clothPic()` (img + emoji fallback);
  wired into grid, configure hero, summary/detail thumbs, invoice logo, Order Created foot,
  Delivered hero. CSS: white tiles, `object-fit:contain`, `.glyph` fallback, `.hero-img`.
- Fixed More-screen menu title/description running together (missing `display:block`).
- Verified grid, configure, summary, created, invoice, delivered in-browser.

Next:
- Service-icon SVGs; discount input; `@media print` invoice stylesheet.

### Session 1 (2026-09-04)
Completed:
- Read master prompt + all 8 reference screenshots; wrote `DESIGN_SYSTEM.md`.
- Built the full project from scratch: `index.html`, `styles.css`, `script.js`,
  `.claude/launch.json`, `assets/` skeleton.
- Implemented Phases 1–5 in one pass: design system + state + router + localStorage;
  dashboard, customer step, add-items, configure, summary, create; order detail, status
  flow, payment sheet, invoice; WhatsApp simulation, delivered screen, feedback;
  customers, orders, pricing, templates, reports, staff, settings.
- Manually tested the full journey in a browser; fixed: oversized inline SVGs, order-row
  label stacking, dashboard count tuning (5/8/4/12), id-counter collision, add-item
  navigation, sheet/modal framing on desktop.
- Wrote `BUILD_PROGRESS.md`.

Next:
- Phase 6 polish: optional real clothing artwork / SVG service icons; discount UI;
  true PDF export; richer Staff screen; empty-state pass; a11y focus-trap in sheet/modal.

---

## Known Issues / Bugs

- [ ] Service icons (Wash / Iron / Wash + Iron) are still emoji stand-ins — could be inline SVG.
- [ ] Bottom sheet / modal have no focus trap or Esc-to-close (scrim tap + × button work).
- [ ] Discount line always ₹0 — no UI to edit it.
- [ ] "Download PDF" uses `window.print()`; it prints the whole app frame, not just the
      invoice card (no dedicated `@media print` stylesheet yet).
- [ ] Seeded order times use `now − random hours`, so "Today's Orders" times drift a bit
      from the reference's fixed "10:30 AM".

---

## Design Decisions

### UI
- Mobile-first, 390×844 primary target.
- Warm off-white background (`#F6F5F2`), white cards, single emerald-green accent (`#1F7A54`).
- Inter font; Caveat only for the "Fresh Clothes. Happier You." script tagline.
- Rounded cards (18px), subtle shadows only. No dark mode for V1.
- Desktop shows a centered phone frame; it does NOT stretch to full width.
- All overlays (sheet / modal / toast) live inside `.device-frame`.

### Architecture
- Single-file vanilla JS IIFE, no framework / no build.
- `state` is the runtime source of truth; a persisted subset goes to `localStorage`.
- Screens are pure `params → HTML string` functions; one delegated event handler.
- Mock/seed data lives in `seed()`, kept out of screen code.
- `unitPrice` is snapshotted onto each order item at add-time, so later Pricing edits
  only affect **new** orders.
- IDs: orders use the `seq` counter (starts 1029); items/customers use `uid()` (timestamp
  + random) so they never consume order numbers.

### UX
- Order is the central entity; target < 1 minute to enter an order.
- Customer needs no app — WhatsApp (simulated) + feedback link only.
- After adding an item you return to the grid; "Review (N)" advances to summary.
- Status changes always re-sync dashboard counts, order cards, and the detail screen.

---

## Project Structure

```
index.html              device frame, faux status bar, #app + overlay mount points
styles.css              full design system (CSS variables, all component styles)
script.js               IIFE: constants, state, seed, router, screens, events
.claude/launch.json     "laundry-demo" → python -m http.server 4173 (for local preview)
assets/
  README.md             how to swap emoji glyphs for real artwork
  clothing/ icons/ branding/   (empty — placeholders)
BUILD_PROGRESS.md       this file
DESIGN_SYSTEM.md         visual source of truth
Laundry_Management_Claude_Master_Prompt.md   original brief
reference ui images/     the 8 reference screenshots
```

## Demo Data

Primary demo customer: **Anjali Mehta** · +91 98765 43210 ·
B-12, Green Park Apartments, Sector 21, Noida (12 orders context).

Primary demo order: **#1028**
- Shirt × 3 — Iron — ₹45
- Jeans × 2 — Wash — ₹120
- T-shirt × 4 — Iron — ₹60
- Saree × 1 — Wash + Iron — ₹80
- **Total ₹305**, status Pickup, payment Pending.

Other customers: Priya Sharma, Rahul Nair, Sneha Iyer, Amit Verma, Neha Kapoor, Karan Mehta.
Dashboard (seed): Pickups 5 · In Processing 8 · Ready 4 · Delivered 12.

Default pricing (`[wash, iron, wash+iron]`, ₹):
shirt 30/15/40 · tshirt 25/15/35 · jeans 60/25/75 · pants 50/25/70 · saree 60/30/80 ·
dress 70/35/95 · bedsheet 50/30/70 · towel 20/10/25 · jacket 90/40/120 · shorts 30/15/40 ·
skirt 40/20/55.

## How to run

```bash
cd D:\laundry
python -m http.server 4173
# open http://localhost:4173
```

Or in Claude Code: preview the `laundry-demo` launch config.
Debug hooks: `window.__freshpress.state()`, `window.__freshpress.reset()`.

---

# NEXT SESSION HANDOFF

## Last Working On
Phase 6 polish. Core app complete + real artwork + multi-service configure, all tested.
Repo pushed to https://github.com/Alsycode/laundry.

## Completed This Session (2)
- Multi-service per-garment configure + grouped item cards (Summary + Detail) + group edit/delete.
- Real clothing PNGs (11) + logo + towels hero wired in with emoji/text fallback; images
  downscaled ~22 MB → ~5.3 MB.
- Fixed More-screen menu spacing.
- Committed + pushed to GitHub (Alsycode/laundry).

## Current Problem
None blocking. Remaining items are polish (see Known Issues).

## Next Immediate Task
Pick one: (a) `@media print` invoice stylesheet so "Download PDF" prints only the bill;
(b) replace the 3 service emoji with inline SVG icons; (c) discount input on Order Summary.

## Files Most Relevant
- `script.js` — `screens.*`, `groupItems()`, `clothPic()`, the `data-action` switch, `seed()`
- `styles.css` — component styles + tokens
- `DESIGN_SYSTEM.md` — before touching any visuals (multi-service + clothing sections)
- `assets/` — `clothing/<type>.png`, `branding/logo.png`, `branding/hero-towels.png`

## Important Context
- Do NOT rebuild. The app works. Resume from the codebase + these two MD files.
- `state` in memory is truth; persisted subset in `localStorage["freshpress_v1"]`.
- Reset demo data via Settings → Reset Demo Data, or `window.__freshpress.reset()`.
- Order items are flat `{id, groupId, type, qty, service, unitPrice, instructions}`; a "group"
  (one garment split across services) = items sharing `groupId`. Legacy/seed items have no
  `groupId` and stand alone — `groupItems()` handles both.
- Order #1028 (Anjali, ₹305) is the canonical demo scenario — keep it intact in `seed()`.
- Reference dashboard counts (5/8/4/12) come from the `pads` array in `seed()`.
