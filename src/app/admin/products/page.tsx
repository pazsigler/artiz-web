"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { uploadProductImage, deleteProductImage } from "@/lib/storage";
import Image from "next/image";

interface ProductRow {
  id: string;
  name: string;
  price: number;
  description: string;
  type: string;
  category_slug: string;
  image: string;
  gallery: string[];
  dimensions: string;
  shipping_info: string;
  full_details: string;
  created_at: string;
}

interface CategoryRow {
  slug: string;
  name: string;
}

const emptyForm = {
  name: "",
  price: 0,
  description: "",
  type: "regular" as string,
  category_slug: "",
  image: "",
  gallery: [] as string[],
  dimensions: "",
  shipping_info: "",
  full_details: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("slug, name").order("created_at"),
    ]);
    if (p) setProducts(p);
    if (c) setCategories(c);
  };

  useEffect(() => { load(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadProductImage(file);
      setForm({ ...form, image: url });
    } catch {
      alert("שגיאה בהעלאת התמונה");
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file);
        urls.push(url);
      }
      setForm({ ...form, gallery: [...form.gallery, ...urls] });
    } catch {
      alert("שגיאה בהעלאת תמונות לגלריה");
    } finally {
      setUploadingGallery(false);
      if (galleryRef.current) galleryRef.current.value = "";
    }
  };

  const removeGalleryImage = async (index: number) => {
    const url = form.gallery[index];
    await deleteProductImage(url);
    setForm({ ...form, gallery: form.gallery.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_slug) {
      alert("נא למלא שם, מחיר וקטגוריה");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await supabase.from("products").update(form).eq("id", editing);
      } else {
        await supabase.from("products").insert(form);
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

  const handleEdit = (p: ProductRow) => {
    setForm({
      name: p.name,
      price: p.price,
      description: p.description || "",
      type: p.type,
      category_slug: p.category_slug,
      image: p.image || "",
      gallery: p.gallery || [],
      dimensions: p.dimensions || "",
      shipping_info: p.shipping_info || "",
      full_details: p.full_details || "",
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleDelete = async (p: ProductRow) => {
    if (!confirm(`למחוק את "${p.name}"?`)) return;
    if (p.image) await deleteProductImage(p.image);
    if (p.gallery) {
      for (const url of p.gallery) {
        await deleteProductImage(url);
      }
    }
    await supabase.from("products").delete().eq("id", p.id);
    await load();
  };

  const handleNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ניהול מוצרים</h2>
        <button
          onClick={handleNew}
          className="bg-pink text-white px-6 py-2 rounded-full font-semibold hover:bg-pink/90 transition-colors text-sm"
        >
          + מוצר חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-sky/5 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-primary">{editing ? "עריכת מוצר" : "מוצר חדש"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">שם המוצר</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">מחיר (₪)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">קטגוריה</label>
              <select
                value={form.category_slug}
                onChange={(e) => setForm({ ...form, category_slug: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              >
                <option value="">בחר קטגוריה</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">סוג</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              >
                <option value="regular">רגיל</option>
                <option value="custom">בהתאמה אישית</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1">תיאור</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-none h-20"
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1">תמונה ראשית</label>
            <div className="flex items-center gap-4">
              {form.image && (
                <Image src={form.image} alt="preview" width={80} height={80} className="rounded-xl object-cover" />
              )}
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm"
              />
            </div>
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1">
              גלריית תמונות (אופציונלי)
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.gallery.map((url, i) => (
                <div key={i} className="relative group">
                  <Image src={url} alt={`gallery ${i + 1}`} width={80} height={80} className="rounded-xl object-cover w-20 h-20" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute -top-2 -left-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 border border-dashed border-primary/30 rounded-xl px-4 py-2 cursor-pointer hover:border-pink transition-colors text-sm text-primary/60">
              {uploadingGallery ? "מעלה..." : "+ הוסף תמונות לגלריה"}
              <input
                type="file"
                ref={galleryRef}
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
                disabled={uploadingGallery}
              />
            </label>
          </div>

          {/* Accordion fields */}
          <div className="border-t border-primary/10 pt-4 mt-4">
            <p className="text-sm font-bold text-primary mb-3">שדות אקורדיון (אופציונלי)</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">מידות</label>
                <textarea
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-none h-16 text-sm"
                  placeholder="לדוגמה: 30x20 ס״מ, משקל 500 גרם"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">משלוחים והחזרות</label>
                <textarea
                  value={form.shipping_info}
                  onChange={(e) => setForm({ ...form, shipping_info: e.target.value })}
                  className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-none h-16 text-sm"
                  placeholder="לדוגמה: משלוח תוך 3-5 ימי עסקים, החזרה עד 14 יום"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">פירוט מלא</label>
                <textarea
                  value={form.full_details}
                  onChange={(e) => setForm({ ...form, full_details: e.target.value })}
                  className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-none h-24 text-sm"
                  placeholder="תיאור מפורט של המוצר, חומרים, הוראות טיפול..."
                />
              </div>
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
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 bg-white border border-primary/10 rounded-xl p-4">
            <div className="w-14 h-14 rounded-xl bg-sky/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {p.image ? (
                <Image src={p.image} alt={p.name} width={56} height={56} className="object-cover w-full h-full" />
              ) : (
                <span className="text-2xl">📦</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-primary truncate">{p.name}</div>
              <div className="text-sm text-primary/50">
                ₪{p.price} · {p.type === "custom" ? "בהתאמה אישית" : "רגיל"}
                {p.gallery?.length > 0 && ` · ${p.gallery.length} תמונות`}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleEdit(p)}
                className="text-primary/50 hover:text-primary text-sm font-semibold"
              >
                ערוך
              </button>
              <button
                onClick={() => handleDelete(p)}
                className="text-red-400 hover:text-red-600 text-sm font-semibold"
              >
                מחק
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-center text-primary/40 py-8">אין מוצרים עדיין</p>
        )}
      </div>
    </div>
  );
}
