# Design System — FreshPress Laundry

Single source of truth for **how the app looks**. Derived from the 8 supplied reference
screenshots (iPhone-style mobile mockups). Do not drift from this without updating this file.

---

## Visual Direction

Premium, calm, minimal **mobile operations app** for laundry & ironing staff.

Characteristics: clean · spacious · highly readable · operational (not corporate) · friendly.
Reference philosophy: **Apple-like simplicity + modern fintech UX + premium service brand.**

Predominantly neutral surfaces with a single confident **emerald green** accent.
No dark mode for V1. No glassmorphism. No dense dashboards. No heavy shadows.

---

## Color Tokens

```
/* Brand */
--green:        #1F7A54;   /* primary buttons, active nav, selected states */
--green-dark:   #17603F;   /* button active/pressed, gradients */
--green-tint:   #E8F3EC;   /* subtle green backgrounds, icon tiles */
--green-tint-2: #DCEFE3;   /* selected service card fill */

/* Neutrals */
--bg:        #F6F5F2;   /* app background (warm off-white) */
--surface:   #FFFFFF;   /* cards, sheets */
--surface-2: #FAF9F7;   /* nested / inset surfaces */
--ink:       #0F1A24;   /* primary text (near-black navy) */
--ink-2:     #5B6672;   /* secondary text */
--ink-3:     #8A929C;   /* tertiary text, placeholders, disabled */
--border:    #E9E7E2;   /* hairline borders */
--border-2:  #E2E8E4;   /* green-ish borders on tinted cards */

/* Status (soft pastels: tint bg + saturated text) */
--blue:   #2F6FBF;  --blue-tint:   #E7F0FB;   /* Pickup */
--amber:  #B9750C;  --amber-tint:  #FBEDD6;   /* In Process / Processing */
--green-status: #1F7A54; --green-status-tint: #DDF0E4; /* Ready / Delivered / Paid */
--red:    #C23B3B;  --red-tint:    #FBE6E6;   /* Pending payment */
--purple: #7A4FD0;  --purple-tint: #EFE8FB;   /* Delivered stat tile */
```

New colors must not be introduced on later screens without being added here.

---

## Typography

Font: **Inter** (Google Fonts), system-sans fallback.
Script accent: **Caveat** — only for the "Fresh Clothes. Happier You." tagline.

| Role              | Size / Weight / Line |
|-------------------|----------------------|
| Large greeting    | 30px / 800 / 1.15    |
| Page title (bar)  | 22px / 700 / 1.2     |
| Success headline  | 30px / 800           |
| Section heading   | 18px / 700           |
| Card title        | 16px / 700           |
| Body              | 15px / 400 / 1.45    |
| Secondary         | 14px / 400           |
| Label / caption   | 12px / 600 / +.2 tracking, sometimes uppercase |
| Stat number       | 26px / 800           |

---

