"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getCategories } from "@/lib/supabase";
import { Category } from "@/lib/types";

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && menuOpen) {
      setMenuOpen(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header className={`text-white sticky top-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "bg-primary/90 backdrop-blur-md shadow-lg" : "bg-primary"}`} role="banner">
        <div className="w-full px-6 py-3 flex items-center justify-between">
          {/* Right side - Hamburger menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט קטגוריות"}
            aria-expanded={menuOpen}
            aria-controls="categories-menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Center - Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Artiz - דף הבית">
            <Image src="/logo-white.svg" alt="Artiz" width={110} height={58} priority />
          </Link>

          {/* Left side - Icons */}
          <div className="flex items-center gap-4">
            {/* User / Login */}
            <Link href={user ? "/profile" : "/login"} className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label={user ? "הפרופיל שלי" : "התחברות"}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 hover:bg-white/10 rounded-lg transition-colors relative" aria-label={`מועדפים${wishlist.length > 0 ? `, ${wishlist.length} פריטים` : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -left-1 bg-pink text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 hover:bg-white/10 rounded-lg transition-colors relative" aria-label={`סל קניות${totalItems > 0 ? `, ${totalItems} פריטים` : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -left-1 bg-pink text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Categories Dropdown Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} role="dialog" aria-modal="true" aria-label="תפריט קטגוריות">
          <div
            id="categories-menu"
            className="absolute top-[62px] right-0 w-72 bg-white shadow-xl rounded-bl-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <nav aria-label="קטגוריות" className="py-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-primary hover:bg-sky/10 transition-colors font-bold"
              >
                דף הבית
              </Link>
              <div className="border-t border-primary/10 mx-4" role="separator" />
              <p className="px-6 py-2 text-xs text-primary/40 font-bold" id="categories-heading">קטגוריות</p>
              <ul aria-labelledby="categories-heading" className="list-none">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category?cat=${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-3 text-primary hover:bg-sky/10 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-primary/10 mx-4" role="separator" />
              <Link
                href="/category"
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-pink font-bold hover:bg-pink/5 transition-colors"
              >
                כל המוצרים
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
