"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-sky/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-3">סל הקניות ריק</h1>
        <p className="text-primary/50 mb-8">עדיין לא הוספת מוצרים לסל</p>
        <Link
          href="/category"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
        >
          לצפייה במוצרים
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">סל קניות</h1>
        <span className="text-primary/40 text-sm">{items.length} פריטים</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item, index) => (
            <div
              key={`${item.product.id}-${index}`}
              className="bg-white rounded-2xl shadow-sm p-4 md:p-6 flex gap-4 hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <Link
                href={`/product/${item.product.id}`}
                className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-sky/10 relative"
              >
                {item.product.image ? (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                    sizes="112px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="font-semibold text-primary hover:text-accent transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-primary/40 text-sm mt-0.5">₪{item.product.price} ליחידה</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-50 text-primary/25 hover:text-red-500 flex items-center justify-center transition-colors"
                    aria-label={`הסר ${item.product.name} מהסל`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Customization Details */}
                {item.customization && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.customization.dedication && (
                      <span className="inline-flex items-center gap-1 text-xs bg-accent/8 text-accent px-2.5 py-1 rounded-full">
                        הקדשה: {item.customization.dedication}
                      </span>
                    )}
                    {item.customization.color && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-primary/5 text-primary/60 px-2.5 py-1 rounded-full">
                        <span
                          className="w-3 h-3 rounded-full border border-primary/10"
                          style={{ backgroundColor: item.customization.color }}
                        />
                        צבע
                      </span>
                    )}
                    {item.customization.font && (
                      <span className="text-xs bg-primary/5 text-primary/60 px-2.5 py-1 rounded-full">
                        פונט: {item.customization.font}
                      </span>
                    )}
                    {item.customization.file && (
                      <span className="text-xs bg-primary/5 text-primary/60 px-2.5 py-1 rounded-full">
                        קובץ מצורף
                      </span>
                    )}
                  </div>
                )}

                {/* Quantity & Subtotal */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1 bg-primary/5 rounded-full">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-9 h-9 rounded-full text-primary hover:bg-primary/10 flex items-center justify-center transition-colors font-bold"
                      aria-label={`הפחת כמות ${item.product.name}`}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-primary text-sm" aria-label={`כמות: ${item.quantity}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-9 h-9 rounded-full text-primary hover:bg-primary/10 flex items-center justify-center transition-colors font-bold"
                      aria-label={`הוסף כמות ${item.product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-primary text-lg">
                    ₪{item.product.price * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
            <h2 className="font-bold text-primary text-lg mb-4">סיכום הזמנה</h2>

            <div className="space-y-3 mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-primary/60 truncate ml-4">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="text-primary/80 font-medium flex-shrink-0">₪{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/10 pt-4 mb-6">
              <div className="flex items-center justify-between text-xl font-bold text-primary">
                <span>סה&quot;כ</span>
                <span>₪{totalPrice}</span>
              </div>
              <p className="text-xs text-primary/35 mt-1">לא כולל משלוח</p>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-accent text-white text-center py-4 rounded-full text-lg font-semibold hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
            >
              המשך לתשלום
            </Link>

            <Link
              href="/category"
              className="block w-full text-center text-primary/50 hover:text-primary text-sm mt-3 transition-colors"
            >
              המשך בקניות
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
