"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrder({
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        total: totalPrice,
        userId: user?.id,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          customization: item.customization,
        })),
      });
      clearCart();
      router.push("/");
      alert("ההזמנה נשלחה בהצלחה!");
    } catch {
      alert("שגיאה בשליחת ההזמנה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">תשלום</h1>

      {/* Order Summary */}
      <div className="bg-sky/10 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-primary mb-4">סיכום הזמנה</h2>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-primary/70 mb-2">
            <span>
              {item.product.name} x{item.quantity}
            </span>
            <span>₪{item.product.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t border-primary/10 mt-4 pt-4 flex justify-between font-bold text-primary text-lg">
          <span>סה&quot;כ</span>
          <span>₪{totalPrice}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-primary mb-2">שם מלא</label>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
            placeholder="הכנס שם מלא"
          />
        </div>

        <div>
          <label className="block font-semibold text-primary mb-2">טלפון</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
            placeholder="050-0000000"
          />
        </div>

        <div>
          <label className="block font-semibold text-primary mb-2">כתובת משלוח</label>
          <textarea
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-none h-24"
            placeholder="רחוב, עיר, מיקוד"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "שולח..." : "לתשלום"}
        </button>
      </form>
    </div>
  );
}
