"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getCategories, getProducts } from "@/lib/supabase";
import { Category, Product } from "@/lib/types";

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchBg, setSearchBg] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Delay enabling transitions to prevent flash on initial load
    requestAnimationFrame(() => setMounted(true));
    getCategories().then(setCategories);
    getProducts().then(setAllProducts);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (searchOpen) setSearchOpen(false);
      if (menuOpen) setMenuOpen(false);
    }
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Keep dark header background while search is open or closing
  useEffect(() => {
    if (searchOpen) {
      setSearchBg(true);
      searchRef.current?.focus();
    } else {
      // Keep dark bg until search bar finishes closing (300ms transition)
      const timer = setTimeout(() => setSearchBg(false), 350);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    const results = allProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    ).slice(0, 5);
    setSearchResults(results);
  }, [searchQuery, allProducts]);

  const handleSearchSelect = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/product/${productId}`);
  };

  return (
    <>
      <header className={`text-white sticky top-0 z-50 ease-in-out border-b ${!mounted || searchBg ? "transition-none" : "transition-all duration-500"} ${scrolled || searchBg ? "bg-primary/90 backdrop-blur-md shadow-lg border-transparent" : isHome ? "bg-transparent border-white/15" : "bg-primary border-transparent"}`} role="banner">
        <div className="w-full px-3 md:px-6 py-3 flex items-center justify-between">
          {/* Right side - Hamburger menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט קטגוריות"}
            aria-expanded={menuOpen}
            aria-controls="categories-menu"
          >
            <div className="w-5 h-4 flex flex-col justify-center gap-[4px] relative" aria-hidden="true">
              <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[5.5px] w-5" : "w-5"}`} />
              <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-3.5 opacity-70"}`} />
              <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[5.5px] w-5" : "w-[17px] opacity-85"}`} />
            </div>
          </button>

          {/* Center - Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Artiz - דף הבית">
            <Image src="/logo-white.svg" alt="Artiz" width={110} height={58} priority className="w-[80px] md:w-[110px] h-auto" />
          </Link>

          {/* Left side - Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="חיפוש"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* User / Login - desktop only */}
            <Link href={user ? "/profile" : "/login"} className="hidden md:block p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label={user ? "הפרופיל שלי" : "התחברות"}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors relative" aria-label={`מועדפים${wishlist.length > 0 ? `, ${wishlist.length} פריטים` : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -left-0.5 md:-top-1 md:-left-1 bg-accent text-white text-[9px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors relative" aria-label={`סל קניות${totalItems > 0 ? `, ${totalItems} פריטים` : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -left-0.5 md:-top-1 md:-left-1 bg-accent text-white text-[9px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar - slides down */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            searchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-3 md:px-6 pb-3">
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש מוצרים..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent focus:bg-white/15 transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-3 right-3 md:left-6 md:right-6 mt-1 bg-white rounded-xl shadow-2xl overflow-hidden z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSearchSelect(product.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-sky/5 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-sky/10 flex-shrink-0 relative">
                      {product.image ? (
                        <Image src={product.image} alt="" fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">{product.name}</p>
                      <p className="text-xs text-primary/40">₪{product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Categories Dropdown Menu */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="תפריט קטגוריות"
      >
        <div className="absolute inset-0 bg-black/30" />
        <div
          id="categories-menu"
          className={`absolute top-[62px] right-0 w-72 bg-white shadow-xl rounded-bl-2xl overflow-hidden transition-all duration-300 origin-top-right ${
            menuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
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
              {categories.map((cat, i) => (
                <li key={cat.id}>
                  <Link
                    href={`/category?cat=${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-primary hover:bg-sky/10 transition-colors"
                    style={{ animationDelay: `${i * 30}ms` }}
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
              className="block px-6 py-3 text-accent font-bold hover:bg-accent/5 transition-colors"
            >
              כל המוצרים
            </Link>
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-primary hover:bg-sky/10 transition-colors font-bold"
            >
              בלוג
            </Link>
            {/* Login/Profile - visible only on mobile */}
            <div className="md:hidden">
              <div className="border-t border-primary/10 mx-4" role="separator" />
              <Link
                href={user ? "/profile" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-3 text-primary hover:bg-sky/10 transition-colors font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {user ? "הפרופיל שלי" : "התחברות"}
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Search overlay (close on click outside) */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
        />
      )}
    </>
  );
}
