import { trade } from "../models/trade";

const getFilteredReportData = async (symbol, duration, startDate, endDate, userId) => {
    // find all report data for user with no filters
    const trades = await trade.findAll
}
