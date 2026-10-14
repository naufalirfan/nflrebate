import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function Home(){
  return (
    <div className="flex-1 flex flex-col items-center">
      <nav className="w-full max-w-5xl flex justify-between items-center p-4">
        <b className="text-sky-600 text-xl">Nfl Rebate</b>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <Link href="/login" className="px-4 py-2 min-h-[44px] inline-flex items-center text-sm border rounded-full bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">Masuk</Link>
          <Link href="/register" className="px-4 py-2 min-h-[44px] inline-flex items-center text-sm bg-sky-600 text-white rounded-full">Daftar</Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-5xl px-4 py-12 flex flex-col gap-8">
        <div className="rounded-3xl bg-white dark:bg-zinc-800 dark:border-zinc-700 p-8 shadow-sm border">
          <h1 className="text-3xl font-bold leading-tight text-zinc-900 dark:text-white">Rebate forex anda<br/><span className="text-sky-600">terpantau transparan.</span></h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">Portal rebate Exness/XM/Headway — tautkan akun, pantau komisi per lot, tarik kapan saja.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="px-6 py-3 min-h-[44px] inline-flex items-center bg-sky-600 text-white rounded-2xl font-medium">Daftar</Link>
            <Link href="/login" className="px-6 py-3 min-h-[44px] inline-flex items-center bg-zinc-900 dark:bg-zinc-700 text-white rounded-2xl font-medium">Masuk</Link>
          </div>
        </div>
        <div>
          <h2 className="font-bold mb-3 dark:text-white">Broker Mitra</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border"><b className="dark:text-white">Exness</b><p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Spread ketat, rebate hingga $/lot</p></div>
            <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border"><b className="dark:text-white">XM</b><p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Bonus &amp; rebate kompetitif</p></div>
            <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border"><b className="dark:text-white">Headway</b><p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Eksekusi cepat, rebate harian</p></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border text-center"><p className="text-2xl font-bold text-sky-600">$1.2M+</p><p className="text-xs text-zinc-500 dark:text-zinc-400">Rebate dibayarkan</p></div>
          <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border text-center"><p className="text-2xl font-bold text-sky-600">8.4K</p><p className="text-xs text-zinc-500 dark:text-zinc-400">Trader aktif</p></div>
          <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border text-center"><p className="text-2xl font-bold text-sky-600">3</p><p className="text-xs text-zinc-500 dark:text-zinc-400">Broker mitra</p></div>
          <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border text-center"><p className="text-2xl font-bold text-sky-600">T+1</p><p className="text-xs text-zinc-500 dark:text-zinc-400">Pencairan</p></div>
        </div>
        <p className="text-xs text-zinc-400 text-center">PWA • Mobile First • Supabase • Rebate harian otomatis</p>
      </main>
    </div>
  )
}
