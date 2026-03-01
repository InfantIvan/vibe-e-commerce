import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  // Guard: if navigated here directly without order data, redirect home
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-20 h-20
                     bg-green-100 rounded-full mb-4"
        >
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed! 🎉
        </h1>
        <p className="text-gray-500 text-base">
          Thank you,{" "}
          <span className="font-semibold text-gray-700">
            {order.customer.name}
          </span>
          ! Your order has been placed successfully.
        </p>
      </div>

      {/* Order summary card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header band */}
        <div className="bg-amazon-blue text-white px-6 py-4 flex flex-wrap gap-4 justify-between items-start">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Order number
            </p>
            <p className="font-mono font-bold text-amazon-yellow text-sm mt-0.5">
              {order.orderId}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Order date
            </p>
            <p className="text-sm font-medium mt-0.5">
              {new Date(order.placedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Estimated delivery
            </p>
            <p className="text-sm font-medium text-green-300 mt-0.5">
              {order.estimatedDelivery}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Delivery progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Order Placed</span>
              <span>Processing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute left-0 top-0 h-2 bg-green-500 rounded-full transition-all"
                style={{ width: "25%" }}
              />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>

          {/* Shipping address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <span>📦</span> Shipping to
              </h3>
              <address className="not-italic text-sm text-gray-600 leading-relaxed">
                {order.customer.name}
                <br />
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && (
                  <>, {order.shippingAddress.line2}</>
                )}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
                <br />
                {order.shippingAddress.country}
              </address>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <span>✉️</span> Confirmation sent to
              </h3>
              <p className="text-sm text-gray-600">{order.customer.email}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              🛍 Items Ordered
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 items-center bg-gray-50 rounded-xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    ${item.lineTotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="border-t border-gray-100 pt-5 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.shipping === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  `$${order.shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base text-gray-900 pt-3 border-t border-gray-100">
              <span>Order Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
        <ol className="space-y-2 text-sm text-blue-700">
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            We'll send a confirmation email to{" "}
            <strong>{order.customer.email}</strong>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            Your order will be processed and packed within 1 business day.
          </li>
          <li className="flex gap-2">
            <span className="font-bold">3.</span>
            You'll receive a tracking number once your order ships.
          </li>
          <li className="flex gap-2">
            <span className="font-bold">4.</span>
            Estimated delivery by{" "}
            <strong>{order.estimatedDelivery}</strong>.
          </li>
        </ol>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link to="/" className="btn-primary flex-1 text-center py-3 text-base">
          Continue Shopping
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-secondary flex-1 py-3 text-base"
        >
          🖨 Print Receipt
        </button>
      </div>
    </div>
  );
}
