import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 pb-12">
      <header className="flex justify-between items-center h-[44px] bg-white dark:bg-zinc-900 border-b border-[#e0e0e0] dark:border-zinc-800 -mx-4 px-4 sticky top-0 z-10">
        <Link href="/dashboard" className="text-[#1d1d1f] dark:text-white text-xl font-semibold tracking-[-0.374px]">Nfl Rebate</Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e0e0e0] dark:border-zinc-700 rounded-full px-3 text-[#1d1d1f] dark:text-zinc-100">Dashboard</Link>
          <Link href="/accounts" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e0e0e0] dark:border-zinc-700 rounded-full px-3 text-[#1d1d1f] dark:text-zinc-100">Akun</Link>
          <Link href="/withdraw" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e0e0e0] dark:border-zinc-700 rounded-full px-3 text-[#1d1d1f] dark:text-zinc-100">Withdraw</Link>
          <Link href="/admin/import" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e0e0e0] dark:border-zinc-700 rounded-full px-3 text-[#1d1d1f] dark:text-zinc-100">Import</Link>
          <Link href="/admin/withdrawals" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e0e0e0] dark:border-zinc-700 rounded-full px-3 text-[#1d1d1f] dark:text-zinc-100">Admin WD</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
