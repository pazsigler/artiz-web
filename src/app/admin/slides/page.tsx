"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SlideRow {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg_gradient: string;
  emoji: string;
  active: boolean;
  sort_order: number;
}

const emptySlide = {
  title: "",
  subtitle: "",
  cta: "לצפייה במוצרים",
  href: "/category",
  bg_gradient: "from-pink/20 to-sky/20",
  emoji: "🎁",
  active: true,
  sort_order: 0,
};

export default function AdminSlides() {
  const [slides, setSlides] = useState<SlideRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptySlide);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("hero_slides").select("*").order("sort_order");
    if (data) setSlides(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title) {
      alert("נא למלא כותרת");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await supabase.from("hero_slides").update(form).eq("id", editing);
      } else {
        await supabase.from("hero_slides").insert(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptySlide);
      await load();
    } catch {
      alert("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s: SlideRow) => {
    setForm({
      title: s.title,
      subtitle: s.subtitle || "",
      cta: s.cta,
      href: s.href,
      bg_gradient: s.bg_gradient,
      emoji: s.emoji || "",
      active: s.active,
      sort_order: s.sort_order,
    });
    setEditing(s.id);
    setShowForm(true);
  };

  const handleDelete = async (s: SlideRow) => {
    if (!confirm(`למחוק את "${s.title}"?`)) return;
    await supabase.from("hero_slides").delete().eq("id", s.id);
    await load();
  };

  const handleNew = () => {
    setForm(emptySlide);
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ניהול סליידים</h2>
        <button
          onClick={handleNew}
          className="bg-pink text-white px-6 py-2 rounded-full font-semibold hover:bg-pink/90 transition-colors text-sm"
        >
          + סלייד חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-sky/5 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-primary">{editing ? "עריכת סלייד" : "סלייד חדש"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">כותרת</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">כותרת משנה</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">טקסט כפתור</label>
              <input
                type="text"
                value={form.cta}
                onChange={(e) => setForm({ ...form, cta: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">לינק</label>
              <input
                type="text"
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">גרדיאנט רקע</label>
              <input
                type="text"
                value={form.bg_gradient}
                onChange={(e) => setForm({ ...form, bg_gradient: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
                placeholder="from-pink/20 to-sky/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">אימוג׳י</label>
              <input
                type="text"
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">סדר</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-5 h-5"
              />
              <label htmlFor="active" className="text-sm font-semibold text-primary">פעיל</label>
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
        {slides.map((s) => (
          <div key={s.id} className="flex items-center gap-4 bg-white border border-primary/10 rounded-xl p-4">
            <span className="text-3xl">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-primary truncate">{s.title}</div>
              <div className="text-sm text-primary/50">{s.subtitle}</div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${s.active ? "bg-green-soft/30 text-green-700" : "bg-gray-100 text-gray-400"}`}>
              {s.active ? "פעיל" : "לא פעיל"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(s)}
                className="text-primary/50 hover:text-primary text-sm font-semibold"
              >
                ערוך
              </button>
              <button
                onClick={() => handleDelete(s)}
                className="text-red-400 hover:text-red-600 text-sm font-semibold"
              >
                מחק
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <p className="text-center text-primary/40 py-8">אין סליידים עדיין</p>
        )}
      </div>
    </div>
  );
}