## Spacing System

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40` (px). Screen gutter = 20px. Card padding = 16px.

---

## Radius

| Element        | Radius |
|----------------|--------|
| Card / sheet   | 18px   |
| Button         | 14px   |
| Input          | 13px   |
| Small control  | 12px   |
| Status chip    | 999px  |
| Icon tile      | 12px   |

---

## Shadows

```
--shadow-card:  0 4px 18px rgba(15,26,36,.05);
--shadow-sheet: 0 -12px 40px rgba(15,26,36,.16);
--shadow-pop:   0 16px 50px rgba(15,26,36,.16);
```

No shadow heavier than the sheet shadow.

---

## Buttons

- **Primary**: full-width, `--green` fill, white text, 700, height 54px, radius 14px.
  Active state darkens to `--green-dark`, slight scale(.99).
- **Secondary**: white fill, 1px `--border`, `--ink` text, 700.
- **Ghost/link**: `--green` text, no fill (e.g. "Go to Home", "Edit", "Add More", "View All").
- **Destructive**: `--red` text / icon.
- **Icon button**: 44px square, white, 1px border, radius 12px.
- **Disabled**: `--ink-3` text, `--surface-2` fill, no shadow.

---

## Inputs

- Height 52px (single line), padding 14px 16px.
- Background white, 1px `--border`, radius 13px.
- Placeholder `--ink-3`.
- Focus: border `--green`, 3px `rgba(31,122,84,.12)` ring.
- Textarea: min-height 96px, char counter bottom-right in `--ink-3`.
- Error: border `--red`, helper text `--red`.

---

## Cards

White · radius 18px · 1px `--border` · `--shadow-card` · padding 16px.
List cards (order rows) use 14px vertical padding and separate with 1px inset dividers
when grouped in one container.

---

## Status Badges (pill, 999px)

| State            | BG                    | Text            |
|------------------|-----------------------|-----------------|
| Pickup           | `--blue-tint`         | `--blue`        |
| Processing       | `--amber-tint`        | `--amber`       |
| Ready            | `--green-status-tint` | `--green`       |
| Out for Delivery | `--amber-tint`        | `--amber`       |
| Delivered        | `--green-status-tint` | `--green-dark`  |
| Paid             | `--green-status-tint` | `--green`       |
| Pending          | `--red-tint`          | `--red`         |

Padding 4px 12px, 13px / 700.

---

## Configure Item — multi-service (deviation from reference, by request)

The reference "Add Item" screen has one quantity + a single-choice service selector. This build
replaces that with **one quantity stepper per service** (Wash / Iron / Wash + Iron) so a single
garment type can be split across services in one add — e.g. 3 shirts wash, 2 iron, 5 wash+iron.
Each service row: icon + name + `₹x per piece` (+ green line total when qty > 0) + compact
`− n +` stepper. Rows tint green when active. The CTA shows `{pcs} pcs · ₹{total}` and is
disabled at 0. Internally each service becomes its own flat line item sharing a `groupId`;
Summary / Detail render one grouped card per `groupId` with per-service sub-rows and an item
total. Uses existing tokens/components, so it stays visually cohesive.

## Step Indicator (create flow)

3 nodes: **Customer · Add Items · Review**. Node = 34px circle.
- Upcoming: white fill, 1.5px `--border`, `--ink-3` number.
- Active: `--green` fill, white number.
- Complete: `--green` fill, white check.
- Connector: 2px line, `--green` when the segment is complete, else `--border`.

## Order Timeline (order detail)

4 nodes with icons: **Pickup (truck) · In Process (washer) · Ready (check) · Delivered (box)**.
Completed/active nodes: `--green` fill white icon. Upcoming: white fill, `--border`, `--ink-3` icon.
Connector 2px, green up to current stage. `out_for_delivery` = Ready node complete + amber
"Out for delivery" pill under the timeline.

---

## Navigation (bottom)

Fixed bottom bar, white, 1px top border, safe-area padding.
4 tabs: **Home · Orders · Customers · More**. Icon 22px + 11px label.
Active = `--green` icon + label. Inactive = `--ink-3`.
Hidden on flow screens (new order, configure, invoice, feedback, etc.).

Desktop: app is centered in a 390px phone frame (rounded 44px, dark bezel, faux status bar).
Below 480px the frame is dropped and the app fills the viewport.

---

## Clothing Visuals

Real isolated product photos on a **white** rounded tile, one per clothing type, matching the
reference screenshots. Files live in `assets/clothing/<type>.png` (`shirt`, `tshirt`, `jeans`,
`pants`, `saree`, `dress`, `bedsheet`, `towel`, `jacket`, `shorts`, `skirt`), ~640px, flattened
on white, downscaled/optimised. Rendered via `clothPic(type, cls)` in `script.js` with
`object-fit:contain`; if a PNG is missing it falls back to the type's emoji glyph
(`onerror` → `.img-failed` shows `.glyph`).

Used on: Add-Items grid (`.item-visual`), Configure hero (`.hero-img`), Order Summary +
Order Detail thumbnails (`.sum-visual`).

Branding: `assets/branding/logo.png` (green folded-shirt + droplet mark, used on the invoice)
and `assets/branding/hero-towels.png` (folded-towel stack, used on Order Created + Delivered).
Both fall back to emoji / "FP" text if missing.

Items: Shirt · T-shirt · Jeans · Pants · Saree · Dress · Bedsheet · Towel · Jacket · Shorts · Skirt.

---

## Components (reuse — do not fork without reason)

`appBar` · `primaryButton` · `secondaryButton` · `iconButton` · `card` · `statusChip` ·
`payChip` · `input` · `textarea` · `quantitySelector` · `serviceSelector` · `clothingCard` ·
`orderRow` · `customerRow` · `stepIndicator` · `orderTimeline` · `bottomNav` · `bottomSheet` ·
`modal` · `toast` · `starRating` · `emptyState`.

---

## Micro-interactions

Subtle only: 180ms screen fade/slide, button press scale(.99), bottom-sheet slide-up +
scrim fade, success check draw-in, toast slide-up, quantity number pop, selected-service
border+check fade. No parallax, no confetti beyond the static success "sparkles".
Respect `prefers-reduced-motion`.

---

## Design Fidelity Rule

For every new screen: (1) inspect the reference, (2) check this file, (3) reuse tokens +
components, (4) do not invent a new visual language, (5) if a genuinely new decision is
needed, document it here first.
