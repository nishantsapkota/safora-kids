import Link from "next/link";
import { Card } from "@/components/ui";
import { RegisterForm } from "@/components/auth-forms";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <h1 className="text-2xl font-bold">Create Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Use only a Student ID, password, and age group.</p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Already registered? <Link className="font-semibold text-safety-blue" href="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
}
