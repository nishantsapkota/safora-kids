import { BarChart3 } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";

export function AdminShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
          <div className="mb-3 flex items-center gap-2 px-3 py-2 font-bold">
            <BarChart3 className="h-5 w-5 text-safety-blue" />
            Admin Panel
          </div>
          <AdminNav />
        </div>
      </aside>
      <section className="min-w-0 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-1 text-slate-600">{description}</p>
        </div>
        {children}
      </section>
    </div>
  );
}
