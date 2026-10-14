"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function ResetPassword(){
  const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState("");
  const [show,setShow]=useState(false); const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(""); const [msg,setMsg]=useState(""); const [ready,setReady]=useState(false);
  const router=useRouter(); const supabase=createClient();
  useEffect(()=>{
    // handle hash fragment #access_token=... from Supabase verify redirect
    const hash = window.location.hash;
    if(hash && hash.includes("access_token")){
      const params = new URLSearchParams(hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if(access_token && refresh_token){
        supabase.auth.setSession({ access_token, refresh_token }).then(({error})=>{
          if(error) setErr(error.message);
          setReady(true);
        });
        return;
      }
    }
    // also handle ?code flow already exchanged by /auth/callback -> session exists
    supabase.auth.getSession().then(({data})=>{
      if(data.session) setReady(true);
      else {
        // check if we landed here without session (expired link)
        setErr("Link reset tidak valid atau sudah kadaluarsa. Minta link baru di Forgot Password.");
        setReady(true);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    if(password.length < 6) return setErr("Password minimal 6 karakter.");
    if(password !== confirm) return setErr("Konfirmasi password tidak cocok.");
    setLoading(true); setErr("");
    const {error}=await supabase.auth.updateUser({ password });
    setLoading(false);
    if(error) setErr(error.message);
    else { setMsg("Password diperbarui. Mengarahkan ke login..."); setTimeout(()=>router.push("/login"), 1200); }
  }
  return (
    <div className="pbfx-wrap">
      <header className="pbfx-header"><Link href="/" className="pbfx-logo">NFL<span>REBATE</span></Link><nav className="pbfx-nav"><Link href="/login">Login</Link><Link href="/">Main Site</Link><span className="pbfx-lang">ID</span></nav></header>
      <main className="pbfx-main">
        <form onSubmit={onSubmit} className="pbfx-card">
          <h2>Set Password Baru</h2>
          {!ready ? <p style={{fontSize:13,color:"#64748b",textAlign:"center"}}>Memuat sesi...</p> : null}
          <label className="pbfx-field">
            <span className="pbfx-ico">*</span>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password baru (min 6)" type={show?"text":"password"} required />
            <button type="button" onClick={()=>setShow(s=>!s)} className="pbfx-eye">{show?"Hide":"Show"}</button>
          </label>
          <label className="pbfx-field">
            <span className="pbfx-ico">*</span>
            <input value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Ulangi password" type={show?"text":"password"} required />
          </label>
          {err && <p className="pbfx-err">{err}</p>}
          {msg && <p className="pbfx-err" style={{color:"#059669",background:"#ecfdf5",borderColor:"#a7f3d0"}}>{msg}</p>}
          <button disabled={loading || !ready} className="pbfx-btn">{loading?"Menyimpan...":"Simpan password"}</button>
          <p className="pbfx-signup"><Link href="/login">Kembali ke Login</Link> · <Link href="/forgot-password">Minta link baru</Link></p>
        </form>
      </main>
    </div>
  );
}
