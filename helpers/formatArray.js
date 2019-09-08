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

module.exports = formatArray;