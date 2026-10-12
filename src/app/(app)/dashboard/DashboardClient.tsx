"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

function genCode(){ const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return Array.from({length:6},()=>c[Math.floor(Math.random()*c.length)]).join(""); }

export default function DashboardClient({user, groups}:{user:any; groups:any[]}){
  const [name,setName]=useState(""); const [joinCode,setJoinCode]=useState(""); const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");
  const supabase=createClient(); const router=useRouter();
  async function createGroup(e:React.FormEvent){
    e.preventDefault(); if(!name.trim()) return; setLoading(true); setMsg("");
    const code=genCode();
    const { data, error } = await supabase.from("groups").insert({name: name.trim(), invite_code: code, created_by: user.id}).select().single();
    if(error){ setMsg(error.message); setLoading(false); return; }
    await supabase.from("group_members").insert({group_id: data.id, user_id: user.id});
    setName(""); setLoading(false); router.refresh();
  }
  async function joinGroup(e:React.FormEvent){
    e.preventDefault(); if(!joinCode.trim()) return; setLoading(true); setMsg("");
    const code=joinCode.trim().toUpperCase();
    const { data: g, error } = await supabase.from("groups").select("id").eq("invite_code", code).single();
    if(error||!g){ setMsg("Kode tidak ditemukan"); setLoading(false); return; }
    const { error: e2 } = await supabase.from("group_members").insert({group_id: g.id, user_id: user.id});
    if(e2) setMsg(e2.message.includes("duplicate")? "Sudah jadi anggota": e2.message); else setJoinCode("");
    setLoading(false); router.refresh();
  }
  async function logout(){ await supabase.auth.signOut(); router.push("/login"); }
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <b className="text-emerald-600 text-xl">SplitBudget</b>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/profile" className="text-sm border rounded-full px-3 py-1.5 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">Profil</Link>
          <span className="text-sm text-zinc-600 dark:text-zinc-400 hidden sm:block">{user.email}</span>
          <button onClick={logout} className="text-sm border rounded-full px-3 py-1.5 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">Keluar</button>
        </div>
      </header>

      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-5 border dark:border-zinc-700 shadow-sm">
        <h2 className="font-bold dark:text-white">Buat Grup Baru</h2>
        <form onSubmit={createGroup} className="mt-3 flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama trip, ex: Bali 2026" className="flex-1 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px]" />
          <button disabled={loading} className="bg-emerald-600 text-white rounded-xl px-5 font-medium disabled:opacity-50">Buat</button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-5 border dark:border-zinc-700 shadow-sm">
        <h2 className="font-bold dark:text-white">Gabung via Kode</h2>
        <form onSubmit={joinGroup} className="mt-3 flex gap-2">
          <input value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="Kode ex: A7K9PQ" className="flex-1 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px] uppercase tracking-widest" />
          <button disabled={loading} className="bg-zinc-900 dark:bg-zinc-700 text-white rounded-xl px-5 font-medium disabled:opacity-50">Gabung</button>
        </form>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Atau buka link: <code className="bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-200 px-1 rounded">/join/KODE</code></p>
      </div>

      {msg && <p className="text-sm text-center text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2">{msg}</p>}

      <div>
        <h2 className="font-bold mb-3 dark:text-white">Grup Kamu ({groups.length})</h2>
        {groups.length===0 ? <p className="text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 rounded-2xl p-6 border dark:border-zinc-700 text-center">Belum ada grup. Buat atau gabung di atas.</p> :
        <div className="grid gap-3">
          {groups.map((g:any)=>(
            <Link key={g.id} href={`/groups/${g.id}`} className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border dark:border-zinc-700 flex justify-between items-center hover:shadow dark:hover:bg-zinc-700/50">
              <div><p className="font-semibold dark:text-white">{g.name}</p><p className="text-xs text-zinc-500 dark:text-zinc-400">Kode: {g.invite_code} • {new Date(g.created_at).toLocaleDateString("id-ID")}</p></div>
              <span className="text-emerald-600 text-sm font-medium">Buka →</span>
            </Link>
          ))}
        </div>}
      </div>
    </div>
  )
}
