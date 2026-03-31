"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  image: string;
  created_at: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("created_at");
    if (data) setCategories(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!name || !slug) {
      alert("נא למלא שם ו-slug");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await supabase.from("categories").update({ name, slug }).eq("id", editing);
      } else {
        await supabase.from("categories").insert({ name, slug });
      }
      setShowForm(false);
      setEditing(null);
      setName("");
      setSlug("");
      await load();
    } catch {
      alert("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: CategoryRow) => {
    setName(c.name);
    setSlug(c.slug);
    setEditing(c.id);
    setShowForm(true);
  };

  const handleDelete = async (c: CategoryRow) => {
    if (!confirm(`למחוק את "${c.name}"?`)) return;
    await supabase.from("categories").delete().eq("id", c.id);
    await load();
  };

  const handleNew = () => {
    setName("");
    setSlug("");
    setEditing(null);
    setShowForm(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0590-\u05FFa-z0-9-]/g, "");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ניהול קטגוריות</h2>
        <button
          onClick={handleNew}
          className="bg-pink text-white px-6 py-2 rounded-full font-semibold hover:bg-pink/90 transition-colors text-sm"
        >
          + קטגוריה חדשה
        </button>
      </div>

      {showForm && (
        <div className="bg-sky/5 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-primary">{editing ? "עריכת קטגוריה" : "קטגוריה חדשה"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">שם</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editing) setSlug(generateSlug(e.target.value));
                }}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Slug (אנגלית)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
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
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 bg-white border border-primary/10 rounded-xl p-4">
            <div className="flex-1">
              <div className="font-bold text-primary">{c.name}</div>
              <div className="text-sm text-primary/40" dir="ltr">{c.slug}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="text-primary/50 hover:text-primary text-sm font-semibold"
              >
                ערוך
              </button>
              <button
                onClick={() => handleDelete(c)}
                className="text-red-400 hover:text-red-600 text-sm font-semibold"
              >
                מחק
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-center text-primary/40 py-8">אין קטגוריות עדיין</p>
        )}
      </div>
    </div>
  );
}
