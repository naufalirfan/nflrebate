"use client";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Bal = { available_balance: number; total_withdrawn: number; currency?: string } | null;
type Req = { id: string; amount_usd: number; amount_idr: number; exchange_rate: number; channel: string; status: string; created_at: string };
const CHANNELS = [
  { v: "bank", label: "Bank Transfer (IDR)" },
  { v: "ewallet", label: "E-Wallet (Dana/OVO/GoPay)" },
  { v: "USDT", label: "USDT (TRC20)" },
];
const RATE = 16500;

export default function WithdrawClient({ user, initialBalance, initialRequests }: { user: { id: string; email?: string }; initialBalance: Bal; initialRequests: Req[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [channel, setChannel] = useState("bank");
  const [dest, setDest] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [reqs, setReqs] = useState<Req[]>(initialRequests);
  const numAmount = Number(amount);
  const idrPreview = useMemo(() => (isFinite(numAmount) && numAmount > 0 ? Math.round(numAmount * RATE).toLocaleString("id-ID") : "—"), [numAmount]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const usd = Number(amount);
    if (!isFinite(usd) || usd <= 0) { setMsg("Jumlah harus lebih dari 0"); return; }
    if (usd < 5) { setMsg("Minimum penarikan $5"); return; }
    let parsedDest: unknown;
    try { parsedDest = JSON.parse(dest); if (typeof parsedDest !== "object" || !parsedDest) throw new Error(); } catch { setMsg('Destination details harus JSON valid, contoh: {"bank_name":"BCA","account_number":"1234567890","account_name":"Budi"}'); return; }
    setSaving(true);
    const { data: bal } = await supabase.from("user_balances").select("available_balance").eq("user_id", user.id).single();
    const avail = Number(bal?.available_balance ?? initialBalance?.available_balance ?? 0);
    if (avail < usd) { setMsg(`Saldo tidak cukup. Tersedia $${avail.toFixed(2)}`); setSaving(false); return; }
    const { data, error } = await supabase.from("withdrawal_requests").insert({ user_id: user.id, amount_usd: usd, exchange_rate: RATE, amount_idr: Math.round(usd * RATE), channel, destination_details: parsedDest, status: "pending" }).select().single();
    setSaving(false);
    if (error) { setMsg(error.message); return; }
    setReqs([data as Req, ...reqs]); setAmount(""); setDest(""); setMsg("Permintaan penarikan terkirim (pending persetujuan)."); router.refresh();
  }
  const bal = initialBalance;
  return (
    <div className="flex flex-col gap-6 pt-6">
      {/* Saldo card — lime pastel biar kotak berwarna */}
      <div className="rounded-[24px] p-5 border border-[#e6e6e6] dark:border-transparent flex flex-col gap-1" style={{background:"#dceeb1"}}>
        <p className="text-xs tracking-[0.54px] font-mono uppercase text-black/60">Saldo Tersedia</p>
        <p className="text-[28px] font-semibold tracking-[-0.14px] text-black">${Number(bal?.available_balance ?? 0).toFixed(2)}</p>
        <p className="text-xs tracking-[-0.14px] text-black/60">Kurs referensi Rp{RATE.toLocaleString("id-ID")}/USD · Total ditarik ${Number(bal?.total_withdrawn ?? 0).toFixed(2)}</p>
      </div>

      <form onSubmit={submit} className="bg-white dark:bg-[#2a2a30] rounded-[24px] p-6 border border-[#e6e6e6] dark:border-[#34343e] flex flex-col gap-4">
        <h2 className="font-semibold text-[16px] tracking-[-0.14px] text-black dark:text-white">Ajukan Penarikan</h2>
        <label className="flex flex-col gap-1">
          <span className="text-xs tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Jumlah (USD) — min $5</span>
          <input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" placeholder="50.00" className="w-full border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 rounded-full px-4 min-h-[44px] text-[16px]" />
        </label>
        <p className="text-sm tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Preview IDR: <span className="font-semibold text-black dark:text-white">Rp{idrPreview}</span></p>
        <label className="flex flex-col gap-1">
          <span className="text-xs tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Channel</span>
          <select value={channel} onChange={e => setChannel(e.target.value)} className="border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white rounded-full px-4 min-h-[44px] text-[16px]">
            {CHANNELS.map(c => <option key={c.v} value={c.v}>{c.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Destination details (JSON)</span>
          <textarea value={dest} onChange={e => setDest(e.target.value)} placeholder='{"bank_name":"BCA","account_number":"1234567890","account_name":"Budi"}' rows={4} className="w-full border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 rounded-[18px] px-4 py-3 text-[16px] min-h-[88px] resize-y" />
        </label>
        {msg && <p className={`text-sm rounded-xl px-3 py-2 border ${msg.includes("terkirim") ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"}`}>{msg}</p>}
        <button disabled={saving} className="w-full bg-black dark:bg-white text-white dark:text-black rounded-full py-3 min-h-[44px] font-medium text-[16px] tracking-[-0.10px] disabled:opacity-60 border border-transparent dark:border-white">{saving ? "Mengirim…" : "Ajukan Penarikan"}</button>
      </form>

      <div className="bg-white dark:bg-[#2a2a30] rounded-[24px] border border-[#e6e6e6] dark:border-[#34343e] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#f1f1f1] dark:border-[#34343e] flex justify-between items-center"><b className="text-sm text-black dark:text-white">Riwayat Penarikan ({reqs.length})</b></div>
        <div className="overflow-auto max-w-full">
          <table className="w-full text-sm">
            <thead className="text-xs tracking-[0.54px] text-black/60 dark:text-white/60 bg-[#f7f7f5] dark:bg-[#1e1e24]"><tr><th className="text-left px-3 py-2">Tanggal</th><th className="text-right px-3 py-2">USD</th><th className="text-right px-3 py-2">IDR</th><th className="text-left px-3 py-2">Channel</th><th className="text-left px-3 py-2">Status</th></tr></thead>
            <tbody className="text-black dark:text-white">
              {reqs.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-black/60 dark:text-white/60">Belum ada penarikan</td></tr>
                : reqs.map(r => (
                  <tr key={r.id} className="border-t border-[#f1f1f1] dark:border-[#34343e]"><td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleString("id-ID")}</td><td className="px-3 py-2 text-right">${Number(r.amount_usd).toFixed(2)}</td><td className="px-3 py-2 text-right">Rp{Number(r.amount_idr).toLocaleString("id-ID")}</td><td className="px-3 py-2">{r.channel}</td><td className="px-3 py-2"><span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status==="pending"?"bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300":r.status==="approved"||r.status==="completed"?"bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300":"bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>{r.status}</span></td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
