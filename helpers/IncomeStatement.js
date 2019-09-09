module.exports = class IncomeStatement {
    constructor (time, totalRevenue,grossProfit,operatingIncome,netIncome) {
        this.time = time;
        this.grossProfit = grossProfit;
        this.totalRevenue = totalRevenue;
        this.operatingIncome = operatingIncome;
        this.netIncome = netIncome;
    }
}
