# Claude Design / Claude Code Master Prompt
## Laundry & Ironing Management System — Interactive Demo

You are a **Senior Product Designer + Frontend Engineer**. Your job is to design and build a **fully functional, polished interactive prototype** of a Laundry & Ironing Management System.

I will provide **individual UI screen reference images**. Treat those screenshots as the **official visual source of truth** for the interface.

The goal is NOT to create a generic laundry dashboard. Recreate the visual language of the supplied screenshots while turning the screens into a genuinely interactive demo that can be presented to a client.

Use **dummy/mock data only**. No real backend, database, authentication, WhatsApp integration, payment gateway, or external API is required for this demo.

---

# 1. PRODUCT CONCEPT

This application is used by employees of a laundry and ironing business.

Employees visit customers and collect clothes. At pickup, they need to:

1. Select or create the customer.
2. Record which clothes were collected.
3. Enter quantities.
4. Specify whether each item needs:
   - Washing
   - Ironing
   - Washing + Ironing
5. Automatically calculate the price.
6. Review the order.
7. Create the order.
8. Generate/show the bill.
9. Track the order through processing.
10. Mark it ready.
11. Mark it out for delivery.
12. Mark it delivered.
13. Record payment.
14. Simulate WhatsApp customer notifications.
15. After delivery, request customer feedback.

The demo should make this workflow immediately understandable.

The central concept is:

**One Order = one customer's batch/bag of clothes.**

Everything should be connected to the order:

**Customer → Clothes → Services → Price → Payment → Status → Delivery → WhatsApp → Feedback**

---

# 2. IMPORTANT: USE THE REFERENCE IMAGES AS THE DESIGN SOURCE OF TRUTH

The supplied screenshots are the visual benchmark.

Do NOT redesign the UI into your own style.

Do NOT turn it into:
- A generic SaaS dashboard
- A Bootstrap interface
- A dark admin dashboard
- A glassmorphism interface
- A highly colorful startup UI
- A dense accounting application

The final product should feel like a **premium modern mobile operations app**.

Think:

**Apple-like simplicity + modern fintech/product UX + premium laundry service.**

Match the reference images as closely as practical in:

- Layout
- Spacing
- Typography hierarchy
- Colors
- Card treatment
- Corner radius
- Shadows
- Button proportions
- Icons
- Status chips
- Progress indicators
- Bottom navigation
- Visual clothing items
- Information hierarchy
- Overall density

The screenshots should feel like different screens from **one cohesive application**, not independent designs.

---

# 3. TECHNOLOGY

Build the demo using:

- HTML5
- Modern CSS3
- Vanilla JavaScript

Do not use React.

Do not use Tailwind.

Do not use Bootstrap.

Avoid unnecessary frameworks.

The prototype should be easy to run locally.

Recommended structure:

```text
index.html
styles.css
script.js

/assets/
    /clothing/
    /icons/
    /branding/

BUILD_PROGRESS.md
DESIGN_SYSTEM.md
```

If additional files are genuinely useful, add them only when necessary.

---

# 4. PROJECT CONTINUITY — MANDATORY

This project will be developed across multiple Claude conversations.

The chat context may eventually become full, so the project must maintain its own persistent documentation.

Create and continuously maintain these two files:

```text
BUILD_PROGRESS.md
DESIGN_SYSTEM.md
```

These files are mandatory and are part of the project.

---

# 5. BUILD_PROGRESS.md — PROJECT MEMORY

`BUILD_PROGRESS.md` is the **single source of truth for the current development state**.

A future Claude conversation must be able to understand the state of the project by reading this file and inspecting the existing codebase, without depending on the old chat history.

Create `BUILD_PROGRESS.md` before substantial implementation begins.

It must contain:

## Project Overview

Explain:
- What the application is
- Who uses it
- What problem it solves
- Current technology stack
- Current architecture

Example:

