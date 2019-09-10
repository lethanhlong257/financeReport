module.exports = (incomestatement, balanceSheet, cashFlowStatement) => {
    let dataQuater = [];
    for (let i = 0; i < 4; i++) {
        var date = new Date(incomestatement[i].time);
        time = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        dataQuater.push(time);
        dataQuater.push(isNumber(incomestatement[i].totalRevenue));
        dataQuater.push(isNumber(incomestatement[i].grossProfit));
        dataQuater.push(isNumber(incomestatement[i].operatingIncome));
        dataQuater.push(isNumber(incomestatement[i].netIncome));
        dataQuater.push(isNumber(balanceSheet[i].totalAssests));
        dataQuater.push(isNumber(balanceSheet[i].totalLiabilities));
        dataQuater.push(isNumber(balanceSheet[i].totalEquity));
        dataQuater.push(isNumber(cashFlowStatement[i].cashFromOperatingActivity));
        dataQuater.push(isNumber(cashFlowStatement[i].cashFromInvestingActivity));
        dataQuater.push(isNumber(cashFlowStatement[i].cashFromFinancingActivity));
        dataQuater.push(isNumber(cashFlowStatement[i].netChangeInCash));
    }
    return dataQuater;
}

function isNumber(value) {
    if (isNaN(value))  return 0;
    return value;
}