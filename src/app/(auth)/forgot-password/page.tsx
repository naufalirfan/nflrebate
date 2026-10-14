"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
export default function Forgot(){
  const [email,setEmail]=useState(""); const [loading,setLoading]=useState(false); const [err,setErr]=useState(""); const [msg,setMsg]=useState("");
  const supabase=createClient();
  async function onSubmit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setErr(""); setMsg("");
    const {error}=await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/auth/callback?next=/reset-password` });
    setLoading(false);
    if(error) setErr(error.message); else setMsg("Link reset terkirim. Cek inbox & spam.");
  }
  return (
    <div className="pbfx-wrap">
      <header className="pbfx-header"><Link href="/" className="pbfx-logo">NFL<span>REBATE</span></Link><nav className="pbfx-nav"><Link href="/login">Login</Link><Link href="/">Main Site</Link><span className="pbfx-lang">ID</span></nav></header>
      <main className="pbfx-main">
        <form onSubmit={onSubmit} className="pbfx-card">
          <h2>Reset Password</h2>
          <p style={{fontSize:13, color:"#64748b", textAlign:"center"}}>Masukkan email, kami kirim link ganti password.</p>
          <label className="pbfx-field"><span className="pbfx-ico">@</span><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-Mail" type="email" required /></label>
          {err && <p className="pbfx-err">{err}</p>}
          {msg && <p className="pbfx-err" style={{color:"#059669",background:"#ecfdf5",borderColor:"#a7f3d0"}}>{msg}</p>}
          <button disabled={loading} className="pbfx-btn">{loading?"Mengirim...":"Kirim link"}</button>
          <p className="pbfx-signup"><Link href="/login">Kembali ke Login</Link></p>
        </form>
      </main>
    </div>
  )
}
