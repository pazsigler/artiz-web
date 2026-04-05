"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadSlideImage } from "@/lib/storage";
import MediaPicker from "@/components/admin/MediaPicker";

interface SlideRow {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image_desktop: string;
  image_mobile: string;
  active: boolean;
  sort_order: number;
}

const emptySlide = {
  title: "",
  subtitle: "",
  cta: "לצפייה במוצרים",
  href: "/category",
  image_desktop: "",
  active: true,
  sort_order: 0,
};

export default function AdminSlides() {
  const [slides, setSlides] = useState<SlideRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptySlide);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaPicker, setMediaPicker] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("hero_slides").select("*").order("sort_order");
    if (data) setSlides(data);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadSlideImage(file);
      setForm((prev) => ({ ...prev, image_desktop: url }));
    } catch {
      alert("שגיאה בהעלאת תמונה");
    } finally {
      setUploading(false);
    }
  };

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
      image_desktop: s.image_desktop || "",
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
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1">תמונת מוצר</label>
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            {form.image_desktop ? (
              <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden border border-primary/10 bg-[#384850]">
                <Image src={form.image_desktop} alt="תמונת מוצר" fill className="object-contain p-4" />
                <button
                  onClick={() => { setForm({ ...form, image_desktop: "" }); if (imageRef.current) imageRef.current.value = ""; }}
                  className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-red-500 text-sm font-bold shadow"
                  aria-label="הסר תמונה"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex gap-3 max-w-md">
                <button
                  onClick={() => imageRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 h-48 border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center gap-2 text-primary/40 hover:border-pink hover:text-pink transition-colors"
                >
                  {uploading ? (
                    <span className="text-sm">מעלה...</span>
                  ) : (
                    <>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-sm font-semibold">העלה חדש</span>
                      <span className="text-xs">PNG עם רקע שקוף</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setMediaPicker(true)}
                  className="flex-1 h-48 border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center gap-2 text-primary/40 hover:border-pink hover:text-pink transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold">בחר מהספרייה</span>
                </button>
              </div>
            )}
            <MediaPicker
              open={mediaPicker}
              onClose={() => setMediaPicker(false)}
              onSelect={(url) => setForm((prev) => ({ ...prev, image_desktop: url }))}
              folder="slides"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="w-20 h-14 rounded-lg overflow-hidden bg-sky/20 flex-shrink-0 relative">
              {s.image_desktop ? (
                <Image src={s.image_desktop} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20 text-xs">ללא תמונה</div>
              )}
            </div>
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
