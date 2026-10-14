"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Register(){
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [show,setShow]=useState(false); const [loading,setLoading]=useState(false); const [err,setErr]=useState(""); const [msg,setMsg]=useState("");
  const router=useRouter(); const supabase=createClient();
  async function onReg(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setErr(""); setMsg("");
    const {error}=await supabase.auth.signUp({email:email.trim(),password, options:{data:{name: name.trim()}, emailRedirectTo: `${location.origin}/auth/callback`}});
    setLoading(false);
    if(error) setErr(error.message);
    else { setMsg("Akun dibuat. Silakan login."); setTimeout(()=>router.push("/login"), 900); }
  }
  return (
    <div className="pbfx-wrap">
      <header className="pbfx-header">
        <Link href="/" className="pbfx-logo">NFL<span>REBATE</span></Link>
        <nav className="pbfx-nav"><Link href="/login">Login</Link><Link href="/">Main Site</Link><span className="pbfx-lang">ID</span></nav>
      </header>
      <main className="pbfx-main">
        <form onSubmit={onReg} className="pbfx-card">
          <h2>Signup Form</h2>
          <label className="pbfx-field"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" required /></label>
          <label className="pbfx-field"><span className="pbfx-ico">@</span><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your E-Mail Address" type="email" required /></label>
          <label className="pbfx-field"><span className="pbfx-ico">*</span><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Choose a Password" type={show?"text":"password"} required /><button type="button" onClick={()=>setShow(s=>!s)} className="pbfx-eye">{show?"Hide":"Show"}</button></label>
          {err && <p className="pbfx-err">{err}</p>}
          {msg && <p className="pbfx-err" style={{color:'#059669',background:'#ecfdf5',borderColor:'#a7f3d0'}}>{msg}</p>}
          <button disabled={loading} className="pbfx-btn">{loading?"Memproses...":"Signup"}</button>
          <p className="pbfx-signup">Sudah punya akun? <Link href="/login">Login here</Link></p>
        </form>
      </main>
    </div>
  )
}
