const express = require("express");
const cors = require("cors");
const products = require("./data/products");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ─── Product Routes ───────────────────────────────────────────────────────────

// GET /api/products  — list all (optionally filter by category or search query)
app.get("/api/products", (req, res) => {
  const { category, search, sort } = req.query;

  let result = [...products];

  if (category && category !== "All") {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
  if (sort === "reviews") result.sort((a, b) => b.reviewCount - a.reviewCount);

  res.json({
    count: result.length,
    products: result,
  });
});

// GET /api/products/categories  — list all unique categories
app.get("/api/products/categories", (req, res) => {
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  res.json(categories);
});

// GET /api/products/:id  — single product detail
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product)
    return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// ─── Order Routes ─────────────────────────────────────────────────────────────

// POST /api/orders  — create new order
app.post("/api/orders", (req, res) => {
  const { customer, items, shippingAddress } = req.body;

  // Basic validation
  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  // Calculate totals server-side for safety
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = parseFloat((subtotal + tax + shipping).toFixed(2));

  // Simulate estimated delivery (5-7 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const options = { weekday: "long", month: "long", day: "numeric" };
  const estimatedDelivery = deliveryDate.toLocaleDateString("en-US", options);

  const order = {
    orderId: `VBE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "confirmed",
    customer,
    shippingAddress,
    items: items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        name: product?.name || "Unknown",
        image: product?.image || "",
        price: product?.price || 0,
        quantity: item.quantity,
        lineTotal: product
          ? parseFloat((product.price * item.quantity).toFixed(2))
          : 0,
      };
    }),
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax,
    shipping,
    total,
    estimatedDelivery,
    placedAt: new Date().toISOString(),
  };

  // In a real app we'd persist to DB here
  res.status(201).json(order);
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🛒  Vibe E-Commerce API running on http://localhost:${PORT}\n`);
});
