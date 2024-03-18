const express = require('express');
const marketDataRouter = express.Router();
require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api');

const alpacaClientKey = process.env.ALPACA_CLIENT_ID;
const alpacaSecretKey = process.env.ALPACA_SECRET_KEY;
console.log(alpacaClientKey, alpacaSecretKey);
const alpaca = new Alpaca({
    keyId: alpacaClientKey,
    secretKey: alpacaSecretKey,
    paper: true,
});
marketDataRouter.get('/alpaca', async (req, res) => {
    const data = [];
    const fetchData = async () => {

        const bars = await alpaca.getBarsV2(
            'AAPL',
            {
                start: '2024-03-14',
                end: '2024-03-15',
                timeframe: '5min',
                limit: 100,
            },
        )
        for await (let bar of bars) {
            console.log(bar)
            data.push(bar)
        }
        return data;
    }
    await fetchData();
    res.status(200).json(data);
});

module.exports = marketDataRouter;
