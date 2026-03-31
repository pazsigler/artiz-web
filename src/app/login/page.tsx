"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/profile");
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/profile");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "שגיאה בהתחברות";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">התחברות</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
            placeholder="••••••••"
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "מתחבר..." : "התחברות"}
        </button>
      </form>

      <p className="text-center mt-6 text-primary/60">
        אין לך חשבון?{" "}
        <Link href="/signup" className="text-pink font-semibold hover:underline">
          הרשמה
        </Link>
      </p>
    </div>
  );
}
