const fs = require('fs');

module.exports = function writeFile(target, data){
    return new Promise((resolve, reject) => {
        fs.appendFile(target, data, (err)=>{
            if (err) reject(err);
            resolve(true);
        })
    })
}