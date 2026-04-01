"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadPageImage } from "@/lib/storage";

interface PageRow {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string;
  updated_at: string;
}

export default function AdminPages() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingSlug, setEditingSlug] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("site_pages").select("*").order("slug");
    if (data) setPages(data);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadPageImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      alert("שגיאה בהעלאת תמונה");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (p: PageRow) => {
    setForm({ title: p.title, content: p.content || "", image: p.image || "" });
    setEditing(p.id);
    setEditingSlug(p.slug);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) { alert("נא למלא כותרת"); return; }
    setSaving(true);
    try {
      await supabase.from("site_pages").update({
        title: form.title,
        content: form.content,
        image: form.image,
        updated_at: new Date().toISOString(),
      }).eq("id", editing);
      setShowForm(false);
      setEditing(null);
      await load();
    } catch {
      alert("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const slugLabels: Record<string, string> = {
    about: "אודות",
    contact: "צור קשר",
    shipping: "מדיניות משלוחים",
    returns: "מדיניות החזרות",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ניהול עמודים</h2>
      </div>

      {showForm && (
        <div className="bg-sky/5 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-primary">
            עריכת עמוד: {slugLabels[editingSlug] || editingSlug}
          </h3>

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
            <label className="block text-sm font-semibold text-primary mb-1">תוכן</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-y"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1">תמונה</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            {form.image ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-primary/10">
                <Image src={form.image} alt="תמונת עמוד" fill className="object-cover" />
                <button
                  onClick={() => { setForm({ ...form, image: "" }); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-red-500 text-sm font-bold shadow"
                  aria-label="הסר תמונה"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-32 border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center gap-2 text-primary/40 hover:border-pink hover:text-pink transition-colors"
              >
                {uploading ? (
                  <span className="text-sm">מעלה...</span>
                ) : (
                  <>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm font-semibold">העלה תמונה</span>
                  </>
                )}
              </button>
            )}
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
        {pages.map((p) => (
          <div key={p.id} className="flex items-center gap-4 bg-white border border-primary/10 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-primary">{p.title}</div>
              <div className="text-sm text-primary/40">/{p.slug}</div>
            </div>
            <div className="text-xs text-primary/30">
              עודכן: {new Date(p.updated_at).toLocaleDateString("he-IL")}
            </div>
            <button
              onClick={() => handleEdit(p)}
              className="text-primary/50 hover:text-primary text-sm font-semibold"
            >
              ערוך
            </button>
          </div>
        ))}
        {pages.length === 0 && (
          <p className="text-center text-primary/40 py-8">אין עמודים</p>
        )}
      </div>
    </div>
  );
}
