"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function Register(){
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); const [err,setErr]=useState(""); const [msg,setMsg]=useState("");
  const router=useRouter(); const supabase=createClient();
  async function onReg(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setErr(""); setMsg("");
    const {error}=await supabase.auth.signUp({email,password, options:{data:{name}}});
    setLoading(false);
    if(error) setErr(error.message); else { setMsg("Cek email untuk verifikasi. Atau langsung login jika verifikasi nonaktif."); setTimeout(()=>router.push("/login"),1500); }
  }
  async function onGoogle(){ const {error}=await supabase.auth.signInWithOAuth({provider:"google", options:{redirectTo:`${location.origin}/auth/callback`}}); if(error) setErr(error.message); }
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900 min-h-dvh">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <form onSubmit={onReg} className="w-full max-w-sm bg-white dark:bg-zinc-800 rounded-3xl p-6 border dark:border-zinc-700 shadow-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Daftar</h1>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama" required className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px]" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px]" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6)" type="password" required className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px]" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-emerald-600 dark:text-emerald-400">{msg}</p>}
        <button disabled={loading} className="w-full bg-emerald-600 text-white rounded-xl py-3 font-medium disabled:opacity-50">{loading?"Memproses...":"Daftar"}</button>
        <button type="button" onClick={onGoogle} className="w-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-600 rounded-xl py-3 font-medium">Daftar dengan Google</button>
        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">Sudah punya akun? <Link href="/login" className="text-emerald-600 font-medium">Masuk</Link></p>
      </form>
    </div>
  )
}
