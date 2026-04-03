"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getProductsByIds } from "@/lib/supabase";
import { Product } from "@/lib/types";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    getProductsByIds(wishlist)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [wishlist]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-primary/50 text-lg">טוען...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">רשימת המשאלות ריקה</h1>
        <p className="text-primary/60 mb-8">עדיין לא הוספת מוצרים למועדפים</p>
        <Link
          href="/category"
          className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
        >
          לצפייה במוצרים
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">המועדפים שלי</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
            {/* Remove from wishlist */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
              aria-label={`הסר ${product.name} מהמועדפים`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </button>

            <Link href={`/product/${product.id}`}>
              <div className="aspect-square bg-sky/30 flex items-center justify-center relative overflow-hidden">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <span className="text-4xl text-primary/30">🎁</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary group-hover:text-pink transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-primary/60 mt-1">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-primary">₪{product.price}</span>
                  {product.type === "custom" && (
                    <span className="text-xs bg-pink/10 text-pink px-2 py-1 rounded-full">
                      בהתאמה אישית
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4">
              {product.type === "custom" ? (
                <Link
                  href={`/product/${product.id}`}
                  className="block w-full text-center bg-pink text-white py-2.5 rounded-full font-semibold hover:bg-pink/90 transition-colors text-sm"
                >
                  התאמה אישית ורכישה
                </Link>
              ) : (
                <button
                  onClick={() => {
                    addItem(product);
                    setAddedId(product.id);
                    setTimeout(() => setAddedId(null), 2000);
                  }}
                  className={`w-full py-2.5 rounded-full font-semibold transition-colors text-sm ${
                    addedId === product.id
                      ? "bg-green-soft text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {addedId === product.id ? "נוסף לסל ✓" : "הוסף לסל"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
