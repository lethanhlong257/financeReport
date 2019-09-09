module.exports = class CashFlowStatement {
    constructor (time, cashFromOperatingActivity,cashFromInvestingActivity,cashFromFinancingActivity,netChangeInCash) {
        this.time = time;
        this.cashFromOperatingActivity = cashFromOperatingActivity;
        this.cashFromInvestingActivity = cashFromInvestingActivity;
        this.cashFromFinancingActivity = cashFromFinancingActivity;
        this.netChangeInCash = netChangeInCash;
    }
}
