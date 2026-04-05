"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadBlogImage } from "@/lib/storage";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  published: boolean;
  created_at: string;
}

const emptyPost = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  image: "",
  published: false,
};

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0590-\u05FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPost);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadBlogImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      alert("שגיאה בהעלאת תמונה");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title) { alert("נא למלא כותרת"); return; }
    const slug = form.slug || slugify(form.title);
    setSaving(true);
    try {
      if (editing) {
        await supabase.from("blog_posts").update({ ...form, slug }).eq("id", editing);
      } else {
        await supabase.from("blog_posts").insert({ ...form, slug });
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyPost);
      await load();
    } catch {
      alert("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: PostRow) => {
    setForm({
      title: p.title,
      slug: p.slug,
      content: p.content || "",
      excerpt: p.excerpt || "",
      image: p.image || "",
      published: p.published,
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleDelete = async (p: PostRow) => {
    if (!confirm(`למחוק את "${p.title}"?`)) return;
    await supabase.from("blog_posts").delete().eq("id", p.id);
    await load();
  };

  const handleTogglePublish = async (p: PostRow) => {
    await supabase.from("blog_posts").update({ published: !p.published }).eq("id", p.id);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ניהול בלוג</h2>
        <button
          onClick={() => { setForm(emptyPost); setEditing(null); setShowForm(true); }}
          className="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors text-sm"
        >
          + מאמר חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-sky/5 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-primary">{editing ? "עריכת מאמר" : "מאמר חדש"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">כותרת</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Slug (אוטומטי אם ריק)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-accent"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1">תקציר</label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1">תוכן</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-accent resize-y"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1">תמונה ראשית</label>
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
                <Image src={form.image} alt="תמונת מאמר" fill className="object-cover" />
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
                className="w-full h-32 border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center gap-2 text-primary/40 hover:border-accent hover:text-accent transition-colors"
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="published" className="text-sm font-semibold text-primary">פורסם</label>
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
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 bg-white border border-primary/10 rounded-xl p-4">
            <div className="w-20 h-14 rounded-lg overflow-hidden bg-sky/20 flex-shrink-0 relative">
              {p.image ? (
                <Image src={p.image} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20 text-xs">ללא תמונה</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-primary truncate">{p.title}</div>
              <div className="text-sm text-primary/50 truncate">{p.excerpt}</div>
              <div className="text-xs text-primary/30 mt-0.5">
                {new Date(p.created_at).toLocaleDateString("he-IL")}
              </div>
            </div>
            <button
              onClick={() => handleTogglePublish(p)}
              className={`text-xs px-3 py-1 rounded-full font-semibold cursor-pointer transition-colors ${
                p.published ? "bg-success/30 text-green-700 hover:bg-success/50" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              {p.published ? "פורסם" : "טיוטה"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="text-primary/50 hover:text-primary text-sm font-semibold">
                ערוך
              </button>
              <button onClick={() => handleDelete(p)} className="text-red-400 hover:text-red-600 text-sm font-semibold">
                מחק
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-primary/40 py-8">אין מאמרים עדיין</p>
        )}
      </div>
    </div>
  );
}
