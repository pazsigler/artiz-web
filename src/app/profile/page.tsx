"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile, loading, isAdmin, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  if (loading || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("שגיאה בשמירת הפרופיל");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">הפרופיל שלי</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block font-semibold text-primary mb-2">אימייל</label>
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="w-full border border-primary/10 rounded-xl p-3 bg-gray-50 text-primary/50"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block font-semibold text-primary mb-2">שם מלא</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block font-semibold text-primary mb-2">טלפון</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-accent"
            placeholder="050-0000000"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-white py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "שומר..." : saved ? "נשמר בהצלחה!" : "שמור שינויים"}
        </button>
      </form>

      {isAdmin && (
        <Link
          href="/admin"
          className="block text-center mt-6 bg-accent text-white py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors"
        >
          פאנל ניהול
        </Link>
      )}

      <button
        onClick={handleSignOut}
        className="w-full mt-4 border-2 border-primary/20 text-primary py-3 rounded-full font-semibold hover:bg-primary/5 transition-colors"
      >
        התנתקות
      </button>
    </div>
  );
}
