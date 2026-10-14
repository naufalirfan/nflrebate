"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

function ConfirmInner() {
  const sp = useSearchParams();
  const email = sp.get("email") || "";
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function resend() {
    if (!email) { setErr("Email tidak ditemukan. Daftar ulang."); return; }
    if (cooldown > 0) return;
    setSending(true); setErr(""); setMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSending(false);
    if (error) setErr(error.message);
    else { setMsg("Email verifikasi terkirim ulang. Cek inbox & spam."); setCooldown(60); }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-[#1e1e24] min-h-dvh">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-sm bg-white dark:bg-[#2a2a30] rounded-3xl p-6 border dark:border-[#34343e] shadow-sm flex flex-col gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto text-2xl">✉️</div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Cek email kamu</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Kami kirim link verifikasi ke<br />
          <b className="text-zinc-900 dark:text-white break-all">{email || "email kamu"}</b>
        </p>
        <p className="text-xs text-zinc-500 dark:text-white/40">Klik link di email untuk aktifkan akun. Cek folder spam jika tidak ada. Link lewat email Supabase — bisa ganti ke domain sendiri di Dashboard → Auth → Custom SMTP.</p>
        {msg && <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl px-3 py-2">{msg}</p>}
        {err && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2">{err}</p>}
        <button onClick={resend} disabled={sending || cooldown > 0 || !email} className="w-full bg-emerald-600 text-white rounded-xl py-3 font-medium disabled:opacity-50 text-sm">
          {sending ? "Mengirim..." : cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim ulang email"}
        </button>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/login" className="text-emerald-600 font-medium">Sudah verifikasi? Masuk</Link>
          <Link href="/register" className="text-zinc-500 dark:text-zinc-400">Ganti email / daftar ulang</Link>
        </div>
        <p className="text-[11px] text-zinc-400 dark:text-white/40">Jika localhost error: ganti Site URL di Supabase Dashboard → Authentication → URL Configuration → Site URL = https://nflrebate.vercel.app</p>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-zinc-500">Memuat...</div>}><ConfirmInner /></Suspense>;
}
