"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-6">🛒</span>
        <h1 className="text-3xl font-bold text-primary mb-4">סל הקניות ריק</h1>
        <p className="text-primary/60 mb-8">עדיין לא הוספת מוצרים לסל</p>
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">סל קניות</h1>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.product.id}-${index}`}
            className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row gap-4"
          >
            {/* Product Image */}
            <div className="w-24 h-24 bg-sky/20 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-2xl">🎁</span>
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-primary">{item.product.name}</h3>
                  <p className="text-primary/60 text-sm">₪{item.product.price}</p>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-primary/30 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Customization Details */}
              {item.customization && (
                <div className="mt-2 text-sm text-primary/50 space-y-1">
                  {item.customization.dedication && (
                    <p>הקדשה: {item.customization.dedication}</p>
                  )}
                  {item.customization.color && (
                    <p className="flex items-center gap-2">
                      צבע:{" "}
                      <span
                        className="w-4 h-4 rounded-full inline-block"
                        style={{ backgroundColor: item.customization.color }}
                      />
                    </p>
                  )}
                  {item.customization.font && <p>פונט: {item.customization.font}</p>}
                  {item.customization.file && <p>קובץ: {item.customization.file}</p>}
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-primary/5 text-primary hover:bg-primary/10 flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-semibold text-primary">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-primary/5 text-primary hover:bg-primary/10 flex items-center justify-center"
                >
                  +
                </button>
                <span className="mr-auto font-bold text-primary">
                  ₪{item.product.price * item.quantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total & Checkout */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between text-xl font-bold text-primary mb-6">
          <span>סה&quot;כ</span>
          <span>₪{totalPrice}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-primary text-white text-center py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          לתשלום
        </Link>
      </div>
    </div>
  );
}
