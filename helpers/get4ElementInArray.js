const get4ElementInArray = (array, firstIndex, lastIndex) => {
    let temp = [];
    for (let i = firstIndex; i < lastIndex; i++) {
        const element = array[i];
        temp.push(element);
    }
    return temp;
}

module.exports = get4ElementInArray;