import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { api } from "../api";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "reviews", label: "Most Reviewed" },
];

// Skeleton placeholder while loading
function ProductSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-9 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  );
}

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "default";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (category !== "All") params.category = category;
      if (search) params.search = search;
      if (sort !== "default") params.sort = sort;

      const data = await api.getProducts(params);
      setProducts(data.products);
      setTotalCount(data.count);
    } catch (err) {
      setError("Failed to load products. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "All" && value !== "default") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero banner */}
      {!search && category === "All" && (
        <div
          className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r
                     from-amazon-blue to-amazon-blue-light text-white p-10"
        >
          <div className="relative z-10">
            <p className="text-amazon-yellow font-semibold text-sm uppercase tracking-widest mb-2">
              Everything you need
            </p>
            <h1 className="text-4xl font-bold mb-3">Shop the Latest Deals</h1>
            <p className="text-gray-300 text-lg max-w-md">
              Discover top products across every category — fast shipping, great prices.
            </p>
          </div>
        </div>
      )}

      {/* Filter + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setParam("category", cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border
                ${
                  category === cat
                    ? "bg-amazon-blue text-white border-amazon-blue shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:border-amazon-blue hover:text-amazon-blue"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="input-field py-1.5 text-sm w-auto pr-8"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results header */}
      {!loading && (
        <div className="flex items-center gap-2 mb-4">
          {search && (
            <p className="text-gray-700 text-sm">
              Showing results for{" "}
              <span className="font-semibold text-gray-900">"{search}"</span>
              <button
                onClick={() => setParam("search", "")}
                className="ml-2 text-amazon-teal hover:underline text-xs"
              >
                Clear
              </button>
            </p>
          )}
          <p className="text-gray-500 text-sm ml-auto">
            {totalCount} result{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center mb-6">
          <p className="font-semibold mb-1">Oops!</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 btn-primary text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-semibold text-gray-600">No products found</p>
          <p className="text-sm mt-2">Try a different search or category</p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 btn-primary text-sm"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
