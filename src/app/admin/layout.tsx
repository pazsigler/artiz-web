"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

const navItems = [
  { href: "/admin", label: "דשבורד" },
  { href: "/admin/products", label: "מוצרים" },
  { href: "/admin/categories", label: "קטגוריות" },
  { href: "/admin/slides", label: "סליידים" },
  { href: "/admin/orders", label: "הזמנות" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-primary/50 text-lg">טוען...</div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">פאנל ניהול</h1>
        <Link href="/profile" className="text-primary/50 hover:text-primary text-sm">
          חזרה לפרופיל
        </Link>
      </div>

      <nav className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-5 py-2 rounded-full bg-primary/5 text-primary font-semibold hover:bg-primary hover:text-white transition-colors whitespace-nowrap text-sm"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
