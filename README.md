# Vibe Shop — Full-Stack E-Commerce App

A full-stack Amazon-inspired e-commerce application built with **React + Tailwind CSS** (frontend) and **Node.js + Express** (backend).

---

## Project Structure

```
vibe-e-commerce/
├── server/                  # Node.js + Express REST API
│   ├── server.js            # Routes: GET /api/products, POST /api/orders
│   └── data/products.js     # 20 mock products across 6 categories
│
└── client/                  # React + Vite + Tailwind CSS SPA
    ├── src/
    │   ├── api/index.js          # Axios wrapper for all API calls
    │   ├── context/CartContext.js # Global cart state via useReducer
    │   ├── components/
    │   │   ├── Navbar.js         # Search bar + cart icon + category nav
    │   │   ├── CartDrawer.js     # Slide-out cart with qty controls + totals
    │   │   ├── ProductCard.js    # Grid card with star rating + add-to-cart
    │   │   └── Footer.js
    │   └── pages/
    │       ├── ProductListing.js  # Product grid + filter/sort
    │       ├── Checkout.js        # 3-step form: Shipping → Payment → Review
    │       └── OrderConfirmation.js
    └── vite.config.js         # Vite with /api proxy → localhost:5000
```

---

## Features

| Feature | Implementation |
|---|---|
| Product grid | Fetches from `GET /api/products`, filter by category + sort |
| Search | Navbar search → query param → server-side filter |
| Add to Cart | React Context (`useReducer`) — auto-opens drawer |
| Cart Drawer | Slide-out with qty +/−, remove, subtotal + tax + shipping |
| Checkout | 3-step wizard: Shipping form → Payment → Review & confirm |
| Order Confirmation | Order number, delivery date, itemized receipt |
| REST API | Express: GET products, GET categories, POST orders |

---

## Quick Start

**1. Install dependencies**
```bash
cd server && npm install
cd ../client && npm install
```

**2. Start the API server** (runs on `http://localhost:5000`)
```bash
cd server && npm start
```

**3. Start the React frontend** (runs on `http://localhost:5173`)
```bash
cd client && npm start
```

**4. Open** `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products (supports `?category=`, `?search=`, `?sort=`) |
| GET | `/api/products/categories` | All unique categories |
| GET | `/api/products/:id` | Single product |
| POST | `/api/orders` | Place an order — returns full order object |
| GET | `/api/health` | Health check |

---

## Tech Stack

- **Frontend**: React 18, React Router v6, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express 4, CORS
- **State**: React Context + useReducer (cart), useState (forms)

Full-stack e-commerce app built with React, Node.js, and MongoDB — developed entirely using GitHub Copilot (Claude Sonnet 4.6) through vibe coding. A React + Node.js e-commerce storefront built by prompting GitHub Copilot with Claude Sonnet 4.6. No boilerplate written by hand.
