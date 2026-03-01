import React from "react";
import { useCart } from "../context/CartContext";

// Star rating component
function StarRating({ rating, reviewCount }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amazon-yellow" aria-label={`${rating} stars`}>
        {"★".repeat(full)}
        {half && "½"}
        {"☆".repeat(empty)}
      </div>
      <span className="text-xs text-amazon-teal hover:underline cursor-pointer">
        {reviewCount.toLocaleString()}
      </span>
    </div>
  );
}

// Discount % badge
function DiscountBadge({ price, originalPrice }) {
  const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
  if (pct <= 0) return null;
  return (
    <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
      -{pct}%
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const badgeColors = {
    "Best Seller": "bg-amber-100 text-amber-800",
    "Amazon Choice": "bg-blue-100 text-blue-800",
    Deal: "bg-red-100 text-red-700",
  };

  return (
    <article className="card flex flex-col h-full group">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105
                     transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`badge absolute top-2 left-2 ${
              badgeColors[product.badge] || "bg-gray-100 text-gray-700"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-gray-200 text-gray-600">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category pill */}
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        {/* Price row */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <DiscountBadge
            price={product.price}
            originalPrice={product.originalPrice}
          />
        </div>

        {/* Shipping hint */}
        <p className="text-xs text-green-600 font-medium">
          {product.price > 50 ? "✓ FREE Shipping" : "Ships from $9.99"}
        </p>

        {/* Add to cart */}
        <button
          onClick={() => product.inStock && addItem(product)}
          disabled={!product.inStock}
          className={`btn-primary w-full mt-auto text-sm py-2 ${
            !product.inStock ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
