export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WithdrawClient from "./WithdrawClient";

export default async function WithdrawPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: balance }, { data: reqs }] = await Promise.all([
    supabase.from("user_balances").select("*").eq("user_id", user.id).single(),
    supabase.from("withdrawal_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
  ]);
  return <WithdrawClient user={user} initialBalance={balance ?? null} initialRequests={reqs ?? []} />;
}
