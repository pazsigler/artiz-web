"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BulkOrderForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        message: `[הזמנה גדולה] ${form.message}`,
      });
      if (error) throw error;
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      alert("שגיאה בשליחה, אנא נסו שוב");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section className="py-16 bg-primary">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white/10 rounded-2xl p-10">
            <h2 className="text-2xl font-bold text-white mb-2">הפנייה נשלחה בהצלחה!</h2>
            <p className="text-white/60 mb-4">נחזור אליכם בהקדם עם הצעה מותאמת.</p>
            <button
              onClick={() => setSent(false)}
              className="text-pink font-semibold hover:text-pink/80 transition-colors text-sm"
            >
              שליחת פנייה נוספת
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">מעוניינים בהזמנה גדולה?</h2>
          <p className="text-white/60 text-lg">צרו קשר לפרטים נוספים</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-1">
                שם <span className="text-pink">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-1">
                טלפון <span className="text-pink">*</span>
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-1">אימייל</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-pink"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-1">במה מעוניינים?</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-pink resize-y"
            />
          </div>
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={sending}
              className="bg-pink text-white px-10 py-3 rounded-full font-semibold hover:bg-pink/90 transition-colors disabled:opacity-50 text-lg"
            >
              {sending ? "שולח..." : "שלחו פנייה"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