```md
# Laundry Management System — Build Progress

## Project Overview

A mobile-first laundry and ironing shop management application.

The application allows staff to:
- Create customers
- Record collected clothes
- Assign washing/ironing services
- Generate bills
- Track payments
- Track order status
- Simulate WhatsApp notifications
- Collect customer feedback

## Stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- No backend for demo
```

---

## Overall Progress

Maintain an approximate progress indicator.

Example:

```md
## Overall Progress

████████░░ 80%

Current Phase:
Order Management

Current Status:
In Progress
```

Update it when meaningful progress is made.

---

## Feature Checklist

Track features using:

`[x]` completed  
`[~]` partially completed  
`[ ]` not started

Example:

```md
## Feature Progress

### Core Navigation

- [x] Home dashboard
- [x] Orders navigation
- [x] Customers navigation
- [x] More navigation
- [x] Mobile bottom navigation

### Order Creation

- [x] Customer selection
- [x] Customer creation
- [x] Add clothing items
- [x] Quantity selector
- [x] Wash service
- [x] Iron service
- [x] Wash + Iron service
- [x] Special instructions
- [x] Dynamic pricing
- [x] Order summary
- [x] Order creation

### Billing

- [x] Invoice preview
- [x] Payment status
- [x] Mark as paid
- [ ] PDF export
- [ ] Share invoice

### WhatsApp

- [x] Simulated message
- [x] Message preview
- [ ] Real WhatsApp API integration

### Delivery

- [x] Processing status
- [x] Ready status
- [x] Out for delivery
- [x] Delivered
- [x] Feedback screen
```

---

## Screen Implementation Status

Maintain a table like:

```md
## Screens

| Screen | Design | UI | Functionality | Status |
|---|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ | Complete |
| Customer Details | ✓ | ✓ | ✓ | Complete |
| Add Items | ✓ | ✓ | ✓ | Complete |
| Configure Item | ✓ | ✓ | ✓ | Complete |
| Order Summary | ✓ | ✓ | ✓ | Complete |
| Order Created | ✓ | ✓ | ✓ | Complete |
| Order Details | ✓ | ✓ | ~ | In Progress |
| Payment Sheet | ✓ | ✓ | ✓ | Complete |
| Delivered | ✓ | ✓ | ✓ | Complete |
| Feedback | ✓ | ~ | ~ | In Progress |
```

---

## Current Working State

Always explain exactly what is currently being implemented.

Example:

```md
## Current Working State

Currently implementing:

Order Details → Payment Flow

The Order Details screen is complete visually.

Currently working on:
- Payment bottom sheet
- Payment state updates
- Dashboard payment synchronization

Last completed:
- Dynamic order totals
- Order status timeline
```

---

## Development Log

Maintain a chronological log, newest session first.

Example:

```md
## Development Log

### Session 5

Completed:
- Implemented Orders screen
- Added order filtering
- Added order search
- Connected order cards to Order Details
- Added status transitions

Next:
- Implement payment flow

### Session 4

Completed:
- Implemented Add Item screen
- Added quantity controls
- Added service selection
- Added dynamic pricing

Next:
- Implement Order Summary
```

---

## Known Issues / Bugs

Track unresolved problems.

Example:

```md
## Known Issues

- [ ] Feedback modal doesn't close after submission
- [ ] Invoice print layout needs adjustment on mobile
- [ ] Some clothing images need better cropping
```

Remove or mark issues complete after fixing them.

---

## Design Decisions

Record decisions that future sessions must preserve.

Example:

```md
## Design Decisions

### UI
- Mobile-first
- White/off-white background
- Emerald green primary color
- Inter font
- Rounded cards
- Minimal shadows
- No dark mode for V1

### Architecture
- Vanilla JavaScript
- LocalStorage for persistence
- No backend in demo
- Single-page application
- Mock data

### UX
- Order is the central entity
- Staff should be able to create an order in under one minute
- Customer does not need an app
- WhatsApp is the primary customer communication channel
```

---

## Project Structure

Track important files:

```md
## Project Structure

index.html
styles.css
script.js

/assets
  /clothing
  /icons
  /branding

BUILD_PROGRESS.md
DESIGN_SYSTEM.md
```

