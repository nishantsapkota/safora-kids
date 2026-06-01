import Link from "next/link";
import { BarChart3, BookOpen, BrainCircuit, CalendarDays, LayoutDashboard, Users } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/questions", label: "Questions", icon: BookOpen },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/ai-analytics", label: "AI Performance", icon: BrainCircuit }
];

export function AdminShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
          <div className="mb-3 flex items-center gap-2 px-3 py-2 font-bold">
            <BarChart3 className="h-5 w-5 text-safety-blue" />
            Admin Panel
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 rounded-md bg-blue-50 px-3 py-3 text-sm text-blue-800">
            <div className="flex items-center gap-2 font-semibold">
              <CalendarDays className="h-4 w-4" />
              Active days
            </div>
            <p className="mt-1">Configured from the overview page.</p>
          </div>
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
