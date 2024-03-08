module.exports = function dateParser(date) {
    // takes a format of " MM/DD/YYYY or MM-DD-YYYY and returns YYYY-MM-DD"
    let dateArr;

    if (date[2] === "/") {
        dateArr = date.split("/");
    } else if (date[2] === "-") {
        dateArr = date.split("-");
    }

    dateArr = [dateArr[2], dateArr[0], dateArr[1]];
    return dateArr.join("-");
};
