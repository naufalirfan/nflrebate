"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginInner(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [show,setShow]=useState(false); const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  const router=useRouter(); const sp=useSearchParams(); const supabase=createClient();
  useEffect(()=>{ const e=sp.get("error"); if(e) setErr(decodeURIComponent(e)); },[sp]);
  async function onLogin(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setErr("");
    const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
    setLoading(false);
    if(error) setErr(error.message); else router.push("/dashboard");
  }
  async function resend(){
    if(!email) return setErr("Isi email dulu lalu klik kirim ulang.");
    const {error}=await supabase.auth.resend({type:"signup", email:email.trim(), options:{emailRedirectTo:`${location.origin}/auth/callback`}});
    if(error) setErr(error.message); else alert("Email verifikasi terkirim ulang. Cek inbox & spam.");
  }
  return (
    <div className="pbfx-wrap">
      <header className="pbfx-header">
        <Link href="/" className="pbfx-logo">NFL<span>REBATE</span></Link>
        <nav className="pbfx-nav">
          <Link href="/login" className="active">Login</Link>
          <Link href="/">Main Site</Link>
          <span className="pbfx-lang">ID</span>
        </nav>
      </header>
      <main className="pbfx-main">
        <form onSubmit={onLogin} className="pbfx-card">
          <h2>Member Login</h2>
          <label className="pbfx-field">
            <span className="pbfx-ico">@</span>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-Mail" type="email" required autoComplete="username" />
          </label>
          <label className="pbfx-field">
            <span className="pbfx-ico">*</span>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type={show?"text":"password"} required autoComplete="current-password" />
            <button type="button" onClick={()=>setShow(s=>!s)} className="pbfx-eye" aria-label="Toggle password">{show?"Hide":"Show"}</button>
          </label>
          {err && <p className="pbfx-err">{err} {/confirm|verif/i.test(err) ? <button type="button" onClick={resend} className="underline font-medium">kirim ulang email</button> : null}</p>}
          <button disabled={loading} className="pbfx-btn">{loading?"Memproses...":"Login"}</button>
          <Link href="/forgot-password" className="pbfx-lost">Lost password?</Link>
          <p className="pbfx-signup">Not registered yet? <Link href="/register">Signup here</Link></p>
        </form>
      </main>
    </div>
  );
}
export default function Login(){ return <Suspense fallback={<div className="pbfx-wrap"><p style={{padding:32}}>Memuat...</p></div>}><LoginInner/></Suspense>; }
