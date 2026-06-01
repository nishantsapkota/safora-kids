import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-soft ${className}`}>{children}</section>;
}

export function ButtonLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`focus-ring inline-flex items-center justify-center rounded-md px-4 py-3 font-semibold ${className}`}>
      {children}
    </Link>
  );
}

export function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon?: LucideIcon }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        {Icon ? <Icon className="h-7 w-7 text-safety-blue" /> : null}
      </div>
    </Card>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-safety-green" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
