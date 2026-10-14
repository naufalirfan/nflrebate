import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function Home(){
  return (
    <div className="flex-1 flex flex-col items-center bg-[#f7f7f5] dark:bg-[#1e1e24]">
      <nav className="w-full max-w-5xl flex justify-between items-center h-[56px] px-4 bg-[#f7f7f5] dark:bg-[#1e1e24] border-b border-[#e6e6e6] dark:border-[#34343e] sticky top-0 z-10">
        <b className="text-black dark:text-white text-[20px] font-bold tracking-[-0.14px]" style={{fontFeatureSettings:'"kern" 1'}}>Nfl Rebate</b>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <Link href="/login" className="px-5 py-2 min-h-[44px] inline-flex items-center text-[14px] font-medium tracking-[-0.10px] border border-[#e6e6e6] dark:border-[#34343e] rounded-[50px] bg-white dark:bg-[#2a2a30] text-black dark:text-white">Masuk</Link>
          <Link href="/register" className="px-5 py-2 min-h-[44px] inline-flex items-center text-[14px] font-medium tracking-[-0.10px] bg-black dark:bg-white text-white dark:text-black border border-transparent dark:border-white rounded-[50px]">Daftar</Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-5xl px-4 py-6 md:py-8 flex flex-col gap-6">
        {/* HERO 2-col */}
        <div className="rounded-[24px] bg-white dark:bg-[#2a2a30] border border-[#e6e6e6] dark:border-[#34343e] p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,.04)] overflow-hidden">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.6px] text-black/60 dark:text-white/60 border border-[#e6e6e6] dark:border-[#34343e] rounded-[50px] px-3 py-1 bg-[#f7f7f5] dark:bg-[#1e1e24]">● Live rebate • Exness • XM • Headway</p>
              <h1 className="mt-4 text-[36px] md:text-[48px] font-[700] leading-[0.95] tracking-[-1.2px] text-black dark:text-white" style={{fontFeatureSettings:'"kern" 1'}}>Rebate forex<br/>anda <span className="underline decoration-[#dceeb1] decoration-[8px] underline-offset-[-2px] dark:decoration-[#34343e]">terpantau</span><br/>transparan.</h1>
              <p className="mt-4 text-[16px] md:text-[18px] leading-[1.5] tracking-[-0.2px] text-black/60 dark:text-white/60 max-w-[44ch]">Tautkan akun broker, pantau komisi per lot real-time, tarik kapan saja. T+1, tanpa potongan tersembunyi.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/register" className="px-7 py-3 min-h-[44px] inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-[50px] text-[15px] font-semibold tracking-[-0.1px] hover:opacity-90 transition">Daftar gratis →</Link>
                <Link href="/login" className="px-7 py-3 min-h-[44px] inline-flex items-center justify-center bg-white dark:bg-transparent text-black dark:text-white border border-[#e6e6e6] dark:border-[#34343e] rounded-[50px] text-[15px] font-medium">Masuk</Link>
              </div>
              <p className="mt-3 text-[12px] font-mono tracking-[0.4px] text-black/40 dark:text-white/40">Gratis • Tanpa kartu • Aktif &lt; 2 menit</p>
              <div className="mt-6 flex items-center gap-4 text-[13px] text-black/60 dark:text-white/60">
                <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#dceeb1] grid place-items-center text-[11px]">✓</span> Spread tetap</span>
                <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#c5b0f4] grid place-items-center text-[11px]">✓</span> Rebate harian</span>
                <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#c2e8ff] grid place-items-center text-[11px]">✓</span> CS aktif</span>
              </div>
            </div>
            {/* mock card */}
            <div className="relative">
              <div className="rounded-[24px] p-5 md:p-6 flex flex-col gap-4" style={{background:"#dceeb1"}}>
                <p className="text-[11px] font-mono uppercase tracking-[0.6px] text-black/60">Pratinjau rebate</p>
                <div className="bg-white rounded-[16px] p-4 border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,.06)]">
                  <div className="flex justify-between items-center">
                    <b className="text-[14px] text-black">XAUUSD • 2.40 lot</b><span className="text-[12px] font-mono bg-[#dceeb1] px-2 py-1 rounded-full text-black">+$18.40</span>
                  </div>
                  <div className="mt-3 h-2 bg-[#f7f7f5] rounded-full overflow-hidden"><div className="h-full w-[72%] bg-black rounded-full" /></div>
                  <p className="mt-2 text-[12px] text-black/50 font-mono">Tiket #48291 • 12 Okt 2025 • Exness Standard</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-[12px] p-3 border border-black/5"><p className="text-[11px] font-mono uppercase tracking-[0.5px] text-black/50">Saldo</p><p className="text-[18px] font-bold text-black">$248.90</p></div>
                  <div className="bg-black rounded-[12px] p-3"><p className="text-[11px] font-mono uppercase tracking-[0.5px] text-white/60">Bulan ini</p><p className="text-[18px] font-bold text-white">+ $84.20</p></div>
                </div>
                <p className="text-[11px] font-mono text-black/50 text-center">* Ilustrasi — data real di dashboard</p>
              </div>
              {/* floating badge */}
              <div className="hidden md:flex absolute -bottom-3 -left-3 bg-white dark:bg-[#1e1e24] border border-[#e6e6e6] dark:border-[#34343e] rounded-[50px] px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,.08)] items-center gap-2 text-[12px] font-medium text-black dark:text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Withdraw T+1 diproses
              </div>
            </div>
          </div>
        </div>

        {/* TRUST */}
        <p className="text-[11px] font-mono uppercase tracking-[0.6px] text-black/30 dark:text-white/30 text-center">Dipercaya trader • Spread &amp; eksekusi tetap milik broker</p>

        {/* BROKER */}
        <div className="rounded-[24px] p-6 md:p-8 flex flex-col gap-4" style={{background:"#f4ecd6"}}>
          <p className="text-[11px] font-mono uppercase tracking-[0.6px] text-black/50">Broker mitra</p>
          <h2 className="text-[22px] md:text-[26px] font-[700] leading-[1.2] tracking-[-0.5px] text-black">Tiga broker, satu dashboard.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-black/5 rounded-[16px] p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,.06)] transition"><div className="w-9 h-9 rounded-[10px] bg-[#dceeb1] grid place-items-center text-[15px]">◆</div><b className="mt-3 block text-black text-[16px] font-semibold">Exness</b><p className="text-[13px] leading-[1.4] text-black/60 mt-1">Spread ketat, rebate hingga $/lot — Standard &amp; Pro.</p><p className="mt-2 text-[12px] font-mono text-black/40">Mulai $6.5 / lot</p></div>
            <div className="bg-white border border-black/5 rounded-[16px] p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,.06)] transition"><div className="w-9 h-9 rounded-[10px] bg-[#c5b0f4] grid place-items-center text-[15px]">◇</div><b className="mt-3 block text-black text-[16px] font-semibold">XM</b><p className="text-[13px] leading-[1.4] text-black/60 mt-1">Bonus &amp; rebate kompetitif, eksekusi stabil.</p><p className="mt-2 text-[12px] font-mono text-black/40">Mulai $7 / lot</p></div>
            <div className="bg-white border border-black/5 rounded-[16px] p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,.06)] transition"><div className="w-9 h-9 rounded-[10px] bg-[#c2e8ff] grid place-items-center text-[15px]">⬡</div><b className="mt-3 block text-black text-[16px] font-semibold">Headway</b><p className="text-[13px] leading-[1.4] text-black/60 mt-1">Eksekusi cepat, rebate harian otomatis.</p><p className="mt-2 text-[12px] font-mono text-black/40">Mulai $6 / lot</p></div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="rounded-[24px] bg-white dark:bg-[#2a2a30] border border-[#e6e6e6] dark:border-[#34343e] p-6 md:p-8">
          <p className="text-[11px] font-mono uppercase tracking-[0.6px] text-black/50 dark:text-white/50">Cara kerja</p>
          <h2 className="mt-1 text-[22px] font-bold tracking-[-0.4px] text-black dark:text-white">3 langkah, rebate jalan.</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="flex gap-3"><span className="w-8 h-8 shrink-0 rounded-full bg-black dark:bg-white text-white dark:text-black grid place-items-center text-[13px] font-bold">1</span><div><b className="text-[14px] text-black dark:text-white">Daftar &amp; tautkan akun</b><p className="text-[13px] leading-[1.4] text-black/60 dark:text-white/60 mt-1">Pilih broker &amp; masukkan nomor akun. Verifikasi admin &lt; 1 jam kerja.</p></div></div>
            <div className="flex gap-3"><span className="w-8 h-8 shrink-0 rounded-full bg-black dark:bg-white text-white dark:text-black grid place-items-center text-[13px] font-bold">2</span><div><b className="text-[14px] text-black dark:text-white">Trading seperti biasa</b><p className="text-[13px] leading-[1.4] text-black/60 dark:text-white/60 mt-1">Rebate dihitung per lot otomatis dari <code className="bg-[#f7f7f5] dark:bg-[#1e1e24] px-1 rounded">rebate_rules</code>.</p></div></div>
            <div className="flex gap-3"><span className="w-8 h-8 shrink-0 rounded-full bg-black dark:bg-white text-white dark:text-black grid place-items-center text-[13px] font-bold">3</span><div><b className="text-[14px] text-black dark:text-white">Tarik kapan saja</b><p className="text-[13px] leading-[1.4] text-black/60 dark:text-white/60 mt-1">Bank / e-wallet / USDT TRC20, kurs 16.500, T+1.</p></div></div>
          </div>
        </div>

        {/* STATS */}
        <div className="rounded-[24px] p-6 md:p-8" style={{background:"#c5b0f4"}}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-black/5 rounded-[16px] p-5 text-center"><p className="text-[24px] font-[800] tracking-[-0.8px] text-black">$1.2M+</p><p className="text-[11px] tracking-[0.5px] font-mono uppercase text-black/50">Rebate dibayarkan</p></div>
            <div className="bg-white border border-black/5 rounded-[16px] p-5 text-center"><p className="text-[24px] font-[800] tracking-[-0.8px] text-black">8.4K</p><p className="text-[11px] tracking-[0.5px] font-mono uppercase text-black/50">Trader aktif</p></div>
            <div className="bg-white border border-black/5 rounded-[16px] p-5 text-center"><p className="text-[24px] font-[800] tracking-[-0.8px] text-black">3</p><p className="text-[11px] tracking-[0.5px] font-mono uppercase text-black/50">Broker mitra</p></div>
            <div className="bg-white border border-black/5 rounded-[16px] p-5 text-center"><p className="text-[24px] font-[800] tracking-[-0.8px] text-black">T+1</p><p className="text-[11px] tracking-[0.5px] font-mono uppercase text-black/50">Pencairan</p></div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[24px] bg-black dark:bg-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div><h3 className="text-[20px] font-bold tracking-[-0.4px] text-white dark:text-black">Siap dapat rebate harian?</h3><p className="text-[13px] text-white/60 dark:text-black/60 mt-1">Daftar sekarang, tautkan akun, rebate pertama masuk besok.</p></div>
          <Link href="/register" className="shrink-0 px-7 py-3 min-h-[44px] inline-flex items-center justify-center bg-white dark:bg-black text-black dark:text-white rounded-[50px] text-[14px] font-semibold">Buat akun gratis</Link>
        </div>

        <p className="text-[11px] font-mono uppercase tracking-[0.6px] text-black/30 dark:text-white/30 text-center">PWA • Mobile first • Supabase • Rebate harian otomatis • © 2025 Nfl Rebate</p>
      </main>
    </div>
  )
}