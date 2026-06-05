import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { LogoutButton } from '@/components/logout-button';
import './globals.css';

export const metadata: Metadata = {
  title: 'Safora Kids',
  description: 'AI-powered adaptive safety learning for children'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-safety-ink"
            >
              <ShieldCheck className="h-7 w-7 text-safety-green" />
              <span>Safora Kids</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              {user?.role === 'student' ? (
                <Link
                  className="rounded px-3 py-2 hover:bg-slate-100"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              ) : null}
              {user ? (
                <LogoutButton />
              ) : (
                <Link
                  className="rounded bg-safety-blue px-3 py-2 text-white"
                  href="/login"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500">
          Safora Kids
        </footer>
      </body>
    </html>
  );
}
