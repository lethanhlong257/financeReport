const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const lineReader = require('line-reader');

const crawlData = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(function(response){
                resolve(response.data);
            })
            .catch(function(error) {
                reject(error);
            })
    });
}

async function execute() {
    const url = 'https://vn.investing.com/equities/vietnam-dairy-products-jsc-financial-summary';
    const dataHTML = await crawlData(url);
    let $ = cheerio.load(dataHTML);
    const body = $('body').html();
    $ = cheerio.load(body);

    const companyFinancialSummaryTbl = $('.companyFinancialSummaryTbl').map(function(i, e) {
        return $(e).text().trim();
      }).get().join('\n');

    fs.writeFile("temp.html", companyFinancialSummaryTbl, (err) => {
        if (err) console.log(err);
        lineReader.eachLine('./temp.html', function(line) {
            line = line.trim();
            if (line === 'Cuối Kỳ: ') {
                console.log(true)
            } else {
                console.log(line)
            }
        });
      });

    
}

execute()