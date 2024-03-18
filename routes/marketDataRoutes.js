const express = require('express');
const marketDataRouter = express.Router();
require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api');
const convertDateToTimeInSecond = require('../utility/convertDateToTimeInSecond');

const alpacaClientKey = process.env.ALPACA_CLIENT_ID;
const alpacaSecretKey = process.env.ALPACA_SECRET_KEY;
const alpaca = new Alpaca({
    keyId: alpacaClientKey,
    secretKey: alpacaSecretKey,
    paper: true,
});
marketDataRouter.get('/', async (req, res) => {
    const symbol = req.query.symbol;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const timeframe = req.query.timeframe.trim();
    const data = [];
    const fetchData = async () => {

        const bars = await alpaca.getBarsV2(
            symbol,
            {
                start: startDate,
                end: endDate,
                timeframe: timeframe,
                limit: 1000,
            },
        )
        for await (let bar of bars) {
            const barData = {open: bar.OpenPrice, high: bar.HighPrice, low: bar.LowPrice, close: bar.ClosePrice, volume: bar.Volume, time: convertDateToTimeInSecond(bar.Timestamp)};
            data.push(barData);
        }
    }
    await fetchData();
    res.status(200).json(data);
});

module.exports = marketDataRouter;
