export default function CreateStatementData(invoice, plays)
{
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(EnrichPerformance);
    result.totalAmount = TotalAmount(result);
    result.TotalVolumeCredits = TotalVolumeCredits(result);
    return result;

    function EnrichPerformance(aPerformance)
    {
        const result = Object.assign({}, aPerformance);
        result.play = Playfor(result);
        result.amount = AmountFor(result);
        result.volumeCredits = VolumeCreditsFor(result);
        return result;
    }

    function Playfor(aPerformance)
    {
        return plays[aPerformance.playID];
    }

    function AmountFor(aPerformance)
    {
        let result = 0;
        switch(aPerformance.play.type)
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
                throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
        }
        return result;
    }

    function VolumeCreditsFor(aPerformance)
    {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if("comedy" == aPerformance.play.type)
        result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function TotalAmount(data)
    {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }

    function TotalVolumeCredits(data)
    {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }
}