import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export async function GET(request: Request){
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const errDesc = url.searchParams.get("error_description");
  // pakai APP_URL biar tidak nyasar ke localhost kalau Site URL masih localhost
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const origin = appUrl;
  if (errDesc) return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errDesc)}`);
  if(code){
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: { getAll(){return cookieStore.getAll()}, setAll(c){ try{c.forEach(({name,value,options})=>cookieStore.set(name,value,options))}catch{}} }
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if(!error) return NextResponse.redirect(`${origin}${next}`);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }
  // fallback token_hash flow (kadang Supabase kirim ?token_hash & type)
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as any;
  if (token_hash && type) {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: { getAll(){return cookieStore.getAll()}, setAll(c){ try{c.forEach(({name,value,options})=>cookieStore.set(name,value,options))}catch{}} }
    });
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if(!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
