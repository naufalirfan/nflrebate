import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Nfl Rebate - Monitoring Rebate Forex",
  description: "Portal rebate Exness, XM, dan Headway — pantau komisi lot anda real-time.",
  manifest: "/manifest.json",
};
export const viewport: Viewport = { themeColor: "#f7f7f5" };
const themeScript = `try{var t=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";var r=t==="system"||!t?m:t;document.documentElement.classList.add(r)}catch(e){};try{var h=window.location.hash;if(h&&h.indexOf("access_token")>-1){var r2=(h.indexOf("type=recovery")>-1)?"/reset-password":"/dashboard";if(window.location.pathname==="/"||window.location.pathname==="/login"||window.location.pathname==="/register"){window.location.replace(r2+h)}};}catch(e2){}`;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-full flex flex-col text-zinc-900 dark:text-zinc-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
