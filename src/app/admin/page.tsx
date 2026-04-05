"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, pendingOrders: 0 });

  useEffect(() => {
    async function loadStats() {
      const [products, categories, orders, pending] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        products: products.count || 0,
        categories: categories.count || 0,
        orders: orders.count || 0,
        pendingOrders: pending.count || 0,
      });
    }
    loadStats();
  }, []);

  const cards = [
    { label: "מוצרים", value: stats.products, color: "bg-sky/20 text-primary" },
    { label: "קטגוריות", value: stats.categories, color: "bg-green/20 text-primary" },
    { label: "הזמנות", value: stats.orders, color: "bg-lavender/20 text-primary" },
    { label: "ממתינות לטיפול", value: stats.pendingOrders, color: "bg-pink/20 text-pink" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-6">סקירה כללית</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} rounded-2xl p-6 text-center`}>
            <div className="text-3xl font-bold mb-2">{card.value}</div>
            <div className="text-sm font-semibold">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
