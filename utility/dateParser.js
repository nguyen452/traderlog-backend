module.exports = function dateParser(date) {
    //takes a format of " MM/DD/YYYY and returns YYYY-MM-DD"
    let dateArr = date.split('/');
    dateArr = [dateArr[2], dateArr[0], dateArr[1]];
    return dateArr.join('-');
};
