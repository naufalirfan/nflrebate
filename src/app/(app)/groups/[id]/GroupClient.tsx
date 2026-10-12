"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatIDR } from "@/lib/utils";
import { settle } from "@/lib/settle";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function GroupClient({group,members,expenses,splits,user}:{group:any; members:any[]; expenses:any[]; splits:any[]; user:any}){
  const [amount,setAmount]=useState(""); const [desc,setDesc]=useState(""); const [cat,setCat]=useState("makan"); const [paidBy,setPaidBy]=useState(user.id);
  const [splitMode,setSplitMode]=useState<"even"|"custom">("even"); const [checked,setChecked]=useState<Record<string,boolean>>(()=>Object.fromEntries(members.map((m:any)=>[m.user_id,true])));
  const [custom,setCustom]=useState<Record<string,string>>({}); const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");
  const supabase=createClient();

  // hitung saldo net per user: total dibayar - total owed
  const paidMap:Record<string,number>={}; const owedMap:Record<string,number>={};
  members.forEach((m:any)=>{paidMap[m.user_id]=0; owedMap[m.user_id]=0});
  expenses.forEach((e:any)=>{ paidMap[e.paid_by]=(paidMap[e.paid_by]||0)+e.amount });
  splits.forEach((s:any)=>{ owedMap[s.user_id]=(owedMap[s.user_id]||0)+s.amount_owed });
  const balances = members.map((m:any)=>({userId:m.user_id, amount:(paidMap[m.user_id]||0)-(owedMap[m.user_id]||0)}));
  const meBal = balances.find(b=>b.userId===user.id)?.amount||0;
  const settlements = settle(balances);

  async function addExpense(e:React.FormEvent){
    e.preventDefault(); const amt=parseInt(amount.replace(/[^0-9]/g,"")); if(!amt||!desc.trim()){setMsg("Isi nominal & deskripsi"); return}
    setLoading(true); setMsg("");
    const memberIds = splitMode==="even" ? members.filter((m:any)=>checked[m.user_id]).map((m:any)=>m.user_id) : Object.keys(custom).filter(k=>custom[k]);
    if(memberIds.length===0){setMsg("Pilih minimal 1 anggota"); setLoading(false); return}
    let owed:Record<string,number>={};
    if(splitMode==="even"){ const per=Math.floor(amt/memberIds.length); const rem=amt - per*memberIds.length; memberIds.forEach((id:string,i:number)=>owed[id]=per + (i===0?rem:0)); }
    else { let sum=0; memberIds.forEach((id:string)=>{ const v=parseInt((custom[id]||"0").replace(/[^0-9]/g,""))||0; owed[id]=v; sum+=v}); if(sum!==amt){setMsg(`Total custom Rp${sum} ≠ Rp${amt}`); setLoading(false); return} }
    const {data: exp, error}=await supabase.from("expenses").insert({group_id:group.id, paid_by:paidBy, amount:amt, description:desc.trim(), category:cat}).select().single();
    if(error){setMsg(error.message); setLoading(false); return}
    const rows=Object.entries(owed).map(([uid, val])=>({expense_id:exp.id, user_id:uid, amount_owed:val}));
    const {error:e2}=await supabase.from("expense_splits").insert(rows);
    if(e2) setMsg(e2.message); else {setAmount(""); setDesc(""); setCustom({}); location.reload();}
    setLoading(false);
  }

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col gap-4 pb-24">
      <header className="flex items-center gap-3 flex-wrap">
        <Link href="/dashboard" className="border rounded-full px-3 py-1.5 text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">← Dashboard</Link>
        <b className="text-lg dark:text-white">{group.name}</b>
        <span className="ml-auto text-xs bg-zinc-900 dark:bg-zinc-700 text-white px-2 py-1 rounded-full">{group.invite_code}</span>
        <ThemeToggle />
      </header>

      {/* Dompet Grup */}
      <div className="rounded-3xl p-5 text-white" style={{background: meBal>=0? "#10b981":"#ef4444"}}>
        <p className="text-sm opacity-80">{meBal>=0? "Kamu ditalangi (piutang)":"Kamu berhutang"}</p>
        <p className="text-3xl font-bold mt-1">{formatIDR(Math.abs(meBal))}</p>
        <p className="text-xs opacity-70 mt-2">{meBal>=0? "Orang lain harus balikin ke kamu":"Kamu harus bayar ke teman"}</p>
      </div>

      {/* Invite */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border dark:border-zinc-700 flex justify-between items-center">
        <div><p className="text-sm font-medium dark:text-white">Undang teman</p><p className="text-xs text-zinc-500 dark:text-zinc-400">Link: /join/{group.invite_code} • Kode: {group.invite_code}</p></div>
        <button onClick={()=>navigator.clipboard.writeText(`${location.origin}/join/${group.invite_code}`)} className="text-sm bg-zinc-900 dark:bg-zinc-700 text-white rounded-full px-4 py-2">Copy Link</button>
      </div>

      {/* Settle Up */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border dark:border-zinc-700">
        <h3 className="font-bold dark:text-white">Settle Up (Smart)</h3>
        {settlements.length===0? <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Semua lunas 🎉</p> :
        <ul className="mt-3 flex flex-col gap-2">
          {settlements.map((s,i)=> {
            const fromName=members.find((m:any)=>m.user_id===s.from)?.profiles?.name || s.from.slice(0,6);
            const toName=members.find((m:any)=>m.user_id===s.to)?.profiles?.name || s.to.slice(0,6);
            return <li key={i} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-700 rounded-xl px-3 py-2 text-sm dark:text-white"><span>{fromName} → {toName}</span><b>{formatIDR(s.amount)}</b></li>
          })}
        </ul>}
        <p className="text-xs text-zinc-400 mt-2">Jalan Tengah: transfer manual via rekening/QRIS, upload bukti, konfirmasi penerima.</p>
      </div>

      {/* Quick Input */}
      <form onSubmit={addExpense} className="bg-white dark:bg-zinc-800 rounded-3xl p-5 border dark:border-zinc-700 shadow-sm flex flex-col gap-3">
        <h3 className="font-bold dark:text-white">Tambah Pengeluaran <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">(~10 detik)</span></h3>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Nominal Rp, ex: 150000" inputMode="numeric" className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px]" />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Nama pengeluaran, ex: Makan siang" className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px]" />
        <div className="flex gap-2">
          {["makan","transport","penginapan","tiket","lainnya"].map(c=>(
            <button key={c} type="button" onClick={()=>setCat(c)} className={`flex-1 rounded-xl py-2 text-xs border capitalize ${cat===c?"bg-emerald-600 text-white border-emerald-600 dark:border-emerald-600":"bg-white dark:bg-zinc-700 dark:text-white dark:border-zinc-600"}`}>{c}</button>
          ))}
        </div>
        <label className="text-sm font-medium dark:text-zinc-200">Siapa yang nalangin (Payer)
          <select value={paidBy} onChange={e=>setPaidBy(e.target.value)} className="mt-1 w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl px-4 py-3 text-[16px]">
            {members.map((m:any)=><option key={m.user_id} value={m.user_id}>{m.profiles?.name||m.profiles?.email||m.user_id.slice(0,6)} {m.user_id===user.id?"(kamu)":""}</option>)}
          </select>
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={()=>setSplitMode("even")} className={`flex-1 rounded-xl py-2 text-sm border ${splitMode==="even"?"bg-zinc-900 dark:bg-white text-white dark:text-zinc-900":"bg-white dark:bg-zinc-700 dark:text-white dark:border-zinc-600"}`}>Bagi Rata</button>
          <button type="button" onClick={()=>setSplitMode("custom")} className={`flex-1 rounded-xl py-2 text-sm border ${splitMode==="custom"?"bg-zinc-900 dark:bg-white text-white dark:text-zinc-900":"bg-white dark:bg-zinc-700 dark:text-white dark:border-zinc-600"}`}>Custom</button>
        </div>
        {splitMode==="even" ?
          <div className="flex flex-wrap gap-2">
            {members.map((m:any)=>(
              <label key={m.user_id} className={`px-3 py-2 rounded-full border text-sm cursor-pointer ${checked[m.user_id]?"bg-emerald-50 dark:bg-emerald-900/30 border-emerald-600 dark:text-white":"bg-white dark:bg-zinc-700 dark:text-white dark:border-zinc-600"}`}>
                <input type="checkbox" checked={!!checked[m.user_id]} onChange={e=>setChecked({...checked,[m.user_id]:e.target.checked})} className="mr-2" />
                {m.profiles?.name||m.user_id.slice(0,6)}
              </label>
            ))}
          </div> :
          <div className="flex flex-col gap-2">
            {members.map((m:any)=>(
              <label key={m.user_id} className="flex items-center gap-2 text-sm dark:text-white">
                <span className="w-24 truncate">{m.profiles?.name||m.user_id.slice(0,6)}</span>
                <input value={custom[m.user_id]||""} onChange={e=>setCustom({...custom,[m.user_id]:e.target.value})} placeholder="Rp 0" className="flex-1 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-3 py-2 text-[16px]" />
              </label>
            ))}
          </div>
        }
        {msg && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2">{msg}</p>}
        <button disabled={loading} className="w-full bg-emerald-600 text-white rounded-xl py-3 font-medium disabled:opacity-50">{loading?"Menyimpan...":"Simpan Pengeluaran"}</button>
      </form>

      {/* Timeline */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border dark:border-zinc-700">
        <h3 className="font-bold dark:text-white">Aktivitas Terakhir</h3>
        {expenses.length===0? <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Belum ada pengeluaran.</p> :
        <ul className="mt-3 flex flex-col gap-2">
          {expenses.map((e:any)=>(
            <li key={e.id} className="flex justify-between items-center border-b dark:border-zinc-700 last:border-0 py-2">
              <div><p className="text-sm font-medium dark:text-white">{e.description}</p><p className="text-xs text-zinc-500 dark:text-zinc-400">{e.category} • {new Date(e.created_at).toLocaleString("id-ID")} • dibayar {members.find((m:any)=>m.user_id===e.paid_by)?.profiles?.name||"?"}</p></div>
              <b className="text-sm dark:text-white">{formatIDR(e.amount)}</b>
            </li>
          ))}
        </ul>}
      </div>
    </div>
  )
}
