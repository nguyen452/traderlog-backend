const getFilteredDataByPeriod = (data, period) => {
     //helper function to transform period to kebab case
     const transformPeriodToKebabCase = (period) => {
        period = period.split(" ");
        return period.join("-").toLowerCase();
    };
    period = transformPeriodToKebabCase(period);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    // sort data by date
    const sortedData = data.sort((a, b) => {

        return new Date(a.date_close) - new Date(b.date_close);
    })

    // use filter method to check the date of each trade
  if (period === "all-time" || period === "year-to-date") {
    const filteredData = sortedData.filter((trade) => {
        // transform date string into date object
        const tradeDate = new Date(trade.date_close);
        if (period === "year-to-date") {
            return tradeDate.getFullYear() === currentYear;
        } else {
            return tradeDate;
        }
    })
    return filteredData;
    } else {
        if (period === "last-7-days") {
            return sortedData.slice(-7);
        } else if (period === "last-30-days") {
            return sortedData.slice(-30);
        } else if (period === "last-15-days") {
            return sortedData.slice(-15);
        } else if (period === "last-5-days") {
            return sortedData.slice(-5);
        }
    };
    // if no period is selected, return all trades
    return sortedData;
}

module.exports = getFilteredDataByPeriod;
