const { convertToCents, convertToDollars } = require('./moneyCalculation');


class TradeTracker {
    constructor() {
        this.activeTrades = [];
        this.completedTrades = [];
    }

    groupTradeBySymbol = (data) => {
        return data.reduce((acc, trade) => {
            if (!acc[trade.Symbol]) {
                acc[trade.Symbol] = [];
            }
            acc[trade.Symbol].push(trade)
            return acc;
        }, {});
    };

    addTrade(trade) {
        if (true) {
            //check if theres an existing trade with the same symbol
            const existingTrade = this.activeTrades.find((activeTrade) => {
                return activeTrade.Symbol === trade.Symbol
            });
            if (existingTrade) {
                //update the existing trade
                this.updateTrade(existingTrade, trade)
            } else {
                //add a new trade
                this.activeTrades.push({ ...trade, 'Executions': [{side: trade.Side, qty:trade.Qty, price: trade.Price, time: trade['Exec Time'], date: trade['T/D']}]})
            }
        };
    };

    updateTrade(existingTrade, newTrade) {
        // update qty
        let totalQty;
        if (newTrade.Side === 'BC' || newTrade.Side === 'S') {
            //reduce quantity
            totalQty =parseInt(existingTrade.Qty) - parseInt(newTrade.Qty);
        } else {
            //add quantity
            totalQty = parseInt(existingTrade.Qty) + parseInt(newTrade.Qty);
        }
        // update price by finding the average weighted
        let averagePrice;
        if (newTrade.Side === 'BC' || newTrade.Side === 'S') {
            averagePrice = ((convertToCents(existingTrade.Price) * convertToCents(existingTrade.Qty)) - (convertToCents(newTrade.Price) * convertToCents(newTrade.Qty))) / (convertToCents(existingTrade.Qty) - convertToCents(newTrade.Qty));
            averagePrice = convertToDollars(averagePrice);
        } else {
            averagePrice = ((convertToCents(existingTrade.Price) * convertToCents(existingTrade.Qty)) + (convertToCents(newTrade.Price) * convertToCents(newTrade.Qty))) / (convertToCents(existingTrade.Qty) + convertToCents(newTrade.Qty));
            averagePrice = convertToDollars(averagePrice);
        }

        // update fees
       const fees = ['Comm', 'SEC', 'TAF', 'NSCC', 'Nasdaq', 'ECN Remove', 'ECN Add'];

       for (const fee of fees) {
              existingTrade[fee] = convertToCents(existingTrade[fee]) + convertToCents(newTrade[fee]);
              existingTrade[fee] = convertToDollars(existingTrade[fee]);
       }
       // update proceeds
       const proceeds = ['Gross Proceeds', 'Net Proceeds'];

            for (const proceed of proceeds) {
                existingTrade[proceed] = convertToCents(existingTrade[proceed]) + convertToCents(newTrade[proceed]);
                existingTrade[proceed] = convertToDollars(existingTrade[proceed]);
            };


       // update existing trade
        existingTrade.Qty = totalQty;
        existingTrade.Price = averagePrice;
        existingTrade['Executions'] = [...existingTrade['Executions'], {side: newTrade.Side, qty:newTrade.Qty, price: newTrade.Price, time: newTrade['Exec Time'], date: newTrade['T/D']}];

        // check if trade is complete
        if (totalQty === 0) {
            this.completedTrades.push(existingTrade);
            this.activeTrades = this.activeTrades.filter((activeTrade) => activeTrade.Qty !== 0);
        };
    };


};

function addTradesToTracker(trades) {
    const tradeTracker = new TradeTracker();
    for (const trade of trades) {
        tradeTracker.addTrade(trade);
    };
    return tradeTracker;
}


module.exports = { TradeTracker, addTradesToTracker };
