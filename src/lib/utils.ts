export function cn(...c: (string|false|undefined)[]){ return c.filter(Boolean).join(" "); }
export function formatIDR(n:number){ return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n); }
export function genInviteCode(len=6){ const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return Array.from({length:len},()=>c[Math.floor(Math.random()*c.length)]).join(""); }
