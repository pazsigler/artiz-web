"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const { signUp, user } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) router.push("/profile");
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "שגיאה בהרשמה";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-green-soft/20 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-primary mb-4">נרשמת בהצלחה!</h1>
          <p className="text-primary/70 mb-6">
            שלחנו לך מייל אימות. לחץ על הלינק במייל כדי להפעיל את החשבון.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            לדף ההתחברות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">הרשמה</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-primary mb-2">שם מלא</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
            placeholder="הכנס שם מלא"
          />
        </div>

        <div>
          <label className="block font-semibold text-primary mb-2">אימייל</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
            placeholder="email@example.com"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block font-semibold text-primary mb-2">סיסמה</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
            placeholder="לפחות 6 תווים"
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "נרשם..." : "הרשמה"}
        </button>
      </form>

      <p className="text-center mt-6 text-primary/60">
        כבר יש לך חשבון?{" "}
        <Link href="/login" className="text-pink font-semibold hover:underline">
          התחברות
        </Link>
      </p>
    </div>
  );
}
