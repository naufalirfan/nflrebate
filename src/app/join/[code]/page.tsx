export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function JoinPage({params}:{params:Promise<{code:string}>}){
  const {code}=await params;
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect(`/login?next=/join/${code}`);
  const {data: g}=await supabase.from("groups").select("id,name").eq("invite_code", code.toUpperCase()).single();
  if(!g) return <div className="p-8 text-center">Kode tidak ditemukan: {code}</div>;
  await supabase.from("group_members").insert({group_id:g.id, user_id:user.id});
  redirect(`/groups/${g.id}`);
}
