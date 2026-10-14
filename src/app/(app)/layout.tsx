import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 pb-12">
      <header className="flex justify-between items-center py-4">
        <Link href="/dashboard" className="text-sky-600 text-xl font-bold">Nfl Rebate</Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/dashboard" className="text-sm min-h-[44px] inline-flex items-center border rounded-full px-3 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">Dashboard</Link>
          <Link href="/accounts" className="text-sm min-h-[44px] inline-flex items-center border rounded-full px-3 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">Akun</Link>
          <Link href="/admin/import" className="text-sm min-h-[44px] inline-flex items-center border rounded-full px-3 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">Import</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
