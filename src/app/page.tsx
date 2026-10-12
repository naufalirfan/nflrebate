import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function Home(){
  return (
    <div className="flex-1 flex flex-col items-center">
      <nav className="w-full max-w-5xl flex justify-between items-center p-4">
        <b className="text-emerald-600 text-xl">SplitBudget</b>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <Link href="/login" className="px-4 py-2 text-sm border rounded-full bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">Masuk</Link>
          <Link href="/register" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-full">Daftar</Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-5xl px-4 py-12 flex flex-col gap-8">
        <div className="rounded-3xl bg-white dark:bg-zinc-800 dark:border-zinc-700 p-8 shadow-sm border">
          <h1 className="text-3xl font-bold leading-tight text-zinc-900 dark:text-white">Patungan liburan<br/><span className="text-emerald-600">tanpa drama tagihan.</span></h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">Catat siapa nalangin apa, bagi rata atau custom, settle up dengan QRIS — pencatatan murni tanpa payment gateway.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-medium">Mulai Gratis</Link>
            <Link href="/login" className="px-6 py-3 bg-zinc-900 dark:bg-zinc-700 text-white rounded-2xl font-medium">Masuk</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border"><b className="dark:text-white">Dompet Grup</b><p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Saldo hijau/merah + timeline aktivitas</p></div>
          <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border"><b className="dark:text-white">Quick Input &lt;10s</b><p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Nominal, kategori, payer, split rata/custom</p></div>
          <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-2xl p-5 border"><b className="dark:text-white">Settle Up</b><p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Copy rek, QRIS personal, upload bukti & konfirmasi</p></div>
        </div>
        <p className="text-xs text-zinc-400 text-center">PWA • Mobile First • Supabase Realtime • Invite via link & kode</p>
      </main>
    </div>
  )
}
