"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface OrderRow {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  items: { name: string; price: number; quantity: number; customization?: Record<string, string> }[];
  notes: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: "ממתין",
  confirmed: "אושר",
  shipped: "נשלח",
  delivered: "נמסר",
  cancelled: "בוטל",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-soft/40 text-yellow-700",
  confirmed: "bg-sky/30 text-blue-700",
  shipped: "bg-purple-soft/30 text-purple-700",
  delivered: "bg-green-soft/30 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const updateNotes = async (id: string, notes: string) => {
    await supabase.from("orders").update({ notes }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, notes } : o)));
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ניהול הזמנות</h2>
        <span className="text-sm text-primary/50">{orders.length} הזמנות</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === "all" ? "bg-primary text-white" : "bg-primary/5 text-primary hover:bg-primary/10"}`}
        >
          הכל
        </button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${filter === key ? "bg-primary text-white" : "bg-primary/5 text-primary hover:bg-primary/10"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border border-primary/10 rounded-xl overflow-hidden">
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-sky/5 transition-colors"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-bold text-primary">{order.full_name}</div>
                <div className="text-sm text-primary/50">
                  {new Date(order.created_at).toLocaleDateString("he-IL")} · ₪{order.total}
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColors[order.status] || "bg-gray-100"}`}>
                {statusLabels[order.status] || order.status}
              </span>
              <svg
                className={`w-5 h-5 text-primary/30 transition-transform ${expandedId === order.id ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {expandedId === order.id && (
              <div className="border-t border-primary/10 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-primary">טלפון: </span>
                    <span className="text-primary/70">{order.phone}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-semibold text-primary">כתובת: </span>
                    <span className="text-primary/70">{order.address}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary text-sm mb-2">פריטים:</h4>
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-primary/70 mb-1">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₪{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1">סטטוס</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border border-primary/20 rounded-xl p-2 text-sm focus:outline-none focus:border-pink"
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-primary mb-1">הערות</label>
                    <input
                      type="text"
                      value={order.notes || ""}
                      onChange={(e) => updateNotes(order.id, e.target.value)}
                      className="w-full border border-primary/20 rounded-xl p-2 text-sm focus:outline-none focus:border-pink"
                      placeholder="הוסף הערה..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <p className="text-center text-primary/40 py-8">אין הזמנות</p>
        )}
      </div>
    </div>
  );
}
