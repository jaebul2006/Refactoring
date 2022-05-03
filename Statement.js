import invoice from "./invoices.json" assert { type: "json" };
import plays from "./plays.json" assert { type: "json" };
import CreateStatementData from "./CreateStatementData.js";

function Statement(invoice, plays)
{
    return RenderPlainText(CreateStatementData(invoice, plays));
}

function RenderPlainText(data, plays)
{
    let result = `청구 내역(고객명: ${data.customer})\n`;
    for(let perf of data.performances)
        result += `${perf.play.name}: ${USD(perf.amount)} (${perf.audience}석)\n`;
    
    result += `총액: ${USD(data.totalAmount)}\n`;
    result += `적립 포인트: ${data.TotalVolumeCredits}점\n`;
    return result;
}

function HtmlStatement(invoice, plays)
{
    return RenderHtml(CreateStatementData(invoice, plays));
}

function RenderHtml(data)
{
    let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
    for(let perf of data.performances){
        result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${USD(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>총액: <em>${USD(data.totalAmount)}</em></p>\n`;
    result += `<p>적립 포인트: <em>${data.TotalVolumeCredits}</em>점</p>\n`;
    return result;
}

function USD(aNumber)
{
    return new Intl.NumberFormat("en-UI", {style:"currency", currency:"USD", minimumFractionDigits:2}).format(aNumber/100);
}

let root = document.getElementById('root');
root.innerHTML = HtmlStatement(invoice, plays);