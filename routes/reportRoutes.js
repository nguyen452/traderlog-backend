const express = require("express");
const passport = require("passport");
const reportRouter = express.Router();
const { addTradesToTracker } = require("../utility/tradeCalculation");
const { Trade } = require("../db/models");
const getAllModelDataByUserId = require("../utility/getAllModelDataByUserId");
const TradeAnalyzer = require("../utility/tradeAnalyzer");
const roundingNumbers = require("../utility/roundingNumbers");

reportRouter.use(passport.authenticate("jwt", { session: false }));

// get statistic data

reportRouter.get("/allStatisticData", async (req, res) => {
    try {
        const tradeData = await getAllModelDataByUserId(Trade, req.user.id);
        const tradesAnalyzer = new TradeAnalyzer();
        const tradeIdArray = [];
        tradeData.forEach((trade) => {
            tradesAnalyzer.addTrade(trade);
            tradeIdArray.push(trade.id);
        });

        const executionsPromises = tradeIdArray.map((tradeId) =>
            tradesAnalyzer.addExecutionsByTradeId(tradeId)
        );

        await Promise.all(executionsPromises);

        //trade reports data
        const totalGrossProfit = tradesAnalyzer.getTotalGrossProfit();
        const averageDailyPnL = tradesAnalyzer.getAverageDailyPnl();
        const averageDailyVolume = tradesAnalyzer.getAverageDailyVolume();
        const averagePerSharePnL = roundingNumbers( tradesAnalyzer.getTotalGrossProfit()/tradesAnalyzer.getTotalVolumeTraded(), 2)
        const averageWinningTrade = tradesAnalyzer.getAverageWin();
        const averageLosingTrade = tradesAnalyzer.getAverageLoss();
        const totalNumberOfTrades = tradesAnalyzer.trades.length;
        const totalWinningTrades = tradesAnalyzer.getWinningTrades().length;
        const totalLosingTrades = tradesAnalyzer.getLosingTrades().length;
        // const maxConsecutiveWins = tradesAnalyzer.getMaxConsecutiveWins();
        // const maxConsecutiveLosses = tradesAnalyzer.getMaxConsecutiveLosses();
        res.status(200).json({ totalGrossProfit, averageDailyPnL, averageDailyVolume, averagePerSharePnL});
    } catch (error) {
        console.log(error);
    }
});

module.exports = reportRouter;
