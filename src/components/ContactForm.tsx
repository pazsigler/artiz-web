"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
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
        message: form.message || null,
      });
      if (error) throw error;
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      alert("שגיאה בשליחת הפנייה, אנא נסו שוב");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-green/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-primary mb-2">הפנייה נשלחה בהצלחה!</h3>
        <p className="text-primary/60">נחזור אליכם בהקדם.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-pink font-semibold hover:text-pink/80 transition-colors text-sm"
        >
          שליחת פנייה נוספת
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-sky/5 rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-primary">שלחו לנו הודעה</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            שם <span className="text-pink">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            טלפון <span className="text-pink">*</span>
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
            dir="ltr"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary mb-1">אימייל</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
          dir="ltr"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary mb-1">הודעה</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink resize-y"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {sending ? "שולח..." : "שליחה"}
      </button>
    </form>
  );
}
