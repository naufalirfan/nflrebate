export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage(){
  const supabase = await createClient();
  const { data:{user} } = await supabase.auth.getUser();
  if(!user) redirect("/login");
  const [{ data: balance }, { data: logs }, { data: accounts }] = await Promise.all([
    supabase.from("user_balances").select("*").eq("user_id", user.id).single(),
    supabase.from("trade_logs").select("*").eq("user_id", user.id).order("close_time", { ascending: false }).limit(500),
    supabase.from("broker_accounts").select("id,broker_name,account_number").eq("user_id", user.id),
  ]);
  return <DashboardClient user={user} initialBalance={balance ?? null} initialLogs={logs ?? []} accounts={accounts ?? []} />;
}
