# Smoke Test — Chrome MCP Relay Session

**Date:** March 7, 2026
**Agent:** GitHub Copilot (Claude Sonnet 4.6)
**Tool:** Chrome MCP Server Relay (browser automation via `mcp_io_github_chr_*` tools)
**Workspace:** `d:\Git\vibe-e-commerce`
**App Under Test:** Vibe Shop — `http://localhost:3000/`

---

## Session Overview

This session used the Chrome MCP relay to perform a full end-to-end smoke test of the Vibe Shop e-commerce application entirely through browser automation. No code was modified. The agent navigated the live app, interacted with every major user flow, and captured bugs, UX issues, and improvement suggestions.

---

## How the Chrome MCP Relay Was Used

The Chrome MCP relay provides a set of browser automation tools that allow the Copilot agent to control a running Chrome browser session programmatically within the chat. Tools used during this session:

| Tool | Purpose |
|------|---------|
| `mcp_io_github_chr_take_screenshot` | Capture the current viewport as an image for visual inspection |
| `mcp_io_github_chr_navigate_page` | Navigate to URLs or use browser history (back/forward) |
| `mcp_io_github_chr_click` | Click buttons, links, and interactive elements |
| `mcp_io_github_chr_fill` | Type text into input fields |
| `mcp_io_github_chr_evaluate_script` | Run arbitrary JavaScript in the page context |
| `mcp_io_github_chr_take_snapshot` | Capture a DOM/accessibility tree snapshot |
| `mcp_io_github_chr_list_console_messages` | Read browser console output for JS errors |
| `mcp_io_github_chr_resize_page` | Attempt to resize the browser viewport (for mobile testing) |

This approach enables a real browser smoke test without requiring any test framework (Jest, Playwright, Cypress) to be installed in the project.

---

## Flows Tested

1. **Homepage & product listing** — hero banner, product grid (20 products), badges, out-of-stock state, footer
2. **Category filtering** — all 6 category buttons (`All`, `Electronics`, `Clothing`, `Home & Kitchen`, `Books`, `Sports & Outdoors`, `Beauty`); URL query param updates
3. **Sort options** — all 5 sort modes (`Featured`, `Price: Low to High`, `Price: High to Low`, `Avg. Rating`, `Most Reviewed`); correct reordering confirmed
4. **Search** — keyword search via button click; result count; "Clear" button; URL state
5. **Add to cart & cart drawer** — add item, open drawer, quantity +/−, remove item, totals (subtotal + 8% tax + free shipping)
6. **Checkout (Shipping step)** — form field validation, all fields filled, step progression
7. **Checkout (Payment step)** — card number auto-formatting, all fields filled, step progression
8. **Order confirmation** — order number, delivery date, 4-stage tracker, address summary, cart cleared
9. **Mobile layout** — simulated 390px viewport via `document.documentElement.style.width`

---

## Findings

### Bugs

#### B1 — Checkout skips the "Review" step
**Severity:** Critical

The progress indicator displays three steps: Shipping → Payment → **Review**. Clicking Continue on the Payment step skips Step 3 entirely and navigates directly to `/order-confirmation`. Customers never get to review their order before placing it.

---

#### B2 — Product grid does not reflow on mobile (390px)
**Severity:** Critical

