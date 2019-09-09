const axios = require('axios');

module.exports = (url) => {
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
