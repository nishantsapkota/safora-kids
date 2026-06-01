import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { LoginForm } from "@/components/auth-forms";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user?.role === "admin") redirect("/admin");
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Continue today’s adaptive safety session.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          New student? <Link className="font-semibold text-safety-blue" href="/register">Create profile</Link>
        </p>
      </Card>
    </div>
  );
}
