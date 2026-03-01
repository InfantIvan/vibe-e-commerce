import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, itemCount, subtotal, isDrawerOpen, closeDrawer, removeItem, updateQuantity } =
    useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeDrawer]);

  if (!isDrawerOpen) return null;

  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <>
      {/* Backdrop */}
      <div
        className="cart-overlay"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50
                   flex flex-col shadow-2xl animate-slide-in"
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-amazon-blue">
          <h2 className="text-lg font-bold text-white">
            Shopping Cart
            {itemCount > 0 && (
              <span className="ml-2 text-amazon-yellow text-sm font-normal">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            className="text-gray-300 hover:text-white transition-colors p-1 rounded"
            aria-label="Close cart"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <svg
                className="h-20 w-20 text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-9-4h4"
                />
              </svg>
              <p className="text-lg font-medium">Your cart is empty</p>
              <button
                onClick={closeDrawer}
                className="btn-primary text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl"
              >
                {/* Product image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  loading="lazy"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-amazon-teal font-semibold text-sm mt-1">
                    ${product.price.toFixed(2)}
                  </p>

                  {/* Qty controls + remove */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1)
                        }
                        className="px-2.5 py-0.5 text-gray-600 hover:bg-gray-200
                                   transition-colors text-base font-bold"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-3 py-0.5 text-sm font-medium border-x border-gray-300 bg-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity + 1)
                        }
                        className="px-2.5 py-0.5 text-gray-600 hover:bg-gray-200
                                   transition-colors text-base font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors
                                 underline-offset-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-800">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — totals + CTA */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 space-y-3">
            {/* Breakdown */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated tax (8%)</span>
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
              {subtotal <= 50 && (
                <p className="text-xs text-gray-400 mt-1">
                  Add ${(50.01 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-200">
                <span>Order Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="btn-primary w-full text-center block text-base py-3"
            >
              Proceed to Checkout →
            </Link>
            <button
              onClick={closeDrawer}
              className="btn-secondary w-full text-sm py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