Update when architecture changes.

---

## Demo Data

Track important demo entities.

Example:

```md
## Demo Data

Primary demo customer:

Anjali Mehta
+91 98765 43210

Primary demo order:

#1028

Items:
- Shirt × 3 — Iron
- Jeans × 2 — Wash
- T-Shirt × 4 — Iron
- Saree × 1 — Wash + Iron

Total:
₹305
```

---

## NEXT SESSION HANDOFF

At the bottom of `BUILD_PROGRESS.md`, always maintain:

```md
# NEXT SESSION HANDOFF

## Last Working On

[Exact feature/task]

## Completed This Session

- ...
- ...
- ...

## Current Problem

[Issue if any]

## Next Immediate Task

[One clear next action]

## Files Most Relevant

- ...
- ...

## Important Context

[Any information the next Claude session must know]
```

This section must always represent the latest project state.

---

# 6. DESIGN_SYSTEM.md — VISUAL MEMORY

`DESIGN_SYSTEM.md` is the **single source of truth for how the application should look**.

It exists so that when a new Claude conversation starts, the UI does not gradually drift away from the original reference screenshots.

Create this file during the initial implementation.

It should document:

## Brand / Visual Direction

Describe the overall visual philosophy.

Example:

```md
# Design System

## Visual Direction

Premium, minimal, friendly laundry operations application.

Design characteristics:
- Clean
- Calm
- Spacious
- Mobile-first
- Premium
- Highly readable
- Operational rather than corporate

Reference philosophy:
Apple-like simplicity + modern fintech UX + premium service brand.
```

---

## Color Tokens

Document actual colors used.

Example:

```md
## Colors

--primary: #0B8F5A
--primary-dark: ...
--primary-light: ...

--background: #F8F7F4
--surface: #FFFFFF
--text-primary: #101828
--text-secondary: #667085
--border: #E8E8E8

--status-pickup: ...
--status-processing: ...
--status-ready: ...
--status-delivered: ...
--status-pending: ...
```

Do not randomly introduce new colors on later screens.

---

## Typography

Document:

- Font
- Font sizes
- Font weights
- Line heights
- Letter spacing where relevant

Use Inter or a similarly clean sans-serif.

Example:

```md
## Typography

Font:
Inter

Page title:
24px / 700

Large greeting:
32px / 700

Section heading:
18px / 600

Body:
16px / 400

Secondary:
14px / 400

Label:
12px / 500
```

---

## Spacing System

Define consistent spacing tokens.

Example:

```md
## Spacing

4px
8px
12px
16px
20px
24px
32px
40px
```

Use the system consistently.

---

## Radius

Example:

```md
## Radius

Card:
20px

Button:
16px

Input:
14px

Small controls:
12px

Status chip:
999px
```

Adjust values if the reference images indicate otherwise.

---

## Shadows

Keep shadows subtle.

Example:

```md
## Shadows

Card:
0 6px 20px rgba(0,0,0,0.05)

Modal:
0 16px 50px rgba(0,0,0,0.12)
```

Do not introduce heavy shadows.

---

## Buttons

Document:

- Primary button
- Secondary button
- Destructive button
- Icon button
- Disabled state
- Loading state

Primary buttons should generally use the main green.

---

## Inputs

Document:

- Height
- Padding
- Border
- Focus state
- Placeholder style
- Error state

---

## Cards

Document:

- Background
- Border
- Radius
- Padding
- Shadow
- Internal spacing

---

## Status Badges

Document the visual treatment for:

- Pickup
- Processing
- Ready
- Out for Delivery
- Delivered
- Paid
- Pending

---

## Navigation

Document:

- Mobile bottom navigation
- Active state
- Icon sizing
- Desktop behavior

---

## Clothing Images

Clothing items should be visually recognizable.

Maintain a consistent image style:

- Clean isolated clothing
- Neutral/white background
- Similar visual scale
- Similar cropping
- No inconsistent photography styles

Items include:

