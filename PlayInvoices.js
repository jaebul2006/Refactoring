import invoice from "./invoices.json" assert { type: "json" };
import plays from "./plays.json" assert { type: "json" };

function Statement(invoice, plays)
{
    let totalAmount = 0;
    let result = `청구 내역(고객명: ${invoice.customer})\n`;

    for(let perf of invoice.performances)
    {
        result += `${Playfor(perf).name}: ${USD(AmountFor(perf))} (${perf.audience}석)\n`;
        totalAmount += AmountFor(perf);
    }
    result += `총액: ${USD(totalAmount)}\n`;
    result += `적립 포인트: ${TotalVolumeCredits()}점\n`;
    return result;
}

function AmountFor(aPerformance)
{
    let result = 0;
    switch(Playfor(aPerformance).type)
    {
        case "tragedy":
            result = 40000;
            if(aPerformance.audience > 30){
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if(aPerformance.audience > 20){
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`알 수 없는 장르: ${Playfor(aPerformance).type}`);
    }
    return result;
}

function Playfor(aPerformance)
{
    return plays[aPerformance.playID];
}

function VolumeCreditsFor(aPerformance)
{
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if("comedy" == Playfor(aPerformance).type)
    result += Math.floor(aPerformance.audience / 5);
    return result;
}

function USD(aNumber)
{
    return new Intl.NumberFormat("en-UI", {style:"currency", currency:"USD", minimumFractionDigits:2}).format(aNumber/100);
}

function TotalVolumeCredits()
{
    let volumeCredits = 0;
    for(let perf of invoice.performances)
        volumeCredits += VolumeCreditsFor(perf);
    return volumeCredits;
}

console.log(Statement(invoice, plays));