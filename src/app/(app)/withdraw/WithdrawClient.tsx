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
  const [dest, setDest] = useState(""); // JSON textarea as requested
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [reqs, setReqs] = useState<Req[]>(initialRequests);

  const numAmount = Number(amount);
  const idrPreview = useMemo(() => (isFinite(numAmount) && numAmount > 0 ? Math.round(numAmount * RATE).toLocaleString("id-ID") : "—"), [numAmount]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const usd = Number(amount);
    if (!isFinite(usd) || usd <= 0) { setMsg("Jumlah harus lebih dari 0"); return; }
    if (usd < 5) { setMsg("Minimum penarikan $5"); return; }
    let parsedDest: unknown;
    try { parsedDest = JSON.parse(dest); if (typeof parsedDest !== "object" || !parsedDest) throw new Error(); } catch { setMsg("Destination details harus JSON valid, contoh: {\"bank_name\":\"BCA\",\"account_number\":\"1234567890\",\"account_name\":\"Budi\"}"); return; }

    setSaving(true);
    // check balance
    const { data: bal } = await supabase.from("user_balances").select("available_balance").eq("user_id", user.id).single();
    const avail = Number(bal?.available_balance ?? initialBalance?.available_balance ?? 0);
    if (avail < usd) { setMsg(`Saldo tidak cukup. Tersedia $${avail.toFixed(2)}`); setSaving(false); return; }

    const { data, error } = await supabase.from("withdrawal_requests").insert({
      user_id: user.id,
      amount_usd: usd,
      exchange_rate: RATE,
      amount_idr: Math.round(usd * RATE),
      channel,
      destination_details: parsedDest,
      status: "pending",
    }).select().single();
    setSaving(false);
    if (error) { setMsg(error.message); return; }
    setReqs([data as Req, ...reqs]);
    setAmount(""); setDest(""); setMsg("Permintaan penarikan terkirim (pending persetujuan).");
    router.refresh();
  }

  const bal = initialBalance;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-semibold text-[22px] leading-[1.2] tracking-[-0.2px]" style={{ color: "#1d1d1f", fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif" }}>Penarikan</h1>
        <p className="text-[14px] leading-[1.43] tracking-[-0.224px]" style={{ color: "#7a7a7a" }}>Saldo tersedia: <strong style={{ color: "#1d1d1f" }}>${Number(bal?.available_balance ?? 0).toFixed(2)}</strong> · Kurs referensi Rp{RATE.toLocaleString("id-ID")}/USD</p>
      </div>

      <form onSubmit={submit} className="rounded-[18px] p-6 flex flex-col gap-4" style={{ background: "#fafafc", border: "1px solid #e0e0e0" }}>
        <label className="flex flex-col gap-1">
          <span className="text-[14px] tracking-[-0.224px]" style={{ color: "#7a7a7a" }}>Jumlah (USD)</span>
          <input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" placeholder="50.00" className="w-full outline-none px-4 min-h-[44px] bg-white text-[16px]" style={{ border: "1px solid #e0e0e0", borderRadius: 9999, fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" }} />
        </label>
        <p className="text-[14px] tracking-[-0.224px] min-h-[20px]" style={{ color: "#7a7a7a" }}>Preview IDR: <span style={{ color: "#1d1d1f", fontWeight: 600 }}>Rp{idrPreview}</span></p>
        <label className="flex flex-col gap-1">
          <span className="text-[14px] tracking-[-0.224px]" style={{ color: "#7a7a7a" }}>Channel</span>
          <select value={channel} onChange={e => setChannel(e.target.value)} className="outline-none px-4 min-h-[44px] bg-white text-[16px]" style={{ border: "1px solid #e0e0e0", borderRadius: 9999, fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" }}>
            {CHANNELS.map(c => <option key={c.v} value={c.v}>{c.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[14px] tracking-[-0.224px]" style={{ color: "#7a7a7a" }}>Destination details (JSON)</span>
          <textarea value={dest} onChange={e => setDest(e.target.value)} placeholder='{"bank_name":"BCA","account_number":"1234567890","account_name":"Budi"}' rows={4} className="w-full outline-none px-4 py-3 bg-white text-[16px] min-h-[88px] resize-y" style={{ border: "1px solid #e0e0e0", borderRadius: 18, fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" }} />
        </label>
        {msg && <p className="text-[14px] tracking-[-0.224px] rounded-[11px] px-3 py-2" style={{ color: msg.includes("terkirim") ? "#1d1d1f" : "#cf222e", background: msg.includes("terkirim") ? "#f5f5f7" : "#fef2f2", border: "1px solid #e0e0e0" }}>{msg}</p>}
        <button disabled={saving} className="w-full font-normal text-[17px] tracking-[-0.374px] min-h-[44px] disabled:opacity-60 text-white" style={{ background: "#0066cc", borderRadius: 9999 }}>{saving ? "Mengirim…" : "Ajukan Penarikan"}</button>
      </form>

      <div className="rounded-[18px] overflow-hidden" style={{ background: "#fafafc", border: "1px solid #e0e0e0" }}>
        <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom: "1px solid #e0e0e0" }}>
          <span className="font-semibold text-[14px] tracking-[-0.224px]" style={{ color: "#1d1d1f" }}>Riwayat Penarikan ({reqs.length})</span>
        </div>
        <div className="overflow-auto max-w-full">
          <table className="w-full text-[14px]">
            <thead className="text-[12px] tracking-[-0.12px]" style={{ color: "#7a7a7a", background: "#fff" }}>
              <tr><th className="text-left px-3 py-2">Tanggal</th><th className="text-right px-3 py-2">USD</th><th className="text-right px-3 py-2">IDR</th><th className="text-left px-3 py-2">Channel</th><th className="text-left px-3 py-2">Status</th></tr>
            </thead>
            <tbody>
              {reqs.length === 0 ? <tr><td colSpan={5} className="text-center py-8" style={{ color: "#7a7a7a" }}>Belum ada penarikan</td></tr>
                : reqs.map(r => (
                  <tr key={r.id} style={{ borderTop: "1px solid #e0e0e0" }}><td className="px-3 py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString("id-ID")}</td><td className="px-3 py-2 text-right">${Number(r.amount_usd).toFixed(2)}</td><td className="px-3 py-2 text-right">Rp{Number(r.amount_idr).toLocaleString("id-ID")}</td><td className="px-3 py-2">{r.channel}</td><td className="px-3 py-2"><span className="text-[12px] px-2 py-1 rounded-full" style={{ background: r.status === "pending" ? "#fff7e6" : r.status === "approved" || r.status === "completed" ? "#e6f4ea" : "#fde8e8", color: r.status === "pending" ? "#9a6700" : r.status === "approved" ? "#1a7f37" : "#cf222e" }}>{r.status}</span></td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
