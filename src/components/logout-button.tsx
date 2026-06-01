"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="focus-ring inline-flex items-center gap-2 rounded bg-slate-100 px-3 py-2 font-semibold text-safety-ink hover:bg-slate-200 disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Logging out" : "Logout"}
    </button>
  );
}
