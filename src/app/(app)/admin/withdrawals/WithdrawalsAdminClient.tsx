"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  user_id: string;
  amount_usd: number;
  amount_idr: number;
  exchange_rate: number;
  channel: string;
  destination_details: unknown;
  status: string;
  created_at: string;
  profiles?: { email: string; name: string | null } | null;
};

export default function WithdrawalsAdminClient({ user, pending: initialPending, recent }: { user: { id: string }; pending: Row[]; recent: Row[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [pending, setPending] = useState<Row[]>(initialPending);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function approve(id: string) {
    setBusy(id); setMsg("");
    // RLS: admin sees all; client-side read-then-write (single admin operator at a time).
    const { data: req } = await supabase.from("withdrawal_requests").select("*").eq("id", id).single();
    if (!req || req.status !== "pending") { setMsg("Permintaan tidak dalam status pending"); setBusy(null); return; }
    const usd = Number(req.amount_usd);
    const { data: bal } = await supabase.from("user_balances").select("*").eq("user_id", req.user_id).single();
    const avail = Number(bal?.available_balance ?? 0);
    if (avail < usd) { setMsg(`Saldo pemilik tidak cukup ($${avail.toFixed(2)} < $${usd.toFixed(2)})`); setBusy(null); return; }

    const newAvail = avail - usd;
    const newWithdrawn = Number(bal?.total_withdrawn ?? 0) + usd;

    // deduct balance
    const { error: eBal } = await supabase.from("user_balances").update({
      available_balance: newAvail,
      total_withdrawn: newWithdrawn,
      updated_at: new Date().toISOString(),
    }).eq("user_id", req.user_id);
    if (eBal) {
      if (bal) {
        const { error: eIns } = await supabase.from("user_balances").update({
          available_balance: newAvail,
          total_withdrawn: newWithdrawn,
        }).eq("user_id", req.user_id);
        if (eIns) { setMsg(eBal.message); setBusy(null); return; }
      } else { setMsg(eBal.message); setBusy(null); return; }
    }

    const { error: eReq } = await supabase.from("withdrawal_requests").update({
      status: "approved",
      processed_by: user.id,
      completed_at: new Date().toISOString(),
    }).eq("id", id);
    if (eReq) { setMsg(eReq.message); setBusy(null); return; }

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "withdrawal_approve",
      entity: "withdrawal_requests",
      entity_id: id,
      meta: { amount_usd: usd, target_user_id: req.user_id },
    });

    setPending(s => s.filter(x => x.id !== id));
    setMsg(`Disetujui $${usd.toFixed(2)}`);
    setBusy(null);
    router.refresh();
  }

  async function reject(id: string) {
    setBusy(id); setMsg("");
    const { error } = await supabase.from("withdrawal_requests").update({ status: "rejected", processed_by: user.id }).eq("id", id);
    if (error) { setMsg(error.message); setBusy(null); return; }
    await supabase.from("audit_logs").insert({
      actor_id: user.id, action: "withdrawal_reject", entity: "withdrawal_requests", entity_id: id, meta: {},
    });
    setPending(s => s.filter(x => x.id !== id));
    setMsg("Ditolak");
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-[22px] leading-[1.2] tracking-[-0.2px]" style={{ color: "#1d1d1f", fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif" }}>Withdrawals • Admin</h1>
        <p className="text-[14px] tracking-[-0.224px]" style={{ color: "#7a7a7a" }}>{pending.length} pending · aksi via Supabase RLS (admin)</p>
      </div>
      {msg && <p className="rounded-[11px] px-3 py-2 text-[14px] tracking-[-0.224px]" style={{ color: "#1d1d1f", background: "#f5f5f7", border: "1px solid #e0e0e0" }}>{msg}</p>}

      <div className="rounded-[18px] overflow-hidden" style={{ background: "#fafafc", border: "1px solid #e0e0e0" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e0e0e0" }}>
          <span className="font-semibold text-[14px] tracking-[-0.224px]" style={{ color: "#1d1d1f" }}>Pending</span>
        </div>
        <div className="overflow-auto max-w-full">
          <table className="w-full text-[14px]">
            <thead className="text-[12px] tracking-[-0.12px]" style={{ color: "#7a7a7a", background: "#fff" }}>
              <tr><th className="text-left px-3 py-2">Tanggal</th><th className="text-left px-3 py-2">User</th><th className="text-right px-3 py-2">USD</th><th className="text-right px-3 py-2">IDR</th><th className="text-left px-3 py-2">Channel</th><th className="text-left px-3 py-2">Tujuan</th><th className="text-left px-3 py-2">Aksi</th></tr>
            </thead>
            <tbody>
              {pending.length === 0 ? <tr><td colSpan={7} className="text-center py-8" style={{ color: "#7a7a7a" }}>Tidak ada pending</td></tr>
                : pending.map(r => (
                  <tr key={r.id} style={{ borderTop: "1px solid #e0e0e0" }}>
                    <td className="px-3 py-2 whitespace-nowrap text-[12px]">{new Date(r.created_at).toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2 text-[12px] whitespace-nowrap" style={{ color: "#1d1d1f" }}>{(r.profiles as unknown as { email: string } | null)?.email ?? r.user_id.slice(0, 8)}</td>
                    <td className="px-3 py-2 text-right">${Number(r.amount_usd).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">Rp{Number(r.amount_idr).toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2">{r.channel}</td>
                    <td className="px-3 py-2 max-w-[220px] truncate text-[12px]" style={{ color: "#7a7a7a" }}>{JSON.stringify(r.destination_details)}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button disabled={!!busy} onClick={() => approve(r.id)} className="px-3 min-h-[44px] text-[14px] disabled:opacity-50 text-white" style={{ background: "#0066cc", borderRadius: 9999 }}>{busy === r.id ? "…" : "Approve"}</button>
                        <button disabled={!!busy} onClick={() => reject(r.id)} className="px-3 min-h-[44px] text-[14px] disabled:opacity-50" style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 9999, color: "#1d1d1f" }}>{busy === r.id ? "…" : "Reject"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[18px] overflow-hidden" style={{ background: "#fafafc", border: "1px solid #e0e0e0" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e0e0e0" }}>
          <span className="font-semibold text-[14px] tracking-[-0.224px]" style={{ color: "#1d1d1f" }}>Riwayat terbaru (50)</span>
        </div>
        <div className="overflow-auto max-w-full">
          <table className="w-full text-[14px]">
            <thead className="text-[12px] tracking-[-0.12px]" style={{ color: "#7a7a7a", background: "#fff" }}>
              <tr><th className="text-left px-3 py-2">Tanggal</th><th className="text-right px-3 py-2">USD</th><th className="text-left px-3 py-2">Status</th></tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id} style={{ borderTop: "1px solid #e0e0e0" }}><td className="px-3 py-2 whitespace-nowrap text-[12px]">{new Date(r.created_at).toLocaleString("id-ID")}</td><td className="px-3 py-2 text-right">${Number(r.amount_usd).toFixed(2)}</td><td className="px-3 py-2"><span className="text-[12px] px-2 py-1 rounded-full" style={{ background: r.status === "pending" ? "#fff7e6" : r.status === "approved" || r.status === "completed" ? "#e6f4ea" : "#fde8e8", color: r.status === "pending" ? "#9a6700" : r.status === "approved" ? "#1a7f37" : "#cf222e" }}>{r.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
