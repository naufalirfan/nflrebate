import Link from "next/link";
export default function Home(){
  return (
    <div className="flex-1 flex flex-col items-center bg-white">
      <nav className="w-full max-w-5xl flex justify-between items-center h-[56px] px-4 bg-white border-b border-[#e6e6e6] sticky top-0 z-10">
        <b className="text-black text-[20px] font-bold tracking-[-0.14px]" style={{fontFeatureSettings:'"kern" 1'}}>Nfl Rebate</b>
        <div className="flex gap-2 items-center">
          <Link href="/login" className="px-5 py-2 min-h-[44px] inline-flex items-center text-[14px] font-medium tracking-[-0.10px] border border-[#e6e6e6] rounded-[50px] bg-white text-black">Masuk</Link>
          <Link href="/register" className="px-5 py-2 min-h-[44px] inline-flex items-center text-[14px] font-medium tracking-[-0.10px] bg-black text-white rounded-[50px]">Daftar</Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-5xl px-4 py-8 flex flex-col gap-8">
        <div className="rounded-[24px] bg-white border border-[#e6e6e6] p-8 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
          <p className="text-[12px] font-mono uppercase tracking-[0.6px] text-black/60">Rebate forex • Exness • XM • Headway</p>
          <h1 className="mt-2 text-[40px] md:text-[48px] font-[340] leading-[1.05] tracking-[-0.96px] text-black" style={{fontFeatureSettings:'"kern" 1'}}>Rebate forex anda<br/>terpantau transparan.</h1>
          <p className="mt-4 text-[18px] leading-[1.45] tracking-[-0.26px] text-black/70 max-w-[48ch]">Portal rebate — tautkan akun, pantau komisi per lot, tarik kapan saja. Chrome monochrome, cerita di color-block.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="px-6 py-3 min-h-[44px] inline-flex items-center bg-black text-white rounded-[50px] text-[16px] font-medium tracking-[-0.10px]">Daftar</Link>
            <Link href="/login" className="px-6 py-3 min-h-[44px] inline-flex items-center bg-white text-black border border-[#e6e6e6] rounded-[50px] text-[16px] font-medium tracking-[-0.10px]">Masuk</Link>
          </div>
        </div>
        <div className="rounded-[24px] p-8 flex flex-col gap-4" style={{background:"#dceeb1"}}>
          <p className="text-[12px] font-mono uppercase tracking-[0.6px] text-black/60">Broker Mitra</p>
          <h2 className="text-[26px] font-[540] leading-[1.35] tracking-[-0.26px] text-black">Tiga broker, satu dashboard.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-5"><b className="text-black text-[18px] font-semibold">Exness</b><p className="text-[14px] tracking-[-0.14px] text-black/60 mt-1">Spread ketat, rebate hingga $/lot</p></div>
            <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-5"><b className="text-black text-[18px] font-semibold">XM</b><p className="text-[14px] tracking-[-0.14px] text-black/60 mt-1">Bonus &amp; rebate kompetitif</p></div>
            <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-5"><b className="text-black text-[18px] font-semibold">Headway</b><p className="text-[14px] tracking-[-0.14px] text-black/60 mt-1">Eksekusi cepat, rebate harian</p></div>
          </div>
        </div>
        <div className="rounded-[24px] p-8" style={{background:"#c5b0f4"}}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-5 text-center"><p className="text-2xl font-bold text-black">$1.2M+</p><p className="text-xs tracking-[0.54px] font-mono uppercase text-black/60">Rebate dibayarkan</p></div>
            <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-5 text-center"><p className="text-2xl font-bold text-black">8.4K</p><p className="text-xs tracking-[0.54px] font-mono uppercase text-black/60">Trader aktif</p></div>
            <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-5 text-center"><p className="text-2xl font-bold text-black">3</p><p className="text-xs tracking-[0.54px] font-mono uppercase text-black/60">Broker mitra</p></div>
            <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-5 text-center"><p className="text-2xl font-bold text-black">T+1</p><p className="text-xs tracking-[0.54px] font-mono uppercase text-black/60">Pencairan</p></div>
          </div>
        </div>
        <p className="text-xs tracking-[0.6px] font-mono uppercase text-black/40 text-center">PWA • Mobile First • Supabase • Rebate harian otomatis</p>
      </main>
    </div>
  )
}
