import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../api";

const STEPS = ["Shipping", "Payment", "Review"];

// Reusable form field
function Field({ label, id, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input id={id} className={`input-field ${error ? "border-red-400" : ""}`} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const setField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate step 0 (shipping)
  const validateShipping = () => {
    const required = ["firstName", "lastName", "email", "address1", "city", "state", "zip"];
    const newErrors = {};
    required.forEach((k) => {
      if (!form[k].trim()) newErrors[k] = "This field is required";
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 1 (payment)
  const validatePayment = () => {
    const newErrors = {};
    if (!form.cardName.trim()) newErrors.cardName = "Required";
    if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Enter a valid card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry))
      newErrors.expiry = "Use MM/YY format";
    if (!/^\d{3,4}$/.test(form.cvv)) newErrors.cvv = "3-4 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApiError("");
    try {
      const payload = {
        customer: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          line1: form.address1,
          line2: form.address2,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      };
      const order = await api.placeOrder(payload);
      clearCart();
      navigate("/order-confirmation", { state: { order } });
    } catch (err) {
      setApiError(
        err?.response?.data?.error || "Failed to place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items before heading to checkout.</p>
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-amazon-teal hover:underline">
          Home
        </Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Checkout</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Secure Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
                  ${i < step
                    ? "bg-green-500 text-white"
                    : i === step
                    ? "bg-amazon-blue text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm font-medium ${
                  i === step ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* ── Step 0: Shipping ───────────────────────────────── */}
            {step === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">📦</span> Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="First Name *"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={setField}
                    placeholder="Jane"
                    error={errors.firstName}
                  />
                  <Field
                    label="Last Name *"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={setField}
                    placeholder="Doe"
                    error={errors.lastName}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Email *"
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={setField}
                    placeholder="jane@example.com"
                    error={errors.email}
                  />
                  <Field
                    label="Phone"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={setField}
                    placeholder="+1 (555) 000-0000"
                    error={errors.phone}
                  />
                </div>
                <Field
                  label="Address Line 1 *"
                  id="address1"
                  name="address1"
                  value={form.address1}
                  onChange={setField}
                  placeholder="123 Main St"
                  error={errors.address1}
                />
                <Field
                  label="Address Line 2"
                  id="address2"
                  name="address2"
                  value={form.address2}
                  onChange={setField}
                  placeholder="Apt, Suite, etc. (optional)"
                  error={errors.address2}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Field
                    label="City *"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={setField}
                    placeholder="New York"
                    error={errors.city}
                  />
                  <Field
                    label="State *"
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={setField}
                    placeholder="NY"
                    error={errors.state}
                  />
                  <Field
                    label="ZIP Code *"
                    id="zip"
                    name="zip"
                    value={form.zip}
                    onChange={setField}
                    placeholder="10001"
                    error={errors.zip}
                  />
                </div>
              </div>
            )}

            {/* ── Step 1: Payment ────────────────────────────────── */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">💳</span> Payment Details
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 flex items-center gap-2">
                  <span>🔒</span>
                  <span>Your payment information is encrypted and secure.</span>
                </div>
                <Field
                  label="Name on Card *"
                  id="cardName"
                  name="cardName"
                  value={form.cardName}
                  onChange={setField}
                  placeholder="Jane Doe"
                  error={errors.cardName}
                />
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <div className="relative">
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={(e) => {
                        // Format with spaces
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
                        setForm((p) => ({ ...p, cardNumber: formatted }));
                        if (errors.cardNumber) setErrors((p) => ({ ...p, cardNumber: "" }));
                      }}
                      className={`input-field pr-16 ${errors.cardNumber ? "border-red-400" : ""}`}
                      placeholder="1234 5678 9012 3456"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                      VISA
                    </span>
                  </div>
                  {errors.cardNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Expiry (MM/YY) *"
                    id="expiry"
                    name="expiry"
                    value={form.expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                      setForm((p) => ({ ...p, expiry: v }));
                      if (errors.expiry) setErrors((p) => ({ ...p, expiry: "" }));
                    }}
                    placeholder="08/27"
                    error={errors.expiry}
                  />
                  <Field
                    label="CVV *"
                    id="cvv"
                    name="cvv"
                    value={form.cvv}
                    onChange={setField}
                    placeholder="123"
                    maxLength={4}
                    error={errors.cvv}
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Review ─────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Shipping review */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">📦 Shipping to</h3>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-sm text-amazon-teal hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {form.firstName} {form.lastName}
                    <br />
                    {form.address1}
                    {form.address2 && `, ${form.address2}`}
                    <br />
                    {form.city}, {form.state} {form.zip}
                    <br />
                    {form.country}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{form.email}</p>
                </div>

                {/* Payment review */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">💳 Payment</h3>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-amazon-teal hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Card ending in{" "}
                    <span className="font-medium">
                      ****{" "}
                      {form.cardNumber.replace(/\s/g, "").slice(-4)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">Expires {form.expiry}</p>
                </div>

                {/* Items review */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    🛍 Items ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-3 items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {quantity} × ${product.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ${(product.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                    {apiError}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  ← Back
                </button>
              ) : (
                <Link to="/" className="btn-secondary">
                  ← Back to Shop
                </Link>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary px-8"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn-primary px-8 text-base flex items-center gap-2 ${
                    submitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Placing Order…
                    </>
                  ) : (
                    <>🔒 Place Order</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Order Summary column */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 text-base mb-4">
              Order Summary
            </h3>
            {/* Item thumbnails */}
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-2 items-center">
                  <div className="relative flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span
                      className="absolute -top-1.5 -right-1.5 bg-gray-600 text-white
                                   text-xs rounded-full h-4 w-4 flex items-center justify-center"
                    >
                      {quantity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 flex-1 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-xs font-semibold text-gray-800 flex-shrink-0">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-4 space-y-1.5 text-xs text-gray-500">
              <p className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> Secure 256-bit SSL checkout
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> Free returns within 30 days
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> Order tracking & notifications
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
