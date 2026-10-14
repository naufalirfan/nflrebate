import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 pb-12">
      <header className="flex justify-between items-center h-[56px] bg-[#f7f7f5] dark:bg-[#1e1e24] border-b border-[#e6e6e6] dark:border-[#34343e] -mx-4 px-4 sticky top-0 z-10">
        <Link href="/dashboard" className="text-black dark:text-white text-[20px] font-bold tracking-[-0.14px]" style={{fontFeatureSettings:'"kern" 1'}}>Nfl Rebate</Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className="text-[14px] min-h-[44px] inline-flex items-center bg-black dark:bg-white dark:text-black text-white rounded-[50px] px-4">Dashboard</Link>
          <Link href="/accounts" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e6e6e6] dark:border-[#34343e] rounded-[50px] px-4 text-black dark:text-white bg-white dark:bg-[#2a2a30]">Akun</Link>
          <Link href="/withdraw" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e6e6e6] dark:border-[#34343e] rounded-[50px] px-4 text-black dark:text-white bg-white dark:bg-[#2a2a30]">Withdraw</Link>
          <Link href="/admin/import" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e6e6e6] dark:border-[#34343e] rounded-[50px] px-4 text-black dark:text-white bg-white dark:bg-[#2a2a30]">Import</Link>
          <Link href="/admin/withdrawals" className="text-[14px] min-h-[44px] inline-flex items-center border border-[#e6e6e6] dark:border-[#34343e] rounded-[50px] px-4 text-black dark:text-white bg-white dark:bg-[#2a2a30]">Admin WD</Link>
          <ThemeToggle />
        </nav>
      </header>
      {children}
    </div>
  );
}
