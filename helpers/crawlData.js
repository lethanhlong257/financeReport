const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
//const IncomeStatement = require('./IncomeStatement');
const lineReader = require('line-reader');
const srcTemp = "temp.txt";
let tempArray = [];
let incomeStatements = []

class IncomeStatement {
    constructor (time, totalRevenue,grossProfit,operatingIncome,netIncome) {
        this.time = time;
        this.grossProfit = grossProfit;
        this.totalRevenue = totalRevenue;
        this.operatingIncome = operatingIncome;
        this.netIncome = netIncome;
    }
}

class BalanceSheet {
    constructor (time, totalAssests,totalLiabilities,totalEquity) {
        this.time = time;
        this.totalAssests = totalAssests;
        this.totalLiabilities = totalLiabilities;
        this.totalEquity = totalEquity;
    }
}

class CashFlowStatement {
    constructor (time, cashFromOperatingActivity,cashFromInvestingActivity,cashFromFinancingActivity,netChangeInCash) {
        this.time = time;
        this.cashFromOperatingActivity = cashFromOperatingActivity;
        this.cashFromInvestingActivity = cashFromInvestingActivity;
        this.cashFromFinancingActivity = cashFromFinancingActivity;
        this.netChangeInCash = netChangeInCash;
    }
}


const formatArray = (array) => {
    let temp = [];
    for (let i = 0; i < array.length; i++) {
        let e = array[i].trim();
        if (e !== '') {
            temp.push(e);
        };
    }
    return temp;
}

const get4ElementInArray = (array, firstIndex, lastIndex) => {
    let temp = [];
    for (let i = firstIndex; i < lastIndex; i++) {
        const element = array[i];
        temp.push(element);
    }
    return temp;
}

const crawlData = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            })
    });
}

async function execute() {
    let date = new Date();
    let beginingTime, endingTime, duration;
    beginingTime = date.getTime();
    const url = 'https://investing.com/equities/vietnam-dairy-products-jsc-financial-summary';
    try {
        const dataHTML = await crawlData(url);
        let $ = cheerio.load(dataHTML);
        const body = $('body').html();
        $ = cheerio.load(body);

        const companyFinancialSummaryTbl = $('.companyFinancialSummaryTbl').map(function (i, e) {
            return $(e).text().trim();
        }).get().join('\n');

        let financeData = companyFinancialSummaryTbl.split('\n');
        financeData = formatArray(financeData);

        let firstIndexPeriod = financeData.indexOf('Period Ending:') +1;
        let firstIndexTotalRevenue = financeData.indexOf('Total Revenue') + 1;
        let firstIndexGrossProfit = financeData.indexOf('Gross Profit') + 1;
        let firstIndexNetIncome = financeData.indexOf('Net Income') + 1;
        let firstIndexTotalAssets = financeData.indexOf('Total Assets') + 1;
        let firstIndexTotalLiabilities = financeData.indexOf('Total Liabilities') + 1;
        let firstIndexOperatingIncome = financeData.indexOf('Operating Income') + 1;
        let firstIndexCashFromOperatingActivities = financeData.indexOf('Cash From Operating Activities') + 1;
        let firstIndexCashFromInvestingActivities = financeData.indexOf('Cash From Investing Activities') + 1;
        let firstIndexCashFromFinancingActivities = financeData.indexOf('Cash From Financing Activities') + 1;
        let firstIndexNetChangeinCash = financeData.indexOf('Net Change in Cash') + 1;
        let firstIndexTotalEquity = financeData.indexOf('Total Equity') + 1;

        let totalRevenueIn4Quarter = get4ElementInArray(financeData, firstIndexTotalRevenue, firstIndexTotalRevenue + 4);
        let grossProfitIn4Quarter = get4ElementInArray(financeData, firstIndexGrossProfit, firstIndexGrossProfit + 4);
        let netIncomeIn4Quarter = get4ElementInArray(financeData, firstIndexNetIncome, firstIndexNetIncome + 4);
        let totalAssestIn4Quarter = get4ElementInArray(financeData, firstIndexTotalAssets, firstIndexTotalAssets + 4);
        let totalLiabilitiesIn4Quarter = get4ElementInArray(financeData, firstIndexTotalLiabilities, firstIndexTotalLiabilities + 4);
        let operatingIncomeIn4Quarter = get4ElementInArray(financeData, firstIndexOperatingIncome, firstIndexOperatingIncome + 4);
        let cashFromOperatingActivitiesIn4Quarter = get4ElementInArray(financeData, firstIndexCashFromOperatingActivities, firstIndexCashFromOperatingActivities + 4);
        let cashFromInvestingActivitiesIn4Quarter = get4ElementInArray(financeData, firstIndexCashFromInvestingActivities, firstIndexCashFromInvestingActivities + 4);
        let cashFromFinancingActivitiesIn4Quarter = get4ElementInArray(financeData, firstIndexCashFromFinancingActivities, firstIndexCashFromFinancingActivities + 4);
        let netChangeinCashIn4Quarter = get4ElementInArray(financeData, firstIndexNetChangeinCash, firstIndexNetChangeinCash + 4);
        let totalEquityIn4Quarter = get4ElementInArray(financeData, firstIndexTotalEquity, firstIndexTotalEquity + 4);
        let periodTime = get4ElementInArray(financeData, firstIndexPeriod, firstIndexPeriod + 4);

        // Add incomestatement data
        for (let i = 0; i < 4; i++) {
            let incomeStatement = new IncomeStatement(
                periodTime[i],
                totalRevenueIn4Quarter[i],
                grossProfitIn4Quarter[i],
                netIncomeIn4Quarter[i],
                operatingIncomeIn4Quarter[i]
            )

            incomeStatements.push(incomeStatement);
        }

        // Add BalanceSheet data
        for (let i = 0; i < 4; i++) {
            let BalanceSheet = new IncomeStatement(
                periodTime[i],
                totalRevenueIn4Quarter[i],
                grossProfitIn4Quarter[i],
                netIncomeIn4Quarter[i],
                operatingIncomeIn4Quarter[i]
            )

            incomeStatements.push(incomeStatement);
        }

        console.log(incomeStatements)

        date = new Date();
        endingTime = date.getTime();
        duration = (endingTime - beginingTime);
        console.log("Time: " + duration + "ms")


    } catch (error) {
        console.error(error)
    }
}

execute()
