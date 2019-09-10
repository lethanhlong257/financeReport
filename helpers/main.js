const fs = require('fs');
const financialSumary = require('./financialSumary');
const get4ElementInArray = require('./get4ElementInArray');
const formatArray = require('./formatArray');
const dataFormatPreparer = require('./dataFormatPreparer');
const crawlData = require('./crawlData');
const companyNameFromURL = require('./companyNameFromURL');

const srcTarget = '../data.csv'

let bufSize = 64 * 1024;
let buf = new Buffer(bufSize);

// get urls
let urls = fs.readFileSync('./urls.txt', buf);
console.log(urls)

function execute(url) {
    let BalanceSheet = require('./BalanceSheet');
    let IncomeStatement = require('./IncomeStatement');
    let CashFlowStatement = require('./CashFlowStatement');
    return new Promise( async (resolve, reject) => {
        let incomeStatements = [];
        let balanceSheets = [];
        let cashFlowStatements = [];
        try {
            // Generate data from URL
            const dataHTML = await crawlData(url);
            let financeData = financialSumary(dataHTML).split('\n');
            financeData = formatArray(financeData);
           

            let firstIndexPeriod = financeData.indexOf('Period Ending:') + 1;
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
                let balanceSheet = new BalanceSheet(
                    periodTime[i],
                    totalAssestIn4Quarter[i],
                    totalLiabilitiesIn4Quarter[i],
                    totalEquityIn4Quarter[i],
                );
                balanceSheets.push(balanceSheet);
            }

            // Add CashFlowStatement data
            for (let i = 0; i < 4; i++) {
                let cashFlowStatement = new CashFlowStatement(
                    periodTime[i],
                    cashFromOperatingActivitiesIn4Quarter[i],
                    cashFromInvestingActivitiesIn4Quarter[i],
                    cashFromFinancingActivitiesIn4Quarter[i],
                    netChangeinCashIn4Quarter[i]
                );
                cashFlowStatements.push(cashFlowStatement);
            }

            let formatedFinanceData =dataFormatPreparer(incomeStatements, balanceSheets, cashFlowStatements).toString() + '\n';
            resolve(formatedFinanceData)
        } catch (error) {
            reject(error)
        }
    })
}

async function main() {
    let financeDataHeader = 'Chu kỳ,Tổng doanh thu,Lợi nhuận gộp,THu nhập hoạt động,Thu nhập ròng,Tổng tài sản,Tổng nợ phải trả,Tổng vốn sở hữu,Tiền mặt từ hoạt động kinh doanh,Tiền mặt từ hoạt động đầu tư,Tiền mặt từ hoạt động tài chính,Thay đổi tiền mặt ròng';
    financeDataHeader = `,${financeDataHeader},${financeDataHeader},${financeDataHeader},${financeDataHeader}\n`;

    try {
        if (fs.existsSync(srcTarget)) {
            fs.unlinkSync(srcTarget);
            // Write header
            fs.appendFileSync(srcTarget, financeDataHeader, 'utf8');
        }
    } catch (error) {
        console.log('Error when delete file')
        console.log(error)
    }

    try {
        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];
            let companyName = companyNameFromURL(url, url.indexOf('/equities/')+10, url.indexOf('-financial-summary'));
            let formatedFinanceData = await execute(url);
            formatedFinanceData = `${companyName},${formatedFinanceData}`;
            fs.appendFileSync(srcTarget, formatedFinanceData, 'utf8');
            console.log('Sucessfully - ' + url);
        }
    } catch (error) {
        console.log(error + '\n' + 'Error when write file to csv')   
    }
}

main()