- Shirt
- T-Shirt
- Jeans
- Pants
- Saree
- Dress
- Bedsheet
- Towel
- Jacket
- Shorts
- Skirt

---

## Component Rules

Document reusable components:

- Button
- Card
- StatusBadge
- Input
- QuantitySelector
- ServiceSelector
- ClothingItemCard
- OrderCard
- CustomerCard
- StepIndicator
- BottomNavigation
- Modal
- BottomSheet
- Toast

Do not create slightly different versions of the same component without a clear reason.

---

## Responsive Rules

Document mobile and desktop behavior.

Mobile target:

390 × 844

Other important sizes:

393 × 852
430 × 932

Desktop should use an application shell rather than simply stretching the mobile layout.

---

## Design Fidelity Rule

Whenever implementing a new screen:

1. Inspect the reference screenshot.
2. Compare it against `DESIGN_SYSTEM.md`.
3. Reuse existing components and tokens.
4. Do not invent a new visual language.
5. If a new visual decision is necessary, document it in `DESIGN_SYSTEM.md`.

---

# 7. SESSION CONTINUITY RULES

At the start of a new Claude conversation, if the user says:

> "Resume the project."

You MUST:

1. Read `BUILD_PROGRESS.md`.
2. Read `DESIGN_SYSTEM.md`.
3. Inspect the existing project files.
4. Determine the actual implementation state.
5. Compare the codebase with the progress tracker.
6. Identify the unfinished task.
7. Continue from there.
8. Preserve completed functionality.
9. Preserve the established visual system.
10. Do not rebuild the project unnecessarily.

Do not depend on the old chat history.

The repository/project files and the two Markdown files are the persistent project memory.

---

# 8. BEFORE ENDING EVERY DEVELOPMENT SESSION

Before finishing a session:

1. Review what was actually implemented.
2. Test the implemented functionality.
3. Update `BUILD_PROGRESS.md`.
4. Update feature checklists.
5. Update screen status.
6. Record bugs.
7. Record important design decisions.
8. Update `Current Working State`.
9. Add a development log entry.
10. Update `NEXT SESSION HANDOFF`.
11. Update `DESIGN_SYSTEM.md` if a new reusable design decision was introduced.

Never claim something is complete if it does not actually work.

The documentation must reflect the real codebase.

---

# 9. MOBILE-FIRST DESIGN

The primary experience is a mobile staff application.

Target phone size:

**390 × 844**

The application should have:

- Comfortable touch targets
- Large enough buttons
- Clear visual hierarchy
- Minimal typing
- Fast order entry
- Easy one-handed operation where practical

On desktop, create a centered app presentation or sensible responsive shell.

Do not stretch the phone UI unnaturally across a large desktop screen.

---

# 10. GLOBAL VISUAL SYSTEM

## Background

Use a white / warm off-white interface.

## Primary color

Emerald / medium-deep green.

Use green for:

- Primary buttons
- Selected states
- Progress indicators
- Success
- Important actions
- Active navigation

Use very light green for subtle backgrounds.

## Supporting colors

- Charcoal / near-black text
- Muted gray secondary text
- Light gray borders
- Soft pastel status colors

Keep the interface predominantly neutral.

---

# 11. SCREEN 1 — HOME DASHBOARD

Recreate the dashboard reference.

Top:

☰ menu icon

Good Morning,

Ravi

Here's what's happening today

Notification bell on the right.

Four statistic cards:

### Pickups Today
5

### In Processing
8

### Ready for Delivery
4

### Delivered
12

Use subtle icons and pastel backgrounds.

Then:

**+ New Order**

button.

Then:

### Today's Orders

Example:

#1024
Priya Sharma
Pickup · 10:30 AM
Pickup

#1025
Amit Verma
In Process
In Process

#1026
Neha Kapoor
In Process
Ready

#1027
Karan Mehta
Delivered
Delivered

Each order should be clickable.

Bottom navigation:

Home
Orders
Customers
More

Home active.

---

# 12. SCREEN 2 — NEW ORDER / CUSTOMER DETAILS

Title:

**New Order**

