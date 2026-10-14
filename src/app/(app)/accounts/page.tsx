export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountsClient from "./AccountsClient";
export default async function AccountsPage(){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/login");
  const { data: accounts } = await supabase.from("broker_accounts").select("*").eq("user_id", user.id).order("created_at",{ascending:false});
  return <AccountsClient user={user} initialAccounts={accounts ?? []} />;
}
