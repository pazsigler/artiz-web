"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface CouponRow {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number;
  max_discount: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

const emptyForm = {
  code: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: 0,
  min_order: 0,
  max_discount: "",
  max_uses: "",
  expires_at: "",
  active: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    if (data) setCoupons(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.code) { alert("נא למלא קוד קופון"); return; }
    if (form.discount_value <= 0) { alert("נא למלא ערך הנחה"); return; }
    setSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        min_order: form.min_order || 0,
        max_discount: form.max_discount ? Number(form.max_discount) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
        active: form.active,
      };
      if (editing) {
        await supabase.from("coupons").update(payload).eq("id", editing);
      } else {
        await supabase.from("coupons").insert(payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch {
      alert("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: CouponRow) => {
    setForm({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      min_order: c.min_order,
      max_discount: c.max_discount?.toString() || "",
      max_uses: c.max_uses?.toString() || "",
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "",
      active: c.active,
    });
    setEditing(c.id);
    setShowForm(true);
  };

  const handleDelete = async (c: CouponRow) => {
    if (!confirm(`למחוק את הקופון "${c.code}"?`)) return;
    await supabase.from("coupons").delete().eq("id", c.id);
    await load();
  };

  const handleToggleActive = async (c: CouponRow) => {
    await supabase.from("coupons").update({ active: !c.active }).eq("id", c.id);
    await load();
  };

  const formatDiscount = (c: CouponRow) => {
    if (c.discount_type === "percentage") return `${c.discount_value}%`;
    return `${c.discount_value} ₪`;
  };

  const isExpired = (c: CouponRow) => {
    if (!c.expires_at) return false;
    return new Date(c.expires_at) < new Date();
  };

  const isUsedUp = (c: CouponRow) => {
    if (!c.max_uses) return false;
    return c.used_count >= c.max_uses;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ניהול קופונים</h2>
        <button
          onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }}
          className="bg-pink text-white px-6 py-2 rounded-full font-semibold hover:bg-pink/90 transition-colors text-sm"
        >
          + קופון חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-sky/5 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-primary">{editing ? "עריכת קופון" : "קופון חדש"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">קוד קופון</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="לדוגמה: SAVE20"
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink uppercase"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">סוג הנחה</label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percentage" | "fixed" })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink bg-white"
              >
                <option value="percentage">אחוזים (%)</option>
                <option value="fixed">סכום קבוע (₪)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                ערך הנחה {form.discount_type === "percentage" ? "(%)" : "(₪)"}
              </label>
              <input
                type="number"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                min={0}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">תוקף (אופציונלי)</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">סכום מינימום להזמנה (₪)</label>
              <input
                type="number"
                value={form.min_order}
                onChange={(e) => setForm({ ...form, min_order: Number(e.target.value) })}
                min={0}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">הנחה מקסימלית (₪, רלוונטי לאחוזים)</label>
              <input
                type="number"
                value={form.max_discount}
                onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                placeholder="ללא הגבלה"
                min={0}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">מקסימום שימושים</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                placeholder="ללא הגבלה"
                min={0}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="coupon-active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-5 h-5"
              />
              <label htmlFor="coupon-active" className="text-sm font-semibold text-primary">פעיל</label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-8 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? "שומר..." : "שמור"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="border border-primary/20 text-primary px-8 py-2 rounded-full font-semibold hover:bg-primary/5 transition-colors"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="flex items-center gap-4 bg-white border border-primary/10 rounded-xl p-4">
            <div className="w-12 h-12 rounded-xl bg-pink/10 flex items-center justify-center flex-shrink-0">
              <span className="text-pink font-bold text-sm">{formatDiscount(c)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-primary font-mono text-lg tracking-wider" dir="ltr">{c.code}</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {c.min_order > 0 && (
                  <span className="text-xs bg-sky/10 text-primary/60 px-2 py-0.5 rounded-full">
                    מינימום {c.min_order} ₪
                  </span>
                )}
                {c.max_discount && (
                  <span className="text-xs bg-sky/10 text-primary/60 px-2 py-0.5 rounded-full">
                    עד {c.max_discount} ₪ הנחה
                  </span>
                )}
                {c.max_uses && (
                  <span className="text-xs bg-sky/10 text-primary/60 px-2 py-0.5 rounded-full">
                    {c.used_count}/{c.max_uses} שימושים
                  </span>
                )}
                {c.expires_at && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isExpired(c) ? "bg-red-100 text-red-500" : "bg-sky/10 text-primary/60"}`}>
                    {isExpired(c) ? "פג תוקף" : `עד ${new Date(c.expires_at).toLocaleDateString("he-IL")}`}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleToggleActive(c)}
              className={`text-xs px-3 py-1 rounded-full font-semibold cursor-pointer transition-colors ${
                c.active && !isExpired(c) && !isUsedUp(c)
                  ? "bg-green/30 text-green-700 hover:bg-green/50"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              {isExpired(c) ? "פג תוקף" : isUsedUp(c) ? "נוצל" : c.active ? "פעיל" : "לא פעיל"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(c)} className="text-primary/50 hover:text-primary text-sm font-semibold">
                ערוך
              </button>
              <button onClick={() => handleDelete(c)} className="text-red-400 hover:text-red-600 text-sm font-semibold">
                מחק
              </button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <p className="text-center text-primary/40 py-8">אין קופונים עדיין</p>
        )}
      </div>
    </div>
  );
}
