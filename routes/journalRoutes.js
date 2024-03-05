// Initialize express router
const express = require("express");
const journalRouter = express.Router();
//  import db models
const { sequelize } = require("../db/models/index.js");
const { QueryTypes } = require('sequelize');
const { Trade, Journal, User } = require("../db/models");

const passport = require("passport");
const TradePerformanceAnalyzer = require("../utility/tradeAnalyzer.js");
// import utility functions

// check if user is authenticated
journalRouter.use(passport.authenticate("jwt", { session: false }));

journalRouter.get("/dates", async(req, res) => {
    try {
        //fetch the unique dates in the trade table
        const tradesDates = await sequelize.query(`SELECT DISTINCT date_close FROM trades WHERE user_id = ${req.user.id} ORDER BY date_close DESC`, { type: QueryTypes.SELECT });
        const dates = tradesDates.map(date => date.date_close)
        res.status(200).json(dates)
        //fetch the dates in the journal table that doesnt exist in the trade table
        // combine the 2 arrays and send it to the frontend to display the dates
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
})

journalRouter.get("/tradesData", async(req,res) => {
    try {
        const dates = req.query.date
        const tradeDataPromise = dates.map(async (date) => {
            const trades = await Trade.findAll ({
                where: {
                    date_close: date,
                    user_id: req.user.id
                }
            })
            // calculate the stats for each date
            const newTradeAnalyzer = new TradePerformanceAnalyzer();
            const tradeIdsArray = []
            trades.forEach(trade => {
                newTradeAnalyzer.addTrade(trade);
                tradeIdsArray.push(trade.id)
                // newTradeAnalyzer.addExecutionsByTradeId(trade.id);
            })
            const executionsPromises = tradeIdsArray.map((tradeId) =>
                newTradeAnalyzer.addExecutionsByTradeId(tradeId)
            );
            await Promise.all(executionsPromises);

            const totalTrades = newTradeAnalyzer.getTotalTradeQuantity();
            const winRate = newTradeAnalyzer.getWinningPercentage();
            const totalWinningTrades = newTradeAnalyzer.getWinningTrades().length;
            const totalLosingTrades = newTradeAnalyzer.getLosingTrades().length;
            const totalGrossLoss = newTradeAnalyzer.getTotalGrossLoss();
            const totalGrossProfit = newTradeAnalyzer.getTotalGrossProfit();
            const largestWin = newTradeAnalyzer.getLargestWin();
            const largestLoss = newTradeAnalyzer.getLargestLoss();
            const totalProfit = newTradeAnalyzer.getTotalReturn();
            const completeTradesInfo = newTradeAnalyzer.getCompleteTradesInfo();


            return ({[date]:{totalTrades, winRate, totalWinningTrades, totalLosingTrades, totalGrossLoss, totalGrossProfit, largestWin, largestLoss, totalProfit, completeTradesInfo}})
        })
        let tradeData = await Promise.all(tradeDataPromise)
        tradeData = tradeData.reduce((acc, current) => {
            return {...acc, ...current}
        }, {})
        res.status(200).json(tradeData)
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
})

journalRouter.get('/trades', async(req, res) => {})

module.exports = journalRouter;