Three-step progress:

**1 Customer → 2 Add Items → 3 Review**

Step 1 active.

Customer Details section.

Search:

**Search customer by name or phone**

Existing customer example:

Anjali Mehta

+91 98765 43210

B-12, Green Park Apartments
Sector 21, Noida

Actions for contact/location where appropriate.

Provide:

**+ Add to new customer**

Bottom:

**Next**

Interaction:

- Search existing customer.
- Select customer.
- Create new customer.
- Continue to Add Items.

---

# 13. SCREEN 3 — ADD ITEMS

Title:

**Add Items**

Progress:

Customer ✓ → Add Items → Review

Tabs:

All Items
Popular
Recent

Visual clothing grid:

- Shirt
- T-Shirt
- Jeans
- Pants
- Saree
- Dress
- Bedsheet
- Towel
- Jacket
- Shorts
- Skirt
- More Items

Clicking an item opens Configure Item.

---

# 14. SCREEN 4 — CONFIGURE ITEM

Example:

**Shirt**

Show a large clothing visual.

Quantity:

− 3 +

Services:

### Wash
₹30
per piece

### Iron
₹15
per piece

### Wash + Iron
₹40
per piece

Selected service should have green border/highlight.

Special Instructions:

"e.g. no starch, gentle wash, etc."

Button:

**Add to Order**

Interaction:

- + increases quantity.
- − decreases quantity but never below 1.
- Service selection changes price.
- Total updates.
- Instructions are stored with the item.
- Add to Order returns to item selection/order state.

---

# 15. SCREEN 5 — ORDER SUMMARY

Title:

**Order Summary**

Progress:

Customer ✓
Add Items ✓
Review

Customer card.

Items:

Shirt
Iron
3 × ₹15
₹45

Jeans
Wash
2 × ₹60
₹120

T-Shirt
Iron
4 × ₹15
₹60

Saree
Wash + Iron
1 × ₹80
₹80

Allow:

- Edit
- Delete
- Add More

Subtotal:

₹305

Discount:

₹0

Total:

₹305

Button:

**Create Order**

The totals must be calculated from actual mock state.

---

# 16. SCREEN 6 — ORDER CREATED

After Create Order:

Show large green success state.

**Order Created!**

Order #1028

"The bill has been sent to the customer on WhatsApp."

Buttons:

**View Bill**

**Send Again**

**+ Add Another Order**

**Go to Home**

Buttons must work.

Send Again should show a simulated WhatsApp confirmation.

---

# 17. SCREEN 7 — ORDER DETAILS

Title:

**Order #1028**

Status timeline:

Pickup
→
In Process
→
Ready
→
Delivered

Customer:

Anjali Mehta

+91 98765 43210

B-12, Green Park Apartments, Sector 21, Noida

Actions:

Call
WhatsApp

Items:

Shirt
Iron
3 × ₹15
₹45

Jeans
Wash
2 × ₹60
₹120

T-Shirt
Iron
4 × ₹15
₹60

Saree
Wash + Iron
1 × ₹80
₹80

Subtotal:

₹305

Total:

₹305

Payment status:

Pending

Button:

**Mark as Paid**

Other:

**Edit Order**

**Share Bill**

---

# 18. ORDER STATUS FLOW

The demo must support:

Pickup
↓
Processing
↓
Ready
↓
Out for Delivery
↓
Delivered

When status changes, update:

- Timeline
- Order card
- Dashboard counts
- Order detail screen
- Relevant simulated notifications

Do not hardcode a visual-only timeline.

---

# 19. SCREEN 8 — RECORD PAYMENT

Open as a bottom sheet/modal.

Background order page is dimmed.

Title:

**Record Payment**

Order #1028

Total Amount:

₹305

Pending:

₹305 due

Payment Amount:

₹305

Payment Method:

- Cash
- UPI
- Card
- Other

Cash selected by default.

Notes optional.

Button:

**Confirm Payment**

After confirmation:

- Payment becomes Paid.
- Order updates.
- Dashboard updates.
- Show toast:
  **Payment Recorded Successfully**
