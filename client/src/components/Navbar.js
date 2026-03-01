import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { itemCount, openDrawer } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 shadow-md">
      {/* Main bar */}
      <div className="bg-amazon-blue text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 text-2xl font-bold tracking-tight text-amazon-yellow"
          >
            vibe<span className="text-white text-xs align-super">shop</span>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex max-w-2xl mx-auto"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 h-10 px-4 text-gray-900 text-sm rounded-l-lg
                         focus:outline-none focus:ring-2 focus:ring-amazon-yellow"
            />
            <button
              type="submit"
              className="bg-amazon-yellow hover:bg-amazon-yellow-dark h-10 px-4
                         rounded-r-lg flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </button>
          </form>

          {/* Cart button */}
          <button
            onClick={openDrawer}
            className="flex items-center gap-2 hover:text-amazon-yellow
                       transition-colors relative"
            aria-label="Open cart"
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-9-4h4"
                />
              </svg>
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-amazon-yellow text-gray-900
                                text-xs font-bold rounded-full h-5 w-5 flex items-center
                                justify-center"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium">Cart</span>
          </button>
        </div>
      </div>

      {/* Secondary nav */}
      <div className="bg-amazon-blue-light text-white px-4 py-1.5 text-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto whitespace-nowrap">
          {["All", "Electronics", "Clothing", "Home & Kitchen", "Books", "Sports & Outdoors", "Beauty"].map(
            (cat) => (
              <Link
                key={cat}
                to={cat === "All" ? "/" : `/?category=${encodeURIComponent(cat)}`}
                className="hover:text-amazon-yellow transition-colors py-0.5"
              >
                {cat}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
