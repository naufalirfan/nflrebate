// minimal debt simplification: net balance -> greedy settlement
export type Balance = { userId:string; amount:number }; // positive = piutang, negative = hutang
export function settle(balances:Balance[]){
  const debtors = balances.filter(b=>b.amount<0).map(b=>({...b,amount:-b.amount})).sort((a,b)=>b.amount-a.amount);
  const creditors = balances.filter(b=>b.amount>0).sort((a,b)=>b.amount-a.amount);
  const result:{from:string;to:string;amount:number}[]=[];
  let i=0,j=0;
  while(i<debtors.length && j<creditors.length){
    const d=debtors[i], c=creditors[j];
    const amt=Math.min(d.amount,c.amount);
    result.push({from:d.userId,to:c.userId,amount:amt});
    d.amount-=amt; c.amount-=amt;
    if(d.amount===0) i++; if(c.amount===0) j++;
  }
  return result;
}
