"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Rule={ id:string; broker_name:string; account_type:string|null; symbol_group:string|null; rate_per_lot:number; currency:string };
type Acc={ id:string; broker_name:string; account_number:string; account_type:string };
function parseCsv(text:string): { rows:{ticket_id:string;symbol:string;volume_lots:string;close_time:string}[]; err:string }{
  const lines=text.trim().split(/\r?\n/); if(lines.length<2) return {rows:[],err:"CSV kosong"};
  const header=lines[0].split(",").map(s=>s.trim().toLowerCase());
  const idx={ ticket:header.indexOf("ticket_id"), symbol:header.indexOf("symbol"), vol:header.indexOf("volume_lots"), close:header.indexOf("close_time") };
  if(Object.values(idx).some(v=>v<0)) return {rows:[],err:"Header harus: ticket_id,symbol,volume_lots,close_time"};
  const rows=[];
  for(let i=1;i<lines.length;i++){ if(!lines[i].trim()) continue; const cols=lines[i].split(",").map(s=>s.trim()); rows.push({ ticket_id:cols[idx.ticket]||"", symbol:cols[idx.symbol]||"", volume_lots:cols[idx.vol]||"", close_time:cols[idx.close]||"" }); }
  return {rows,err:""};
}
function symbolGroup(symbol:string):string{ const s=symbol.toUpperCase(); if(["XAUUSD","XAUEUR","XAGUSD"].includes(s)) return "metals"; if(s.includes("USD")||s.includes("EUR")||s.includes("GBP")||s.includes("JPY")||s.includes("AUD")||s.includes("CAD")||s.includes("CHF")||s.includes("NZD")) return "forex"; if(s.includes("US30")||s.includes("NAS")||s.includes("SPX")||s.includes("GER")||s.includes("UK100")) return "indices"; return "forex"; }
function lookupRate(rules:Rule[], broker:string, accountType:string, symbol:string): number | null{
  const g=symbolGroup(symbol);
  let r=rules.find(x=> x.broker_name===broker && (x.account_type===accountType||x.account_type==="*") && x.symbol_group===g); if(r) return r.rate_per_lot;
  r=rules.find(x=> x.broker_name===broker && x.symbol_group===g); if(r) return r.rate_per_lot;
  r=rules.find(x=> x.broker_name===broker && (x.symbol_group===null||x.symbol_group==="*")); if(r) return r.rate_per_lot;
  return rules.find(x=> x.broker_name===broker)?.rate_per_lot ?? null;
}
export default function ImportClient({ accounts, rules, user }:{ accounts:Acc[]; rules:Rule[]; user:any }){
  const supabase=createClient();
  const [accId,setAccId]=useState(accounts[0]?.id ?? "");
  const [text,setText]=useState("ticket_id,symbol,volume_lots,close_time\n12345,XAUUSD,1.5,2026-10-14T10:00:00Z");
  const [dlq,setDlq]=useState<{row:number; reason:string; data:any}[]>([]);
  const [ok,setOk]=useState(0); const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");
  async function doImport(){
    setLoading(true); setMsg(""); setDlq([]); setOk(0);
    const acc=accounts.find(a=>a.id===accId); if(!acc){ setMsg("Pilih akun broker"); setLoading(false); return; }
    const {rows,err}=parseCsv(text); if(err){ setMsg(err); setLoading(false); return; }
    const dlqLocal:{row:number; reason:string; data:any}[]=[]; let inserted=0; let earned=0;
    for(let i=0;i<rows.length;i++){
      const r=rows[i];
      if(!r.ticket_id || !r.symbol || !r.volume_lots || !r.close_time){ dlqLocal.push({row:i+2, reason:"field kosong", data:r}); continue; }
      const vol=Number(r.volume_lots); if(!isFinite(vol)||vol<=0){ dlqLocal.push({row:i+2, reason:"volume_lots invalid", data:r}); continue; }
      const rate=lookupRate(rules, acc.broker_name, acc.account_type, r.symbol);
      if(rate==null){ dlqLocal.push({row:i+2, reason:`rate tidak ditemukan (${acc.broker_name}/${acc.account_type}/${symbolGroup(r.symbol)})`, data:r}); continue; }
      const gross=rate*vol;
      const payload={ user_id:user.id, broker_account_id:acc.id, broker_name:acc.broker_name, account_number:acc.account_number, ticket_id:r.ticket_id, symbol:r.symbol.toUpperCase(), volume_lots:vol, close_time:new Date(r.close_time).toISOString(), client_rebate:gross, status:"approved" };
      const { error }=await supabase.from("trade_logs").insert(payload);
      if(error){ if(error.message.includes("duplicate")||error.code==="23505") dlqLocal.push({row:i+2, reason:"duplicate ticket_id (idempotent skip)", data:r}); else dlqLocal.push({row:i+2, reason:error.message, data:r}); continue; }
      inserted++; earned+=gross;
    }
    if(earned>0){
      const { data: bal } = await supabase.from("user_balances").select("*").eq("user_id", user.id).single();
      if(!bal) await supabase.from("user_balances").insert({ user_id:user.id, available_balance:earned, total_earned:earned, total_withdrawn:0 });
      else await supabase.from("user_balances").update({ available_balance: Number(bal.available_balance)+earned, total_earned: Number(bal.total_earned)+earned }).eq("user_id", user.id);
    }
    setDlq(dlqLocal); setOk(inserted); setMsg(`Selesai: ${inserted} inserted, ${dlqLocal.length} DLQ. Earned $${earned.toFixed(2)}`); setLoading(false);
  }
  function onFile(e:React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(!f) return; const reader=new FileReader(); reader.onload=()=> setText(String(reader.result||"")); reader.readAsText(f); }
  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="rounded-[24px] p-5 border border-[#e6e6e6] dark:border-transparent" style={{background:"#f4ecd6"}}>
        <p className="text-xs tracking-[0.54px] font-mono uppercase text-black/60">Import CSV — Admin</p>
        <p className="text-[18px] font-semibold tracking-[-0.14px] text-black">Idempotent per ticket_id · auto saldo</p>
      </div>
      <div className="bg-white dark:bg-[#2a2a30] rounded-[24px] p-6 border border-[#e6e6e6] dark:border-[#34343e] flex flex-col gap-4">
        <label className="flex flex-col gap-1"><span className="text-xs tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Akun tujuan</span>
          <select value={accId} onChange={e=>setAccId(e.target.value)} className="border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white rounded-full px-4 py-3 text-[16px] min-h-[44px]">
            {accounts.length===0? <option value="">(belum ada akun — tautkan dulu)</option> : accounts.map(a=><option key={a.id} value={a.id}>{a.broker_name} {a.account_number} ({a.account_type})</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1"><span className="text-xs tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Upload CSV</span>
          <input type="file" accept=".csv" onChange={onFile} className="border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white file:mr-3 file:rounded-full file:border-0 file:bg-black file:text-white file:px-4 file:py-1.5 file:text-sm rounded-full px-4 py-3 text-[16px] min-h-[44px]" />
        </label>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="w-full border border-[#e6e6e6] dark:border-[#34343e] bg-white dark:bg-[#1e1e24] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 rounded-[18px] px-4 py-3 text-[16px] font-mono" placeholder="ticket_id,symbol,volume_lots,close_time" />
        {msg && <p className={`text-sm rounded-xl px-3 py-2 border ${msg.includes("Selesai")?"bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800":"bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"}`}>{msg} {ok>0?`(${ok} ok)`: ""}</p>}
        <button onClick={doImport} disabled={loading} className="bg-black dark:bg-white text-white dark:text-black rounded-full py-3 min-h-[44px] font-medium text-[16px] tracking-[-0.10px] disabled:opacity-50 border border-transparent dark:border-white">{loading?"Importing...":"Import"}</button>
        <p className="text-xs tracking-[-0.14px] text-zinc-500 dark:text-zinc-400">Rate = rebate_rules.rate_per_lot × volume_lots. Idempotent pada ticket_id (unique). Saldo otomatis ter-update.</p>
      </div>
      {dlq.length>0 && (
        <div className="bg-white dark:bg-[#2a2a30] rounded-[24px] border border-[#e6e6e6] dark:border-[#34343e] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f1f1f1] dark:border-[#34343e]"><b className="text-sm text-black dark:text-white">DLQ — {dlq.length} baris gagal</b></div>
          <div className="overflow-x-auto"><table className="w-full text-xs"><thead className="text-black/60 dark:text-white/60 bg-[#f7f7f5] dark:bg-[#1e1e24]"><tr><th className="text-left px-3 py-2">baris</th><th className="text-left px-3 py-2">alasan</th><th className="text-left px-3 py-2">data</th></tr></thead><tbody className="text-black dark:text-white">{dlq.map((d,i)=><tr key={i} className="border-t border-[#f1f1f1] dark:border-[#34343e]"><td className="px-3 py-2">{d.row}</td><td className="px-3 py-2 text-red-600 dark:text-red-400">{d.reason}</td><td className="px-3 py-2 font-mono text-[11px] break-all">{JSON.stringify(d.data)}</td></tr>)}</tbody></table></div>
        </div>
      )}
    </div>
  )
}
