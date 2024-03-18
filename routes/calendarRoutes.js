const express = require("express");
const calendarRouter = express.Router();
//import db models
const { Trade } = require("../db/models");
const { sequelize } = require("../db/models/index.js");

const { QueryTypes, Op } = require("sequelize");
//module for authentication
const passport = require("passport");
//import utility functions
const TradePerformanceAnalyzer = require("../utility/tradeAnalyzer.js");

//middleware
calendarRouter.use(passport.authenticate("jwt", { session: false }));

calendarRouter.get("/year", async (req, res) => {
    // get the dates from the trade table
    const tradesDates = await sequelize.query(
        `SELECT DISTINCT date_close FROM trades WHERE user_id = ${req.user.id} ORDER BY date_close DESC`,
        { type: QueryTypes.SELECT }
    );
    // get the unique year
    const years = tradesDates.reduce((acc, date) => {
        const year = date.date_close.slice(0, 4);
        if (!acc.includes(year)) {
            acc.push(year);
        }
        return acc;
    }, []);
    years.sort((a, b) => a - b);
    res.status(200).json(years);
});

calendarRouter.get("/tradesData", async (req, res) => {
    let { month, year } = req.query;
    //convert month and year to number
    year = Number(year);
    let startDate;
    let endDate;
    //get the start and end date of the month
    if (month === "null") {
        startDate = `${year}-01-01`;
        endDate = `${year + 1}-01-01`;
    } else {
        month = Number(month) + 1;
        startDate = `${year}-${month}-01`;
        endDate = `${year}-${month + 1}-01`;
        if (month === 12) {
            endDate = `${year + 1}-01-01`;
        }
    }
    try {
        const trades = await Trade.findAll({
            where: {
                user_id: req.user.id,
                date_close: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate,
                },
            },
        });
        const newTradeAnalyzer = new TradePerformanceAnalyzer();
        trades.forEach((trade) => {
            newTradeAnalyzer.addTrade(trade);
        });
        const profitsPerDay = newTradeAnalyzer.getProfitsPerDay();

        if (month !== "null") {
            const getNumberOfTradesPerDay =
                newTradeAnalyzer.getNumberOfTradesPerDay();
            res.status(200).json({ profitsPerDay, getNumberOfTradesPerDay });
            return;
        } else {
            res.status(200).json({ profitsPerDay });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while fetching trade data.",
        });
    }
});

calendarRouter.get("/tradesData:date", async (req, res) => {
    try {
        const date = req.params.date;

        const trades = await Trade.findAll({
            where: {
                date_close: date,
                user_id: req.user.id,
            },
        });

        // calculate the stats for each date
        const newTradeAnalyzer = new TradePerformanceAnalyzer();
        const tradeIdsArray = [];
        trades.forEach((trade) => {
            newTradeAnalyzer.addTrade(trade);
            tradeIdsArray.push(trade.id);
            // newTradeAnalyzer.addExecutionsByTradeId(trade.id);
        });
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

        res.status(200).json({
            totalTrades,
            winRate,
            totalWinningTrades,
            totalLosingTrades,
            totalGrossLoss,
            totalGrossProfit,
            largestWin,
            largestLoss,
            totalProfit,
            completeTradesInfo,
        });
        return;
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});
module.exports = calendarRouter;
