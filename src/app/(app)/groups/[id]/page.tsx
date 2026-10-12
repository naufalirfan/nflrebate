export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GroupClient from "./GroupClient";
export default async function GroupPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data: group}=await supabase.from("groups").select("*").eq("id",id).single();
  if(!group) redirect("/dashboard");
  const {data: rawMembers}=await supabase.from("group_members").select("user_id").eq("group_id",id);
  const userIds=(rawMembers||[]).map((m:any)=>m.user_id);
  let profilesMap:Record<string,any>={};
  if(userIds.length){
    const {data: profs}=await supabase.from("profiles").select("id,name,email").in("id", userIds);
    (profs||[]).forEach((p:any)=>profilesMap[p.id]=p);
  }
  const members=(rawMembers||[]).map((m:any)=>({user_id:m.user_id, profiles: profilesMap[m.user_id]||null}));
  const {data: expenses}=await supabase.from("expenses").select("*").eq("group_id",id).order("created_at",{ascending:false}).limit(20);
  const expIds=(expenses||[]).map((e:any)=>e.id);
  const {data: splits}=expIds.length>0
    ? await supabase.from("expense_splits").select("*").in("expense_id", expIds)
    : {data:[] as any};
  return <GroupClient group={group} members={members} expenses={expenses||[]} splits={splits||[]} user={user} />;
}