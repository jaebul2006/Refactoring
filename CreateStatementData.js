class PerformanceCalculator
{
    constructor(aPerformance, aPlay)
    {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get Amount()
    {
        throw new Error(`서브클래스에서 처리하도록 설계됨`);
    }

    get VolumeCredits()
    {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCalculator extends PerformanceCalculator
{
    get Amount()
    {
        let result = 40000;
        if(this.performance.audience > 30){
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator
{
    get Amount()
    {
        let result = 30000;
        if(this.performance.audience > 20){
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get VolumeCredits()
    {
        return super.VolumeCredits + Math.floor(this.performance.audience / 5);
    }
}

// 자바스크립트에서는 생성자가 서브클래스의 인스턴스를 반환할 수 없어서 만든 함수
function CreatePerformanceCalculator(aPerformance, aPlay)
{
    switch(aPlay.type)
    {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`알 수 없는 장르: ${aPlay.type}`);
    }
}

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
        const calculator = CreatePerformanceCalculator(aPerformance, Playfor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.Amount;
        result.volumeCredits = calculator.VolumeCredits;
        return result;
    }

    function Playfor(aPerformance)
    {
        return plays[aPerformance.playID];
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

