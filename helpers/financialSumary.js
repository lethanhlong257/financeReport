const cheerio = require('cheerio');

module.exports = (HTMLdata) => {
    let $ = cheerio.load(HTMLdata);
    const body = $('body').html();
    $ = cheerio.load(body);


    const companyFinancialSummaryTbl = $('.companyFinancialSummaryTbl').map(function (i, e) {
        return $(e).text().trim();
    }).get().join('\n');

    return companyFinancialSummaryTbl;
}