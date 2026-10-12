"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ProfileClient({ user, profile }: { user: any; profile: any }) {
  const [name, setName] = useState(profile?.name || user.user_metadata?.name || "");
  const [bank, setBank] = useState(profile?.bank_details || "");
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [qrisUrl, setQrisUrl] = useState(profile?.qris_image_url || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  async function save(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg("");
    let newQris = qrisUrl;
    if (qrisFile) {
      const ext = qrisFile.name.split(".").pop() || "png";
      const path = `${user.id}/qris.${ext}`;
      const { error: upErr } = await supabase.storage.from("qris").upload(path, qrisFile, { upsert: true, contentType: qrisFile.type });
      if (upErr) { setMsg("Upload QRIS gagal: " + upErr.message); setLoading(false); return; }
      const { data } = supabase.storage.from("qris").getPublicUrl(path);
      newQris = data.publicUrl;
      setQrisUrl(newQris);
    }
    const { error } = await supabase.from("profiles").update({ name: name.trim(), bank_details: bank.trim(), qris_image_url: newQris }).eq("id", user.id);
    if (error) setMsg(error.message); else setMsg("Profil tersimpan ✓");
    setLoading(false);
  }

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <Link href="/dashboard" className="border rounded-full px-3 py-1.5 text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">← Dashboard</Link>
        <b className="text-lg dark:text-white">Profil</b>
        <span className="ml-auto"><ThemeToggle /></span>
      </header>
      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border dark:border-zinc-700 shadow-sm">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Login sebagai</p>
        <p className="font-medium dark:text-white">{user.email}</p>
        <p className="text-xs text-zinc-400 mt-1">ID: {user.id.slice(0,8)}…</p>
      </div>
      <form onSubmit={save} className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border dark:border-zinc-700 flex flex-col gap-4">
        <h2 className="font-bold dark:text-white">Edit Profil</h2>
        <label className="text-sm font-medium dark:text-zinc-200">Nama tampil
          <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px]" placeholder="Nama kamu" />
        </label>
        <label className="text-sm font-medium dark:text-zinc-200">Rekening / E-Wallet (ditampilkan saat Settle Up)
          <textarea value={bank} onChange={e=>setBank(e.target.value)} rows={2} className="mt-1 w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 rounded-xl px-4 py-3 text-[16px]" placeholder="BCA 1234567890 a.n. Budi / OVO 0812... / Dana ..." />
        </label>
        <label className="text-sm font-medium dark:text-zinc-200">QRIS Personal (upload gambar)
          <input type="file" accept="image/*" onChange={e=>setQrisFile(e.target.files?.[0]||null)} className="mt-1 w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl px-4 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-zinc-900 dark:file:bg-zinc-700 file:text-white file:px-3 file:py-1.5" />
          {qrisUrl && <img src={qrisUrl} alt="QRIS" className="mt-2 max-w-[200px] rounded-xl border dark:border-zinc-600" />}
          {!qrisUrl && <p className="text-xs text-zinc-400 mt-1">Belum ada QRIS. Upload dari e-wallet kamu.</p>}
        </label>
        {msg && <p className={`text-sm ${msg.includes("✓")?"text-emerald-600 dark:text-emerald-400":"text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2"}`}>{msg}</p>}
        <button disabled={loading} className="w-full bg-emerald-600 text-white rounded-xl py-3 font-medium disabled:opacity-50">{loading?"Menyimpan...":"Simpan Profil"}</button>
      </form>
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-sm text-amber-800 dark:text-amber-200">
        <b>Tips:</b> Rekening & QRIS kamu akan terlihat oleh anggota grup saat mereka klik &quot;Bayar&quot; di Settle Up. Pencatatan murni — transfer manual di luar app.
      </div>
    </div>
  );
}
