"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Acc={ id:string; broker_name:string; account_number:string; server_name:string|null; account_type:string; status:string; created_at:string; }
const BROKERS=["Exness","XM","Headway"] as const;
const TYPES=["Standard","Cent","Raw","ECN","Pro"] as const;

export default function AccountsClient({ user, initialAccounts }:{ user:any; initialAccounts:Acc[] }){
  const supabase=createClient(); const router=useRouter();
  const [accounts,setAccounts]=useState(initialAccounts);
  const [broker,setBroker]=useState<string>("Exness"); const [accNo,setAccNo]=useState(""); const [server,setServer]=useState(""); const [atype,setAtype]=useState<string>("Standard");
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");
  async function submit(e:React.FormEvent){
    e.preventDefault(); if(!accNo.trim()) return setMsg("Nomor akun wajib diisi");
    setLoading(true); setMsg("");
    const { data, error }=await supabase.from("broker_accounts").insert({ user_id:user.id, broker_name:broker, account_number:accNo.trim(), server_name:server.trim()||null, account_type:atype, status:"pending" }).select().single();
    setLoading(false);
    if(error) setMsg(error.message);
    else { setAccounts([data as Acc, ...accounts]); setAccNo(""); setServer(""); setMsg("Akun ditautkan (pending verifikasi)"); router.refresh(); }
  }
  return (
    <div className="flex flex-col gap-6 pt-6">
      {/* Header card — lilac pastel */}
      <div className="rounded-[24px] p-5 border border-[#e6e6e6] dark:border-transparent flex flex-col gap-1" style={{background:"#c5b0f4"}}>
        <p className="text-xs tracking-[0.54px] font-mono uppercase text-black/60">Akun Broker</p>
        <p className="text-[18px] font-semibold tracking-[-0.14px] text-black">{accounts.length} akun tertaut · Exness • XM • Headway</p>
      </div>

      <form onSubmit={submit} className="bg-white dark:bg-[#2a2a30] rounded-[24px] p-6 border border-[#e6e6e6] dark:border-[#34343e] flex flex-col gap-4">
        <h2 className="font-semibold text-[16px] tracking-[-0.14px] text-black dark:text-white">Tautkan Akun Baru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1"><span className="text-xs tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Broker</span>
            <select value={broker} onChange={e=>setBroker(e.target.value)} className="border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white rounded-full px-4 py-3 text-[16px] min-h-[44px]">{BROKERS.map(b=><option key={b} value={b}>{b}</option>)}</select>
          </label>
          <label className="flex flex-col gap-1"><span className="text-xs tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Tipe Akun</span>
            <select value={atype} onChange={e=>setAtype(e.target.value)} className="border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white rounded-full px-4 py-3 text-[16px] min-h-[44px]">{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
          </label>
        </div>
        <input value={accNo} onChange={e=>setAccNo(e.target.value)} placeholder="Nomor akun (ex: 12345678)" required className="w-full border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 rounded-full px-4 py-3 text-[16px] min-h-[44px]" />
        <input value={server} onChange={e=>setServer(e.target.value)} placeholder="Server (opsional, ex: Exness-Real)" className="w-full border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 rounded-full px-4 py-3 text-[16px] min-h-[44px]" />
        {msg && <p className={`text-sm rounded-xl px-3 py-2 border ${msg.includes("ditautkan")?"bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800":"bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"}`}>{msg}</p>}
        <button disabled={loading} className="bg-black dark:bg-white text-white dark:text-black rounded-full py-3 min-h-[44px] font-medium text-[16px] tracking-[-0.10px] disabled:opacity-50 border border-transparent dark:border-white">{loading?"Menyimpan...":"Tautkan"}</button>
      </form>

      <div className="bg-white dark:bg-[#2a2a30] rounded-[24px] border border-[#e6e6e6] dark:border-[#34343e] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#f1f1f1] dark:border-[#34343e]"><b className="text-sm text-black dark:text-white">Akun Anda ({accounts.length})</b></div>
        {accounts.length===0 ? <p className="p-6 text-center text-sm text-black/60 dark:text-white/60">Belum ada akun tertaut</p> :
          <div className="divide-y divide-[#f1f1f1] dark:divide-[#34343e]">
            {accounts.map(a=>(
              <div key={a.id} className="px-4 py-3 flex justify-between items-center gap-3">
                <div className="min-w-0"><p className="font-medium text-black dark:text-white text-sm truncate">{a.broker_name} • {a.account_number}</p><p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{a.account_type} {a.server_name?`• ${a.server_name}`:""} • {new Date(a.created_at).toLocaleDateString("id-ID")}</p></div>
                <span className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border ${a.status==="active"?"bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800":a.status==="rejected"?"bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800":"bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"}`}>{a.status}</span>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}
