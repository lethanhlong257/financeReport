module.exports = class BalanceSheet {
    constructor (time, totalAssests,totalLiabilities,totalEquity) {
        this.time = time;
        this.totalAssests = totalAssests;
        this.totalLiabilities = totalLiabilities;
        this.totalEquity = totalEquity;
    }
}