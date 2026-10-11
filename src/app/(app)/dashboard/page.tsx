export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage(){
  const supabase = await createClient();
  const { data:{user} } = await supabase.auth.getUser();
  if(!user) redirect("/login");
  const { data: memberships } = await supabase.from("group_members").select("group_id, groups(id,name,invite_code,created_at)").eq("user_id", user.id);
  const groups = (memberships||[]).map((m:any)=>m.groups).filter(Boolean);
  return <DashboardClient user={user} groups={groups} />;
}
