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
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold dark:text-white">Akun Broker</h1>
      <form onSubmit={submit} className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border dark:border-zinc-700 flex flex-col gap-3">
        <h2 className="font-semibold dark:text-white">Tautkan Akun</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1"><span className="text-xs text-zinc-500 dark:text-zinc-400">Broker</span>
            <select value={broker} onChange={e=>setBroker(e.target.value)} className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-[16px] min-h-[44px]">{BROKERS.map(b=><option key={b} value={b}>{b}</option>)}</select>
          </label>
          <label className="flex flex-col gap-1"><span className="text-xs text-zinc-500 dark:text-zinc-400">Tipe Akun</span>
            <select value={atype} onChange={e=>setAtype(e.target.value)} className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-[16px] min-h-[44px]">{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
          </label>
        </div>
        <input value={accNo} onChange={e=>setAccNo(e.target.value)} placeholder="Nomor akun (ex: 12345678)" required className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-[16px] min-h-[44px]" />
        <input value={server} onChange={e=>setServer(e.target.value)} placeholder="Server (opsional, ex: Exness-Real)" className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-[16px] min-h-[44px]" />
        {msg && <p className="text-sm text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/30 rounded-xl px-3 py-2">{msg}</p>}
        <button disabled={loading} className="bg-sky-600 text-white rounded-xl py-3 min-h-[44px] font-medium disabled:opacity-50">{loading?"Menyimpan...":"Tautkan"}</button>
      </form>
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border dark:border-zinc-700 overflow-hidden">
        <div className="px-4 py-3 border-b dark:border-zinc-700"><b className="text-sm dark:text-white">Akun Anda ({accounts.length})</b></div>
        {accounts.length===0 ? <p className="p-6 text-center text-sm text-zinc-500">Belum ada akun tertaut</p> :
          <div className="divide-y dark:divide-zinc-700">
            {accounts.map(a=>(
              <div key={a.id} className="px-4 py-3 flex justify-between items-center">
                <div><p className="font-medium dark:text-white text-sm">{a.broker_name} • {a.account_number}</p><p className="text-xs text-zinc-500 dark:text-zinc-400">{a.account_type} {a.server_name?`• ${a.server_name}`:""} • {new Date(a.created_at).toLocaleDateString("id-ID")}</p></div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status==="active"?"bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300":a.status==="rejected"?"bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300":"bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"}`}>{a.status}</span>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}