- Simulate:
  **WhatsApp payment confirmation sent**

---

# 20. SCREEN 9 — INVOICE / BILL

Create a polished invoice screen/modal.

Include:

Shop logo placeholder

Shop name

Laundry & Ironing Services

Invoice #1028

Date

Customer details

Itemized services

Subtotal

Discount

Total

Payment status

Buttons:

**Download PDF**

**Share Bill**

For the demo, downloading can generate a printable HTML/PDF-like invoice or use browser print functionality.

---

# 21. SCREEN 10 — DELIVERED / CUSTOMER FEEDBACK ENTRY

When the order is delivered, show a customer-facing style screen.

Hero visual:

Freshly folded clothes/towels.

Headline:

**Your order has been delivered! 🎉**

Text:

"Thank you for trusting us with your clothes."

Then:

"We'd love to know how we did."

Primary:

**★ Give Feedback**

Follow Us:

Instagram
Facebook
Google
YouTube

Footer:

**Fresh Clothes. Happier You. 💚**

---

# 22. SCREEN 11 — FEEDBACK FORM

Title:

**How was your experience?**

Interactive 1–5 star rating.

Text area:

**Tell us more**

Button:

**Submit Feedback**

After submission:

**Thank you! 💚**

"Your feedback means a lot to us."

Store feedback in local mock state/localStorage.

---

# 23. CUSTOMERS SCREEN

Title:

**Customers**

Search by name/phone.

Example customers:

Anjali Mehta
+91 98765 43210
12 Orders
₹4,850 Spent

Priya Sharma
+91 91234 56789
8 Orders
₹2,960 Spent

Other customers:

Rahul Nair
Sneha Iyer
Amit Verma
Neha Kapoor
Karan Mehta

Clicking a customer opens:

- Details
- Address
- Order history
- Total spent
- Pending amount

---

# 24. ORDERS SCREEN

Title:

**Orders**

Search.

Filters:

All
Pickup
Processing
Ready
Delivered

Each order card shows:

- Order number
- Customer
- Item count
- Total
- Status
- Payment status

Clicking opens Order Details.

---

# 25. MORE SCREEN

Include:

### Pricing

Manage service prices.

### Clothing Items

Manage clothing types.

### WhatsApp Templates

Preview message templates.

### Reports

Revenue/order statistics.

### Staff

Staff management.

### Settings

Business information and social links.

These can be lightweight demo screens.

---

# 26. PRICING SCREEN

Editable pricing table.

Example:

| Item | Wash | Iron | Wash + Iron |
|---|---:|---:|---:|
| Shirt | ₹30 | ₹15 | ₹40 |
| T-Shirt | ₹25 | ₹15 | ₹35 |
| Jeans | ₹60 | ₹25 | ₹75 |
| Saree | ₹60 | ₹30 | ₹80 |

Changing prices should affect new orders.

Persist pricing in localStorage.

---

# 27. WHATSAPP SIMULATION

There is no real WhatsApp integration in this demo.

Instead, simulate WhatsApp behavior.

When actions occur:

- Order created
- Payment received
- Order ready
- Order delivered

show:

**WhatsApp message sent ✓**

Allow the user to open a message preview.

Example:

```text
Hi Anjali 👋

Your order #1028 has been received.

Shirt × 3 — Iron
Jeans × 2 — Wash
T-Shirt × 4 — Iron
Saree × 1 — Wash + Iron

Total: ₹305

Thank you for choosing FreshPress Laundry.
```

The demo should make it obvious that the real product can later connect to the WhatsApp Business API.

---

# 28. CUSTOMER COMMUNICATION MESSAGES

Prepare simulated templates for:

## Order Created

Hi {{customer_name}} 👋

Your laundry order #{{order_number}} has been received.

{{items}}

Total: ₹{{total}}

Thank you for choosing {{shop_name}}.

---

## Payment Confirmation

Hi {{customer_name}},

We received your payment of ₹{{amount}} for order #{{order_number}}.

Thank you.

