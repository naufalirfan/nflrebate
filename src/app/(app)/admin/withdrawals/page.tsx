export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WithdrawalsAdminClient from "./WithdrawalsAdminClient";

export default async function AdminWithdrawalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = me?.role && ["admin", "super_admin", "admin_ops", "finance"].includes(me.role);
  if (!isAdmin) redirect("/dashboard");

  const [{ data: pending }, { data: recent }] = await Promise.all([
    supabase.from("withdrawal_requests").select("*, profiles!withdrawal_requests_user_id_fkey(email,name)").eq("status", "pending").order("created_at", { ascending: false }).limit(200),
    supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  return <WithdrawalsAdminClient user={user} pending={pending ?? []} recent={recent ?? []} />;
}
