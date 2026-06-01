"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AGE_GROUPS } from "@/lib/constants";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setLoading(false);
    if (!response.ok) {
      setError((await response.json()).error ?? "Registration failed");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input className="w-full rounded-md border px-4 py-3" name="studentId" placeholder="Student ID" required />
      <input className="w-full rounded-md border px-4 py-3" name="password" type="password" placeholder="Password" required />
      <input className="w-full rounded-md border px-4 py-3" name="confirmPassword" type="password" placeholder="Confirm password" required />
      <select className="w-full rounded-md border px-4 py-3" name="ageGroup" defaultValue="9-11">
        {AGE_GROUPS.map((age) => (
          <option key={age}>{age}</option>
        ))}
      </select>
      {error ? <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button disabled={loading} className="focus-ring w-full rounded-md bg-safety-green px-4 py-3 font-semibold text-white">
        {loading ? "Creating..." : "Create Profile"}
      </button>
    </form>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setLoading(false);
    if (!response.ok) {
      setError((await response.json()).error ?? "Login failed");
      return;
    }
    const result = await response.json();
    router.push(result.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input className="w-full rounded-md border px-4 py-3" name="studentId" placeholder="Student ID" required />
      <input className="w-full rounded-md border px-4 py-3" name="password" type="password" placeholder="Password" required />
      {error ? <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button disabled={loading} className="focus-ring w-full rounded-md bg-safety-blue px-4 py-3 font-semibold text-white">
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
