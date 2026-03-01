import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-amazon-blue text-gray-400 mt-16">
      {/* Back to top */}
      <div
        className="bg-amazon-blue-light text-white text-sm text-center py-3
                   cursor-pointer hover:bg-gray-600 transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top ↑
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          {
            heading: "Get to Know Us",
            links: ["About Vibe", "Careers", "Press Releases", "Blog"],
          },
          {
            heading: "Make Money with Us",
            links: ["Sell on Vibe", "Advertise Your Products", "Become an Affiliate"],
          },
          {
            heading: "Vibe Payment Products",
            links: ["Vibe Cash", "Gift Cards", "Reload Your Balance"],
          },
          {
            heading: "Let Us Help You",
            links: ["Your Account", "Returns & Replacements", "Help"],
          },
        ].map((col) => (
          <div key={col.heading}>
            <h4 className="text-white font-semibold text-sm mb-3">{col.heading}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    to="/"
                    className="text-sm hover:text-white hover:underline transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Vibe Shop, Inc. — Built with React & Node.js
      </div>
    </footer>
  );
}
