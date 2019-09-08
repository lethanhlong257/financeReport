const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const lineReader = require('line-reader');
const srcTemp = "temp.txt";
let tempArray = [];
let incomeStatement = {
    time: '',
    totalRevenue: '',
    grossProfit: '',
    operatingIncome: '',
    netIncome: '',
}

let balanceSheet = {
    time: '',
    totalAssests: '',
    totalLiabilities: '',
    totalEquity: ''
}

let cashFlowStatement = {
    time: '',
    cashFromOperatingActivity: '',
    cashFromInvestingActivity: '',
    cashFromFinancingActivity: '',
    netChangeInCash: '',
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


const get4ElementInArray = (array, firstIndex, lastIndex) => {
    let temp = [];
    for (let i = firstIndex; i < lastIndex; i++) {
        const element = array[i];
        temp.push(element);
    }
    return temp;
}

const findAllIndexesInArray = (array, keyword) => {
    let temp = [];
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        if (e === keyword) {
            temp.push(i);
        }
    }
    return temp;
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

        const indexPeriod = findAllIndexesInArray(financeData, 'Period Ending:');
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
        
        let periodIncomeStatement = get4ElementInArray(financeData)

        console.log(findAllIndexesInArray(financeData, 'Period Ending:'))
        

        date = new Date();
        endingTime = date.getTime();
        duration = (endingTime - beginingTime);
        console.log("Time: " + duration + "ms")


    } catch (error) {
        console.error(error)
    }
}

execute()