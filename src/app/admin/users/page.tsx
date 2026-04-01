"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/lib/types";

interface UserRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  email?: string;
}

const roleLabels: Record<UserRole, string> = {
  admin: "מנהל",
  editor: "עורך",
  customer: "לקוח",
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-pink/20 text-pink",
  editor: "bg-purple-soft/20 text-purple-700",
  customer: "bg-sky/20 text-primary",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filter, setFilter] = useState<UserRole | "all">("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", fullName: "", role: "customer" as UserRole });

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (profiles) {
      // Try to get emails from auth users list (admin only)
      const enriched = profiles.map((p) => ({
        ...p,
        email: "",
      }));
      setUsers(enriched);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filteredUsers = filter === "all" ? users : users.filter((u) => u.role === filter);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert("נא למלא אימייל וסיסמה");
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: { data: { full_name: newUser.fullName } },
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: newUser.fullName || null,
          role: newUser.role,
        });
      }
      setShowForm(false);
      setNewUser({ email: "", password: "", fullName: "", role: "customer" });
      await load();
    } catch (err) {
      alert("שגיאה ביצירת משתמש: " + (err instanceof Error ? err.message : "שגיאה לא ידועה"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ניהול משתמשים</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink text-white px-6 py-2 rounded-full font-semibold hover:bg-pink/90 transition-colors text-sm"
        >
          + משתמש חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-sky/5 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold text-primary">משתמש חדש</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">אימייל</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">סיסמה</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">שם מלא</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">תפקיד</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                className="w-full border border-primary/20 rounded-xl p-3 focus:outline-none focus:border-pink bg-white"
              >
                <option value="customer">לקוח</option>
                <option value="editor">עורך</option>
                <option value="admin">מנהל</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateUser}
              disabled={saving}
              className="bg-primary text-white px-8 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? "יוצר..." : "צור משתמש"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-primary/20 text-primary px-8 py-2 rounded-full font-semibold hover:bg-primary/5 transition-colors"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Role filters */}
      <div className="flex gap-2 mb-6 flex-wrap" role="toolbar" aria-label="סינון לפי תפקיד">
        {(["all", "admin", "editor", "customer"] as const).map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            aria-pressed={filter === role}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === role
                ? "bg-primary text-white"
                : "bg-primary/5 text-primary/60 hover:bg-primary/10"
            }`}
          >
            {role === "all" ? "הכל" : roleLabels[role]}
            <span className="mr-1 text-xs opacity-60">
              ({role === "all" ? users.length : users.filter((u) => u.role === role).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-primary/40 py-8">טוען...</p>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-4 bg-white border border-primary/10 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                {(u.full_name || "?")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-primary truncate">{u.full_name || "ללא שם"}</div>
                <div className="text-sm text-primary/50">{u.phone || "ללא טלפון"}</div>
                <div className="text-xs text-primary/30 mt-0.5">
                  {new Date(u.created_at).toLocaleDateString("he-IL")}
                </div>
              </div>
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold border-0 cursor-pointer ${roleColors[u.role]}`}
                aria-label={`תפקיד ${u.full_name || "משתמש"}`}
              >
                <option value="customer">לקוח</option>
                <option value="editor">עורך</option>
                <option value="admin">מנהל</option>
              </select>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p className="text-center text-primary/40 py-8">אין משתמשים להצגה</p>
          )}
        </div>
      )}
    </div>
  );
}
