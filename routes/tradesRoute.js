const express = require("express");
const tradeRouter = express.Router();
const { addTradesToTracker } = require("../utility/tradeCalculation");
const insertTrades = require("../utility/insertTrades");
const { Trade } = require("../db/models");
const getAllModelDataByUserId = require("../utility/getAllModelDataByUserId");
const getFilteredDataByPeriod = require("../utility/getFilteredDataByPeriod");

const multer = require("multer");
const fs = require("fs").promises;
const Papa = require("papaparse");
const upload = multer({ dest: "./db/uploads" });
const passport = require("../strategies/jwtStrategy");
const TradeAnalyzer = require("../utility/tradeAnalyzer");

tradeRouter.use(passport.authenticate("jwt", { session: false }));

// get all trade
tradeRouter.get("/tradeMetrics/:period", async (req, res) => {
    const period = req.params.period;
    // pull all trades from database
    try {
        let tradeData = await getAllModelDataByUserId(Trade, req.user.id);
        // filter trades by period
        const filteredTradeData = getFilteredDataByPeriod(tradeData, period);
        // create a new instance of TradeAnalyzer
        const tradesAnalyzer = new TradeAnalyzer();
        // array of tradesId to add executions
        const tradeIdArray = [];
        // add trades to tradeAnalyzer
        filteredTradeData.forEach((trade) => {
            tradesAnalyzer.addTrade(trade);
            tradeIdArray.push(trade.id);
        });
        //get arrays of executions promises by tradeId
        const executionsPromises = tradeIdArray.map((tradeId) =>
            tradesAnalyzer.addExecutionsByTradeId(tradeId)
        );
        // wait for all promises to resolve
        await Promise.all(executionsPromises);
        //add the executions to tradeAnalyzer
        //trading performance metrics
        const totalGrossProfit = tradesAnalyzer.getTotalGrossProfit();
        const totalGrossLoss = tradesAnalyzer.getTotalGrossLoss();
        const totalReturn = tradesAnalyzer.getTotalReturn();
        const averageReturn = tradesAnalyzer.getAverageReturn();
        const largestWin = tradesAnalyzer.getLargestWin();
        const largestLoss = tradesAnalyzer.getLargestLoss();
        const totalTradeQuantity = tradesAnalyzer.getTotalTradeQuantity();
        const winningPercentage = tradesAnalyzer.getWinningPercentage();
        const losingPercentage = tradesAnalyzer.getLosingPercentage();
        const totalWinningTrades = tradesAnalyzer.getWinningTrades().length;
        const totalLosingTrades = tradesAnalyzer.getLosingTrades().length;
        const totalBreakevenTrades = tradesAnalyzer.getBreakevenTrades().length;
        const profitFactor = tradesAnalyzer.getProfitFactor();
        const profitsPerDay = tradesAnalyzer.getProfitsPerDay();
        const accumulatedProfitsPerDay =
            tradesAnalyzer.getAccumulatedProfitsPerDay();
        const averageWin = tradesAnalyzer.getAverageWin();
        const averageLoss = tradesAnalyzer.getAverageLoss();
        const completeTradesInfo = tradesAnalyzer.getCompleteTradesInfo();

        res.status(200).json({
            tradingPerformanceMetrics: {
                totalGrossProfit,
                totalGrossLoss,
                totalReturn,
                averageReturn,
                largestWin,
                largestLoss,
                totalTradeQuantity,
                winningPercentage,
                losingPercentage,
                totalWinningTrades,
                totalLosingTrades,
                totalBreakevenTrades,
                profitFactor,
                profitsPerDay,
                accumulatedProfitsPerDay,
                averageWin,
                averageLoss,
                completeTradesInfo,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// get trade by id
tradeRouter.get("/:id", async (req, res) => {
    //code to pull trade matching id from database and return it
    try {
        const trade = await Trade.findByPk(req.params.id);
        const newTradeAnalyzer = new TradeAnalyzer();
        newTradeAnalyzer.addTrade(trade);

        await newTradeAnalyzer.addExecutionsByTradeId(trade.id);

        const totalSharesTraded = newTradeAnalyzer.getTotalVolumePerTrade(
            trade.id
        );
        const tradeExecutions = newTradeAnalyzer.getExecutionsByTradeId(
            trade.id
        );

        res.status(200).json({ trade, totalSharesTraded, tradeExecutions });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// create new trade
tradeRouter.post("/", (req, res) => {
    //code to create new trade in database
});

// import trades and add to database
tradeRouter.post("/import", upload.array("fileUploads"), async (req, res) => {
    try {
        //create an array of promises for each of the path
        const filesPromises = req.files.map((file) =>
            fs.readFile(file.path, "utf8")
        );
        const results = await Promise.all(filesPromises);
        // iterate through each of the results
        for (const result of results) {
            const parsedData = Papa.parse(result, {
                header: true,
                skipEmptyLines: true,
            });
            const processedTrades = addTradesToTracker(parsedData.data);
            await insertTrades(processedTrades, req.user.id);
        }

        res.status(201).json({ status: "success" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error processing files",
        });
    }
});

// update trade by id
tradeRouter.put("/:id", (req, res) => {
    //code to update trade matching id in database
});

// delete trade by id
tradeRouter.delete("/:id", (req, res) => {
    //code to delete trade matching id from database
});

module.exports = tradeRouter;