---

## Ready

Hi {{customer_name}},

Your laundry order #{{order_number}} is ready.

We look forward to returning your freshly cleaned clothes.

---

## Out for Delivery

Hi {{customer_name}},

Your order #{{order_number}} is out for delivery.

---

## Delivered / Feedback

🎉 Your order has been delivered!

Thank you for trusting us with your clothes.

We'd love to know how we did.

⭐ Share your feedback

Follow us:
Instagram
Facebook
Google
YouTube

---

# 29. FUNCTIONALITY REQUIREMENTS

The prototype must genuinely work.

Implement:

- Bottom navigation
- SPA-style navigation without full page reloads
- Customer search
- Customer selection
- Customer creation
- Clothing selection
- Quantity controls
- Service selection
- Dynamic pricing
- Special instructions
- Multiple order items
- Item editing
- Item deletion
- Order creation
- Order detail navigation
- Status transitions
- Payment modal
- Payment method
- Paid/pending state
- Invoice preview
- Simulated WhatsApp
- Feedback form
- Customer search
- Order search
- Order filtering
- Editable pricing
- LocalStorage persistence

---

# 30. DATA MODEL

Use clean JavaScript objects/types for:

- Customer
- Order
- OrderItem
- ClothingItem
- Service
- Payment
- Feedback
- Staff

Keep mock data separate from UI code.

Example conceptual order:

```js
{
  id: "1028",
  customerId: "customer-001",
  items: [
    {
      clothingType: "shirt",
      quantity: 3,
      service: "iron",
      unitPrice: 15,
      instructions: ""
    }
  ],
  total: 305,
  paymentStatus: "pending",
  orderStatus: "pickup"
}
```

Use the actual structure needed by the implementation, but keep the architecture clean.

---

# 31. LOCAL STORAGE

Persist:

- Customers
- Orders
- Pricing
- Payment status
- Feedback
- Relevant demo settings

Refreshing the browser should not destroy the demo state.

Provide a sensible way to reset demo data if necessary.

---

# 32. MICRO-INTERACTIONS

Use subtle animations:

- Page transitions
- Button press feedback
- Bottom-sheet slide-up
- Success check animation
- Toasts
- Quantity changes
- Selected service animation
- Status transition feedback

Do not over-animate.

The application should feel polished, not flashy.

---

# 33. UX PRIORITY

Prioritize:

**Speed → Clarity → Ease of Use → Visual Polish**

not:

**Complexity → Fancy animations → Excessive dashboards**

A shop employee should understand the application with almost no training.

The ideal goal is:

**A complete order can be entered in under one minute.**

---

# 34. CLOTHING ENTRY UX

Do not make staff type everything manually.

Use visual clothing cards:

👔 Shirt
👕 T-Shirt
👖 Jeans
👖 Pants
🥻 Saree
👗 Dress

Click item → choose quantity → choose service → add.

The experience should be fast enough for someone standing at a customer's door collecting clothes.

---

# 35. RESPONSIVE DESIGN

Mobile is the priority.

Target:

390 × 844
393 × 852
430 × 932

On desktop:

- Center the application.
- Use a sensible app shell.
- Maintain mobile proportions where appropriate.
- Do not simply stretch the mobile UI to full width.

---

# 36. CODE QUALITY

Use reusable components/functions.

Examples:

- Button
- Card
- StatusBadge
- Input
- QuantitySelector
- ServiceSelector
- ClothingItemCard
- OrderCard
- CustomerCard
- StepIndicator
- BottomNavigation
- Modal
- BottomSheet
- Toast

Avoid duplicate styling and duplicated logic.

Use CSS variables for the design system.

Keep mock data separate.

Keep business logic separate from rendering where practical.

---

# 37. TESTING BEFORE COMPLETION

Before declaring the demo complete, manually test the main journey:

Dashboard
→ New Order
→ Customer
→ Add Shirt
→ Select Iron
→ Add Jeans
→ Select Wash
→ Review
→ Create Order
→ Order Created
→ View Order
→ Mark Paid
→ Mark Processing
→ Mark Ready
→ Mark Out for Delivery
→ Mark Delivered
→ Feedback
→ Submit Feedback

