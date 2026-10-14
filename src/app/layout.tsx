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
export const viewport: Viewport = { themeColor: "#0ea5e9" };
const themeScript = `try{var t=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";var r=t==="system"||!t?m:t;document.documentElement.classList.add(r)}catch(e){}`;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
