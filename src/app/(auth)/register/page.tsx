"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className="flex-1 flex items-center justify-center p-4">
      <form onSubmit={onReg} className="w-full max-w-sm bg-white rounded-3xl p-6 border shadow-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Daftar</h1>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama" required className="w-full border rounded-xl px-4 py-3 text-[16px]" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full border rounded-xl px-4 py-3 text-[16px]" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6)" type="password" required className="w-full border rounded-xl px-4 py-3 text-[16px]" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}
        <button disabled={loading} className="w-full bg-emerald-600 text-white rounded-xl py-3 font-medium disabled:opacity-50">{loading?"Memproses...":"Daftar"}</button>
        <button type="button" onClick={onGoogle} className="w-full border rounded-xl py-3 font-medium">Daftar dengan Google</button>
        <p className="text-sm text-center text-zinc-600">Sudah punya akun? <Link href="/login" className="text-emerald-600 font-medium">Masuk</Link></p>
      </form>
    </div>
  )
}
