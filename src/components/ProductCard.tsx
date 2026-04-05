"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const isWished = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.type === "custom") return; // custom products need customization page
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
    >
      {/* Image */}
      <div className="aspect-square bg-sky/20 flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky/20 to-lavender/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Overlay actions on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick add to cart button */}
        {product.type !== "custom" && (
          <button
            onClick={handleAddToCart}
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
              added
                ? "bg-success text-primary translate-y-0 opacity-100"
                : "bg-white text-primary translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-accent hover:text-white"
            }`}
            aria-label={`הוסף ${product.name} לסל`}
          >
            {added ? "נוסף! ✓" : "הוסף לסל"}
          </button>
        )}

        {/* Custom badge on image */}
        {product.type === "custom" && (
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-xs font-semibold bg-accent/90 text-white shadow-lg translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            בהתאמה אישית
          </span>
        )}

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
            isWished
              ? "bg-accent text-white scale-100 opacity-100"
              : "bg-white/80 text-primary/40 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 hover:text-accent"
          }`}
          aria-label={isWished ? `הסר ${product.name} מהמועדפים` : `הוסף ${product.name} למועדפים`}
        >
          <svg className="w-4 h-4" fill={isWished ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-primary/50 mt-1 line-clamp-1">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            ₪{product.price}
          </span>
        </div>
      </div>
    </Link>
  );
}