Verify that:

- Totals remain correct.
- State remains synchronized.
- Navigation works.
- Buttons work.
- Search works.
- Filters work.
- Payment state updates.
- Status updates.
- LocalStorage persists.
- No major console errors exist.

---

# 38. DEMO DATA

Use realistic Indian data.

Customers:

- Anjali Mehta
- Priya Sharma
- Rahul Nair
- Sneha Iyer
- Amit Verma
- Neha Kapoor
- Karan Mehta

Primary demo scenario:

Customer:
Anjali Mehta

Phone:
+91 98765 43210

Address:
B-12, Green Park Apartments, Sector 21, Noida

Order:
#1028

Items:

Shirt × 3 — Iron — ₹45

Jeans × 2 — Wash — ₹120

T-Shirt × 4 — Iron — ₹60

Saree × 1 — Wash + Iron — ₹80

Total:

₹305

Use INR everywhere.

---

# 39. DO NOT OVERDESIGN

This is an operational application.

Do not introduce unnecessary features just to make the prototype look impressive.

Do not create complicated charts everywhere.

Do not add unnecessary animations.

Do not add a customer app unless specifically requested.

The customer experience is primarily:

**WhatsApp + feedback link**

The staff experience is:

**Mobile app**

The owner experience can later become:

**Web admin panel**

For this demo, keep the focus on the staff workflow.

---

# 40. IMPLEMENTATION ORDER

Build in this order:

### Phase 1
Foundation
- HTML structure
- CSS design system
- JavaScript state
- Routing/navigation
- LocalStorage
- BUILD_PROGRESS.md
- DESIGN_SYSTEM.md

### Phase 2
Core order workflow
- Dashboard
- Customer selection
- Add items
- Configure item
- Order summary
- Order creation

### Phase 3
Order management
- Order details
- Status transitions
- Payment
- Invoice

### Phase 4
Customer communication
- WhatsApp simulation
- Delivered screen
- Feedback

### Phase 5
Management
- Customers
- Orders
- Pricing
- More/settings

### Phase 6
Polish
- Animations
- Responsive behavior
- Edge cases
- Testing
- Visual refinement

Do not move forward blindly if an earlier phase is broken.

---

# 41. FINAL PRODUCT STANDARD

The final prototype should look like a **real product that could be shown to a laundry business owner**.

When the client sees it, they should immediately understand:

> "This is where my staff will record the clothes, select washing/ironing, generate the bill, track the order, collect payment, and communicate with my customers."

It should feel:

- Production-quality
- Cohesive
- Premium
- Fast
- Simple
- Trustworthy

The reference screenshots are the visual benchmark.

---

# 42. FIRST ACTION

Before writing substantial UI code:

1. Inspect all supplied reference screenshots.
2. Identify their common design language.
3. Create `DESIGN_SYSTEM.md`.
4. Create `BUILD_PROGRESS.md`.
5. Set up the project structure.
6. Build the core application shell.
7. Implement the main workflow.
8. Test each step.
9. Keep both Markdown files updated throughout the project.

Do not wait until the end to create the documentation.

---

# 43. IMPORTANT SESSION RULE

When I start a new Claude conversation and say:

> **"Resume the laundry management system. Read BUILD_PROGRESS.md and DESIGN_SYSTEM.md first, inspect the current codebase, and continue from the NEXT SESSION HANDOFF. Do not rebuild completed functionality."**

You should treat that as the continuation command.

Do not ask me to explain the project again unless the files genuinely do not contain the required information.

Read the files first.

Inspect the current implementation.

Then continue exactly where the previous session stopped.

---

# 44. FINAL RULE

The two files have different responsibilities:

**BUILD_PROGRESS.md**
= Where the project is.

**DESIGN_SYSTEM.md**
= How the project should look.

Keep both synchronized with the actual codebase throughout development.

**Implement → Test → Document → Continue.**
