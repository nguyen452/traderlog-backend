const express = require("express");
const passport = require("passport");
const reportRouter = express.Router();
const { Trade } = require("../db/models");
const getAllModelDataByUserId = require("../utility/getAllModelDataByUserId");
const TradeAnalyzer = require("../utility/tradeAnalyzer");
const calculateReportStatistic = require("../utility/calculateReportStatistic");
const { Op } = require("sequelize");

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
       const statistic = calculateReportStatistic(tradesAnalyzer);
       res.status(200).json(statistic);
    } catch (error) {
        console.log(error);
    }
});

reportRouter.get("/statisticData/filtered", async (req, res) => {
    let { startDate, endDate, symbol, duration } = req.query;
    console.log(symbol, startDate, endDate, duration);
    let queryCondition = {
        user_id: req.user.id,
    }
    //symbol
    if (symbol) {
        queryCondition.symbol = symbol.toUpperCase();
    }
    //duration
    if (duration !== "all" && duration === "intraday") {
        queryCondition.date_start = date_close;
    } else if (duration !== "all" && duration === "multiDay") {
        queryCondition.date_start = { [Op.ne]: date_close };
    }
    //date

    if (startDate && endDate) {
        queryCondition.date_close = {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
        };
    } else if (startDate) {
        queryCondition.date_close = {
            [Op.gte]: startDate,
        };
    }else if (endDate) {
        queryCondition.date_close = {
            [Op.lte]: endDate,
        };
    }

    console.log(queryCondition)

    try {
        const tradeData = await Trade.findAll({where: queryCondition});

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

        const statistic = calculateReportStatistic(tradesAnalyzer);
        res.status(200).json(statistic);
    } catch (error) {
        console.log(error);
    }
});

module.exports = reportRouter;
