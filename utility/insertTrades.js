//import in table models from sequelize
const { Execution, Trade, Fee } = require('../db/models');
const dateParser = require('./dateParser');

module.exports = async function insertTrades(trades , userId) {
    try {
        for (let trade of trades.completedTrades) {
            console.log(trade);
            const newTrade = await Trade.create({
                symbol: trade.Symbol,
                date_open: dateParser(trade.Executions[0].date), // use dateParser to convert date to YYYY-MM-DD
                date_close: dateParser(trade.Executions[trade.Executions.length - 1].date), // use dateParser to convert date to YYYY-MM-DD
                profit: trade['Gross Proceeds'],
                user_id: userId
            });

            for (let execution of trade.Executions) {

                await Execution.create({
                    date: dateParser(execution.date),
                    trade_id: newTrade.id,
                    symbol: trade.Symbol,
                    side: execution.side,
                    qty: Number(execution.qty),
                    price: Number(execution.price),
                    time: execution.time
                });
            }

            await Fee.create({
                commission: trade.Comm,
                sec: trade.SEC,
                taf: trade.TAF,
                nscc: trade.NSCC,
                nasdaq: trade.Nasdaq,
                ecn_remove: trade[`ECN Remove`],
                ecn_add: trade[`ECN Add`],
                trade_id: newTrade.id
            });
        }
    } catch (error) {
        console.error("Error inserting trades:", error);
        throw error;  // rethrowing so that calling function knows about the error
    }
}
