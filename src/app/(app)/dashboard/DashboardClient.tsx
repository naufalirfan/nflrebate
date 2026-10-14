"use client";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Log = { id:string; ticket_id:string; symbol:string; volume_lots:number; close_time:string; broker_name:string|null; account_number:string|null; client_rebate:number; status:string; };
type Bal = { available_balance:number; total_earned:number; total_withdrawn:number } | null;

function csvEscape(s:string){ return `"${String(s).replace(/"/g,'""')}"`; }
function toCsv(rows:Log[]){
  const header=["close_time","broker","account_number","ticket_id","symbol","volume_lots","client_rebate","status"];
  const lines=[header.join(",")];
  for(const r of rows) lines.push([r.close_time,r.broker_name??"",r.account_number??"",r.ticket_id,r.symbol,String(r.volume_lots),String(r.client_rebate),r.status].map(csvEscape).join(","));
  return lines.join("\n");
}

export default function DashboardClient({ user, initialBalance, initialLogs, accounts }:{ user:any; initialBalance:Bal; initialLogs:Log[]; accounts:{id:string;broker_name:string;account_number:string}[] }){
  const supabase=createClient(); const router=useRouter();
  const [logs]=useState<Log[]>(initialLogs);
  const [fBroker,setFBroker]=useState(""); const [fAccount,setFAccount]=useState(""); const [fSymbol,setFSymbol]=useState(""); const [fFrom,setFFrom]=useState(""); const [fTo,setFTo]=useState("");
  const filtered=useMemo(()=> logs.filter(r=>{
    if(fBroker && r.broker_name!==fBroker) return false;
    if(fAccount && r.account_number!==fAccount) return false;
    if(fSymbol && !r.symbol.toLowerCase().includes(fSymbol.toLowerCase())) return false;
    if(fFrom && r.close_time < fFrom) return false;
    if(fTo && r.close_time > fTo+"T23:59:59") return false;
    return true;
  }),[logs,fBroker,fAccount,fSymbol,fFrom,fTo]);
  const totalRebate=useMemo(()=> filtered.reduce((s,r)=>s+(Number(r.client_rebate)||0),0),[filtered]);
  const volumeMonth=useMemo(()=>{
    const now=new Date(); const ym=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    return logs.filter(r=> r.close_time?.slice(0,7)===ym).reduce((s,r)=>s+Number(r.volume_lots||0),0);
  },[logs]);
  const brokers=[...new Set(logs.map(r=>r.broker_name).filter(Boolean))] as string[];
  function exportCsv(){
    const csv=toCsv(filtered);
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=`rebate-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  }
  async function logout(){ await supabase.auth.signOut(); router.push("/login"); }
  const bal=initialBalance;
  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[34px] font-semibold tracking-[-0.374px] text-[#1d1d1f] dark:text-white">Dashboard</h1>
        <div className="flex gap-2 items-center"><span className="text-xs tracking-[-0.12px] text-[#7a7a7a] hidden sm:block">{user.email}</span><button onClick={logout} className="text-[14px] tracking-[-0.224px] border border-[#e0e0e0] dark:border-zinc-700 rounded-full px-3 py-1.5 min-h-[44px] bg-white dark:bg-zinc-800 dark:text-zinc-100">Keluar</button></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-[18px] p-4 border border-[#e0e0e0] dark:border-zinc-700"><p className="text-xs tracking-[-0.12px] text-[#7a7a7a]">Available Balance</p><p className="text-xl font-semibold tracking-[-0.374px] text-[#06c]">${Number(bal?.available_balance ?? 0).toFixed(2)}</p></div>
        <div className="bg-white dark:bg-zinc-800 rounded-[18px] p-4 border border-[#e0e0e0] dark:border-zinc-700"><p className="text-xs tracking-[-0.12px] text-[#7a7a7a]">Total Lifetime Rebate</p><p className="text-xl font-semibold tracking-[-0.374px] text-[#1d1d1f] dark:text-white">${Number(bal?.total_earned ?? totalRebate).toFixed(2)}</p></div>
        <div className="bg-white dark:bg-zinc-800 rounded-[18px] p-4 border border-[#e0e0e0] dark:border-zinc-700"><p className="text-xs tracking-[-0.12px] text-[#7a7a7a]">Total Withdrawn</p><p className="text-xl font-semibold tracking-[-0.374px] text-[#1d1d1f] dark:text-white">${Number(bal?.total_withdrawn ?? 0).toFixed(2)}</p></div>
        <div className="bg-white dark:bg-zinc-800 rounded-[18px] p-4 border border-[#e0e0e0] dark:border-zinc-700"><p className="text-xs tracking-[-0.12px] text-[#7a7a7a]">Volume Bulan Ini</p><p className="text-xl font-semibold tracking-[-0.374px] text-[#1d1d1f] dark:text-white">{volumeMonth.toFixed(2)} lot</p></div>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-[18px] p-4 border border-[#e0e0e0] dark:border-zinc-700 flex flex-wrap gap-2">
        <select value={fBroker} onChange={e=>setFBroker(e.target.value)} className="border border-[#e0e0e0] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-full px-3 py-2 text-[16px] tracking-[-0.224px] min-h-[44px]"><option value="">Semua broker</option>{brokers.map(b=><option key={b} value={b}>{b}</option>)}</select>
        <select value={fAccount} onChange={e=>setFAccount(e.target.value)} className="border border-[#e0e0e0] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-full px-3 py-2 text-[16px] tracking-[-0.224px] min-h-[44px]"><option value="">Semua akun</option>{accounts.map(a=><option key={a.id} value={a.account_number}>{a.broker_name} {a.account_number}</option>)}</select>
        <input value={fSymbol} onChange={e=>setFSymbol(e.target.value)} placeholder="Symbol (XAUUSD)" className="border border-[#e0e0e0] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-full px-3 py-2 text-[16px] tracking-[-0.224px] min-h-[44px] w-32" />
        <input type="date" value={fFrom} onChange={e=>setFFrom(e.target.value)} className="border border-[#e0e0e0] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-full px-3 py-2 text-[16px] tracking-[-0.224px] min-h-[44px]" />
        <input type="date" value={fTo} onChange={e=>setFTo(e.target.value)} className="border border-[#e0e0e0] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-full px-3 py-2 text-[16px] tracking-[-0.224px] min-h-[44px]" />
        <button onClick={exportCsv} className="ml-auto bg-[#06c] active:bg-[#0071e3] text-white rounded-full px-4 min-h-[44px] text-sm font-normal tracking-[-0.224px]">Export CSV</button>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-[18px] border border-[#e0e0e0] dark:border-zinc-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#f0f0f0] dark:border-zinc-700 flex justify-between items-center"><b className="text-[#1d1d1f] dark:text-white text-[14px] font-semibold tracking-[-0.224px]">Rincian Rebate ({filtered.length})</b><span className="text-xs tracking-[-0.12px] text-[#7a7a7a]">Total: ${totalRebate.toFixed(2)}</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs tracking-[-0.12px] text-[#7a7a7a] bg-[#fafafc] dark:bg-zinc-900/50"><tr><th className="text-left px-3 py-2">close_time</th><th className="text-left px-3 py-2">broker</th><th className="text-left px-3 py-2">account</th><th className="text-left px-3 py-2">ticket</th><th className="text-left px-3 py-2">symbol</th><th className="text-right px-3 py-2">vol</th><th className="text-right px-3 py-2">rebate</th><th className="text-left px-3 py-2">status</th></tr></thead>
            <tbody>
              {filtered.length===0 ? <tr><td colSpan={8} className="text-center py-8 text-[#7a7a7a]">Belum ada data</td></tr> : filtered.slice(0,500).map(r=>(
                <tr key={r.id} className="border-t border-[#f0f0f0] dark:border-zinc-700"><td className="px-3 py-2 whitespace-nowrap">{r.close_time?.slice(0,19).replace("T"," ")}</td><td className="px-3 py-2">{r.broker_name ?? "-"}</td><td className="px-3 py-2">{r.account_number ?? "-"}</td><td className="px-3 py-2 font-mono text-xs">{r.ticket_id}</td><td className="px-3 py-2">{r.symbol}</td><td className="px-3 py-2 text-right">{Number(r.volume_lots).toFixed(2)}</td><td className="px-3 py-2 text-right">${Number(r.client_rebate).toFixed(2)}</td><td className="px-3 py-2"><span className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">{r.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
