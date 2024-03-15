const express = require('express');
const calendarRouter = express.Router();
//import db models
const { Trade } = require('../db/models');
const { sequelize } = require("../db/models/index.js");

const { QueryTypes, Op } = require('sequelize');
//module for authentication
const passport = require('passport');
//import utility functions
const TradePerformanceAnalyzer = require('../utility/tradeAnalyzer.js');

//middleware
calendarRouter.use(passport.authenticate('jwt', { session: false }));

calendarRouter.get('/year', async (req, res) => {
    // get the dates from the trade table
    const tradesDates = await sequelize.query(`SELECT DISTINCT date_close FROM trades WHERE user_id = ${req.user.id} ORDER BY date_close DESC`, { type: QueryTypes.SELECT });
    // get the unique year
    const years = tradesDates.reduce((acc, date) => {
        const year = date.date_close.slice(0, 4);
        if (!acc.includes(year)) {
            acc.push(year);
        }
        return acc;
    }, [])
    res.status(200).json(years);
});

calendarRouter.get('/tradesData', async (req, res) => {
    try {
        let { month , year } = req.query;
        if (month.length === 1) {
            month = `0${Number(month) + 1}`;
        }

        const trades = await Trade.findAll({
            where: {
                user_id: req.user.id,
                date_close: {
                    [Op.gte]: `${year}-${month}-01`,
                    [Op.lt]: `${year}-${Number(month) + 1 }-01`
                }
            }
        })
        const newTradeAnalyzer = new TradePerformanceAnalyzer();
        trades.forEach(trade => {
            newTradeAnalyzer.addTrade(trade);
        })
        const profitsPerDay = newTradeAnalyzer.getProfitsPerDay();
        const getNumberOfTradesPerDay = newTradeAnalyzer.getNumberOfTradesPerDay();
        console.log(getNumberOfTradesPerDay);
        const tradeData = {
            profitsPerDay,
            getNumberOfTradesPerDay
        }

        res.status(200).json(tradeData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching trade data.' });
    }
});
module.exports = calendarRouter;
