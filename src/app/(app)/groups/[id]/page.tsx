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
  const {data: members}=await supabase.from("group_members").select("user_id, profiles(id,name,email)").eq("group_id",id);
  const {data: expenses}=await supabase.from("expenses").select("*").eq("group_id",id).order("created_at",{ascending:false}).limit(20);
  const {data: splits}=await supabase.from("expense_splits").select("*").in("expense_id", (expenses||[]).map((e:any)=>e.id));
  return <GroupClient group={group} members={members||[]} expenses={expenses||[]} splits={splits||[]} user={user} />;
}
