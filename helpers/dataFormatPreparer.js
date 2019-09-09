module.exports = (incomestatement, balanceSheet, cashFlowStatement) => {
    let dataQuater = [];
    for (let i = 0; i < 4; i++) {
        var date = new Date(incomestatement[i].time);
        time = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        dataQuater.push(time)
        dataQuater.push(incomestatement[i].totalRevenue)
        dataQuater.push(incomestatement[i].grossProfit)
        dataQuater.push(incomestatement[i].operatingIncome)
        dataQuater.push(incomestatement[i].netIncome)
        dataQuater.push(balanceSheet[i].totalAssests)
        dataQuater.push(balanceSheet[i].totalLiabilities)
        dataQuater.push(balanceSheet[i].totalEquity)
        dataQuater.push(cashFlowStatement[i].cashFromOperatingActivity)
        dataQuater.push(cashFlowStatement[i].cashFromInvestingActivity)
        dataQuater.push(cashFlowStatement[i].cashFromFinancingActivity)
        dataQuater.push(cashFlowStatement[i].netChangeInCash)
    }
    return dataQuater;
}