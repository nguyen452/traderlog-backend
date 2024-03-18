const convertDateToTimeInSecond = (date) => {
    const dateInMilliSeconds = new Date(date).getTime();
    return Math.floor(dateInMilliSeconds / 1000);
}

module.exports = convertDateToTimeInSecond;
