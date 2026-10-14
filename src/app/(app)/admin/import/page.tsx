export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ImportClient from "./ImportClient";
export default async function ImportPage(){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/login");
  const [{data:accounts},{data:rules}] = await Promise.all([
    supabase.from("broker_accounts").select("id,broker_name,account_number,account_type").eq("user_id", user.id),
    supabase.from("rebate_rules").select("*"),
  ]);
  return <ImportClient accounts={accounts ?? []} rules={rules ?? []} user={user} />;
}
