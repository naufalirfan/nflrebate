import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function Home(){
  return (
    <div className="flex-1 flex flex-col items-center bg-[#f5f5f7]">
      <nav className="w-full max-w-5xl flex justify-between items-center h-[44px] px-4 bg-white dark:bg-zinc-900 border-b border-[#e0e0e0] dark:border-zinc-800">
        <b className="text-[#1d1d1f] dark:text-white text-xl font-semibold tracking-[-0.374px]">Nfl Rebate</b>
        <div className="flex gap-2 items-center">
          <Link href="/login" className="px-4 py-2 min-h-[44px] inline-flex items-center text-[14px] tracking-[-0.224px] border border-[#e0e0e0] dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-800 dark:text-zinc-100 text-[#1d1d1f]">Masuk</Link>
          <Link href="/register" className="px-4 py-2 min-h-[44px] inline-flex items-center text-[14px] tracking-[-0.224px] bg-[#06c] text-white rounded-full">Daftar</Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-5xl px-4 py-12 flex flex-col gap-8">
        <div className="rounded-[18px] bg-white dark:bg-zinc-800 border border-[#e0e0e0] dark:border-zinc-700 p-8">
          <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-[#1d1d1f] dark:text-white">Rebate forex anda<br/><span className="text-[#06c]">terpantau transparan.</span></h1>
          <p className="mt-3 text-[17px] leading-[1.47] tracking-[-0.374px] text-[#333] dark:text-zinc-300">Portal rebate Exness/XM/Headway — tautkan akun, pantau komisi per lot, tarik kapan saja.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="px-[22px] py-3 min-h-[44px] inline-flex items-center bg-[#06c] text-white rounded-full text-[17px] tracking-[-0.374px]">Daftar</Link>
            <Link href="/login" className="px-[22px] py-3 min-h-[44px] inline-flex items-center bg-[#1d1d1f] text-white rounded-full text-[17px] tracking-[-0.374px]">Masuk</Link>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-[17px] tracking-[-0.374px] mb-3 text-[#1d1d1f] dark:text-white">Broker Mitra</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-800 border border-[#e0e0e0] dark:border-zinc-700 rounded-[18px] p-5"><b className="text-[#1d1d1f] dark:text-white text-[17px] tracking-[-0.374px]">Exness</b><p className="text-sm tracking-[-0.224px] text-[#7a7a7a] dark:text-zinc-400 mt-1">Spread ketat, rebate hingga $/lot</p></div>
            <div className="bg-white dark:bg-zinc-800 border border-[#e0e0e0] dark:border-zinc-700 rounded-[18px] p-5"><b className="text-[#1d1d1f] dark:text-white text-[17px] tracking-[-0.374px]">XM</b><p className="text-sm tracking-[-0.224px] text-[#7a7a7a] dark:text-zinc-400 mt-1">Bonus &amp; rebate kompetitif</p></div>
            <div className="bg-white dark:bg-zinc-800 border border-[#e0e0e0] dark:border-zinc-700 rounded-[18px] p-5"><b className="text-[#1d1d1f] dark:text-white text-[17px] tracking-[-0.374px]">Headway</b><p className="text-sm tracking-[-0.224px] text-[#7a7a7a] dark:text-zinc-400 mt-1">Eksekusi cepat, rebate harian</p></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-800 border border-[#e0e0e0] dark:border-zinc-700 rounded-[18px] p-5 text-center"><p className="text-2xl font-semibold text-[#06c]">$1.2M+</p><p className="text-xs tracking-[-0.12px] text-[#7a7a7a] dark:text-zinc-400">Rebate dibayarkan</p></div>
          <div className="bg-white dark:bg-zinc-800 border border-[#e0e0e0] dark:border-zinc-700 rounded-[18px] p-5 text-center"><p className="text-2xl font-semibold text-[#06c]">8.4K</p><p className="text-xs tracking-[-0.12px] text-[#7a7a7a] dark:text-zinc-400">Trader aktif</p></div>
          <div className="bg-white dark:bg-zinc-800 border border-[#e0e0e0] dark:border-zinc-700 rounded-[18px] p-5 text-center"><p className="text-2xl font-semibold text-[#06c]">3</p><p className="text-xs tracking-[-0.12px] text-[#7a7a7a] dark:text-zinc-400">Broker mitra</p></div>
          <div className="bg-white dark:bg-zinc-800 border border-[#e0e0e0] dark:border-zinc-700 rounded-[18px] p-5 text-center"><p className="text-2xl font-semibold text-[#06c]">T+1</p><p className="text-xs tracking-[-0.12px] text-[#7a7a7a] dark:text-zinc-400">Pencairan</p></div>
        </div>
        <p className="text-xs tracking-[-0.12px] text-[#7a7a7a] text-center">PWA • Mobile First • Supabase • Rebate harian otomatis</p>
      </main>
    </div>
  )
}
