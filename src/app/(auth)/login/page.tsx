"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  const router=useRouter(); const supabase=createClient();
  async function onLogin(e:React.FormEvent){ e.preventDefault(); setLoading(true); setErr(""); const {error}=await supabase.auth.signInWithPassword({email,password}); setLoading(false); if(error) setErr(error.message); else router.push("/dashboard"); }
  async function onGoogle(){ const {error}=await supabase.auth.signInWithOAuth({provider:"google", options:{redirectTo:`${location.origin}/auth/callback`}}); if(error) setErr(error.message); }
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <form onSubmit={onLogin} className="w-full max-w-sm bg-white rounded-3xl p-6 border shadow-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Masuk</h1>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full border rounded-xl px-4 py-3 text-[16px]" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full border rounded-xl px-4 py-3 text-[16px]" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={loading} className="w-full bg-emerald-600 text-white rounded-xl py-3 font-medium disabled:opacity-50">{loading?"Memproses...":"Masuk"}</button>
        <button type="button" onClick={onGoogle} className="w-full border rounded-xl py-3 font-medium">Masuk dengan Google</button>
        <p className="text-sm text-center text-zinc-600">Belum punya akun? <Link href="/register" className="text-emerald-600 font-medium">Daftar</Link></p>
      </form>
    </div>
  )
}
