"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Row = { id:string; user_id:string; amount_usd:number; amount_idr:number; exchange_rate:number; channel:string; destination_details:unknown; status:string; created_at:string; profiles?: { email:string; name:string|null }|null; };
export default function WithdrawalsAdminClient({ user, pending: initialPending, recent }: { user:{id:string}; pending:Row[]; recent:Row[] }){
  const supabase=createClient(); const router=useRouter();
  const [pending,setPending]=useState<Row[]>(initialPending);
  const [busy,setBusy]=useState<string|null>(null); const [msg,setMsg]=useState("");
  async function approve(id:string){
    setBusy(id); setMsg("");
    const { data:req }=await supabase.from("withdrawal_requests").select("*").eq("id",id).single();
    if(!req || req.status!=="pending"){ setMsg("Permintaan tidak dalam status pending"); setBusy(null); return; }
    const usd=Number(req.amount_usd);
    const { data:bal }=await supabase.from("user_balances").select("*").eq("user_id",req.user_id).single();
    const avail=Number(bal?.available_balance ?? 0);
    if(avail < usd){ setMsg(`Saldo pemilik tidak cukup ($${avail.toFixed(2)} < $${usd.toFixed(2)})`); setBusy(null); return; }
    const newAvail=avail-usd; const newWithdrawn=Number(bal?.total_withdrawn ?? 0)+usd;
    const { error:eBal }=await supabase.from("user_balances").update({ available_balance:newAvail, total_withdrawn:newWithdrawn, updated_at:new Date().toISOString() }).eq("user_id",req.user_id);
    if(eBal){ setMsg(eBal.message); setBusy(null); return; }
    const { error:eReq }=await supabase.from("withdrawal_requests").update({ status:"approved", processed_by:user.id, completed_at:new Date().toISOString() }).eq("id",id);
    if(eReq){ setMsg(eReq.message); setBusy(null); return; }
    await supabase.from("audit_logs").insert({ actor_id:user.id, action:"withdrawal_approve", entity:"withdrawal_requests", entity_id:id, meta:{ amount_usd:usd, target_user_id:req.user_id }});
    setPending(s=>s.filter(x=>x.id!==id)); setMsg(`Disetujui $${usd.toFixed(2)}`); setBusy(null); router.refresh();
  }
  async function reject(id:string){
    setBusy(id); setMsg("");
    const { error }=await supabase.from("withdrawal_requests").update({ status:"rejected", processed_by:user.id }).eq("id",id);
    if(error){ setMsg(error.message); setBusy(null); return; }
    await supabase.from("audit_logs").insert({ actor_id:user.id, action:"withdrawal_reject", entity:"withdrawal_requests", entity_id:id, meta:{} });
    setPending(s=>s.filter(x=>x.id!==id)); setMsg("Ditolak"); setBusy(null); router.refresh();
  }
  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="rounded-[24px] p-5 border border-[#e6e6e6] dark:border-transparent" style={{background:"#c2e8ff"}}>
        <p className="text-xs tracking-[0.54px] font-mono uppercase text-black/60">Admin · Withdrawals</p>
        <p className="text-[18px] font-semibold tracking-[-0.14px] text-black">{pending.length} pending · RLS admin only</p>
      </div>
      {msg && <p className={`text-sm rounded-xl px-3 py-2 border ${msg.includes("Disetujui")?"bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800":"bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"}`}>{msg}</p>}
      <div className="bg-white dark:bg-[#2a2a30] rounded-[24px] border border-[#e6e6e6] dark:border-[#34343e] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#f1f1f1] dark:border-[#34343e]"><b className="text-sm text-black dark:text-white">Pending</b></div>
        <div className="overflow-auto max-w-full">
          <table className="w-full text-sm">
            <thead className="text-xs tracking-[0.54px] text-black/60 dark:text-white/60 bg-[#f7f7f5] dark:bg-[#1e1e24]"><tr><th className="text-left px-3 py-2">Tanggal</th><th className="text-left px-3 py-2">User</th><th className="text-right px-3 py-2">USD</th><th className="text-right px-3 py-2">IDR</th><th className="text-left px-3 py-2">Channel</th><th className="text-left px-3 py-2">Tujuan</th><th className="text-left px-3 py-2">Aksi</th></tr></thead>
            <tbody className="text-black dark:text-white">
              {pending.length===0 ? <tr><td colSpan={7} className="text-center py-8 text-black/60 dark:text-white/60">Tidak ada pending</td></tr>
                : pending.map(r=>(
                  <tr key={r.id} className="border-t border-[#f1f1f1] dark:border-[#34343e]"><td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleString("id-ID")}</td><td className="px-3 py-2 text-xs whitespace-nowrap">{(r.profiles as unknown as {email:string}|null)?.email ?? r.user_id.slice(0,8)}</td><td className="px-3 py-2 text-right">${Number(r.amount_usd).toFixed(2)}</td><td className="px-3 py-2 text-right">Rp{Number(r.amount_idr).toLocaleString("id-ID")}</td><td className="px-3 py-2">{r.channel}</td><td className="px-3 py-2 max-w-[220px] truncate text-xs text-black/60 dark:text-white/60">{JSON.stringify(r.destination_details)}</td><td className="px-3 py-2"><div className="flex gap-2"><button disabled={!!busy} onClick={()=>approve(r.id)} className="px-4 min-h-[44px] text-sm disabled:opacity-50 bg-black dark:bg-white text-white dark:text-black rounded-full border border-transparent dark:border-white">{busy===r.id?"…":"Approve"}</button><button disabled={!!busy} onClick={()=>reject(r.id)} className="px-4 min-h-[44px] text-sm disabled:opacity-50 bg-white dark:bg-transparent text-black dark:text-white border border-[#e6e6e6] dark:border-[#34343e] rounded-full">{busy===r.id?"…":"Reject"}</button></div></td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white dark:bg-[#2a2a30] rounded-[24px] border border-[#e6e6e6] dark:border-[#34343e] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#f1f1f1] dark:border-[#34343e]"><b className="text-sm text-black dark:text-white">Riwayat terbaru (50)</b></div>
        <div className="overflow-auto max-w-full">
          <table className="w-full text-sm">
            <thead className="text-xs tracking-[0.54px] text-black/60 dark:text-white/60 bg-[#f7f7f5] dark:bg-[#1e1e24]"><tr><th className="text-left px-3 py-2">Tanggal</th><th className="text-right px-3 py-2">USD</th><th className="text-left px-3 py-2">Status</th></tr></thead>
            <tbody className="text-black dark:text-white">
              {recent.map(r=>(
                <tr key={r.id} className="border-t border-[#f1f1f1] dark:border-[#34343e]"><td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleString("id-ID")}</td><td className="px-3 py-2 text-right">${Number(r.amount_usd).toFixed(2)}</td><td className="px-3 py-2"><span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status==="pending"?"bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300":r.status==="approved"||r.status==="completed"?"bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300":"bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>{r.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