At a 390px viewport width (iPhone screen size), the product grid remains a 5-column horizontal layout. Product names are truncated to 2–3 characters ("Son W...", "App ip...", "Log M..."), prices are clipped, and the layout is functionally unusable. This indicates the product card grid is missing responsive Tailwind breakpoint classes (e.g. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`).

The category filter buttons and sort dropdown reflow correctly; the product grid does not.

![Mobile layout broken — 5 columns at 390px](../client/public/placeholder.png)

---

#### B3 — Cart badge only renders on `/checkout`, not on product listing
**Severity:** High

The cart item count badge on the navbar icon is visible when on the checkout page but absent on the main product listing page (`/`). The badge is conditionally rendered based on route rather than cart state.

---

#### B4 — Multiple broken product images
**Severity:** High

Three products display broken or incorrect images due to stale/invalid Unsplash CDN URLs:

| Product | Symptom |
|---------|---------|
| Carhartt Men's Loose Fit Heavyweight Hoodie | Shows badge alt text only ("AMAZON CHOICE") |
| Samsung 27" Curved Gaming Monitor QHD 165Hz | Broken image icon |
| Anker 65W GaN USB-C Charger, 4-Port | Broken image icon |

---

### UX Issues

#### U1 — Search resets category and sort state
**Severity:** High

Scenario: user navigates to Electronics, sorts by price ascending (`?category=Electronics&sort=price_asc`), then searches for "headphones". The resulting URL becomes `?search=headphones`, losing both the category and sort context. Search params should be merged into the existing query string rather than replacing it.

---

#### U2 — No live/instant search
**Severity:** Medium

Typing in the search box produces no result changes until the user clicks the Search button or presses Enter. Debounced live filtering (e.g. 300ms after last keystroke) is the expected behavior on modern e-commerce sites.

---

#### U3 — "Add to Cart" button has no in-cart indicator
**Severity:** Medium

After adding a product to the cart, the product card button remains unchanged ("Add to Cart"). There is no visual indication the item is already in the cart (e.g. "✓ In Cart" label, changed button color, or a quantity badge on the card).

---

#### U4 — State field is a free-text input
**Severity:** Medium

The "State *" field in the shipping form accepts any arbitrary text. It should be a `<select>` dropdown listing all 50 US states (plus DC and territories) to ensure valid data and prevent shipping address errors.

---

#### U5 — Only credit card payment accepted
**Severity:** Medium

The payment step supports credit card only (VISA shown). No PayPal, Apple Pay, Google Pay, or buy-now-pay-later options. Studies show ~40% of shoppers abandon checkout if their preferred payment method is unavailable.

---

#### U6 — Browser tab title never updates
**Severity:** Low

The `<title>` tag stays "Vibe — Shop Everything" across all pages including Checkout and Order Confirmation. Each page should set a contextual title:

| Route | Suggested Title |
|-------|----------------|
| `/` | `Vibe Shop — Shop Everything` |
| `/checkout` | `Checkout \| Vibe Shop` |
| `/order-confirmation` | `Order Confirmed \| Vibe Shop` |

---

### Missing Features / Enhancements

#### E1 — All 12 footer links are dead
Every link in the footer (About Vibe, Careers, Blog, Gift Cards, Returns, Track Order, Help Center, etc.) points to `http://localhost:3000/`. These should either be implemented as real routes or removed to avoid user confusion.

#### E2 — No product detail page
Clicking a product card image or name does nothing. There is no `/product/:id` route. Users must add to cart without seeing full descriptions, specifications, or additional images. This also blocks SEO indexability.

#### E3 — No coupon/promo code field at checkout
The order summary sidebar in checkout has no mechanism to apply discount or promo codes.

#### E4 — No guest vs. account choice at checkout start
The checkout flow skips any sign-in or guest continuation prompt and goes straight to the shipping form.

#### E5 — Cart does not persist across page refreshes
Cart state lives entirely in React in-memory state (Context). A page refresh empties the cart. At minimum, `localStorage` should be used to persist and rehydrate cart state.

#### E6 — No empty cart drawer state confirmed
Opening the cart drawer with 0 items was not validated to show a useful empty state (e.g. "Your cart is empty — start shopping!").

---

## What Works Well

| Feature | Result |
|---------|--------|
| Category filtering | ✅ URL updates, correct product counts, all 6 work |
| Sort options | ✅ All 5 modes reorder products correctly |
| Search (button-triggered) | ✅ Correct result count, "Clear" button works |
| Cart qty controls | ✅ +/− buttons update totals correctly |
| Tax calculation | ✅ 8% applied correctly on subtotal |
| Free shipping threshold | ✅ Displayed correctly in cart drawer |
| Shipping form validation | ✅ Required field errors fire on empty submit |
| Card number formatting | ✅ Auto-formats with spaces as you type |
| Order confirmation data | ✅ Order #, delivery estimate, 4-step tracker, address all correct |
| Cart cleared after order | ✅ Badge disappears post-confirmation |
| No JS console errors | ✅ Zero errors across all tested flows |

---

## Priority Matrix

| ID | Issue | Priority |
|----|-------|----------|
| B1 | Checkout skips Review step | P0 — Critical |
| B2 | Mobile layout broken at 390px | P0 — Critical |
| B3 | Cart badge missing on listing page | P1 — High |
| B4 | 3 broken product images | P1 — High |
| U1 | Search resets category/sort state | P1 — High |
| E5 | Cart not persisted on refresh | P1 — High |
| U2 | No live/instant search | P2 — Medium |
| U3 | No in-cart indicator on button | P2 — Medium |
| U4 | State field is free-text | P2 — Medium |
| U5 | Only credit card payment | P2 — Medium |
| U6 | Tab title never updates | P2 — Medium |
| E1 | All footer links are dead | P2 — Medium |
| E2 | No product detail page | P3 — Low |
| E3 | No promo code field | P3 — Low |
| E4 | No guest/account choice | P3 — Low |
| E6 | Empty cart drawer state unconfirmed | P3 — Low |
