const roundingNumbers = require('./roundingNumbers')

class TradePerformanceAnalyzer {
    constructor() {
        this.trades = [];
        this.executions = [];
    }

    addTrade(trade) {
        this.trades.push(trade);
    }
    async addExecutionsByTradeId(tradeId) {
       const arrayOfAllTradesId = this.trades.map((trade) => {
            const
        })

        [{tradeId: 2, tradeExecution: []}]
    }

    getTotalGrossProfit() {
        const winningTrades = this.getWinningTrades();
        if (winningTrades.length === 0) {
            return 0;
        }
        const sumOfAllWinningTrades = winningTrades.reduce((accumulator, {profit}) => {

            return accumulator + Number(profit);
        }, 0)
        return roundingNumbers(sumOfAllWinningTrades, 2)
    }

    getTotalGrossLoss() {
        const losingTrades = this.getLosingTrades();
        if (losingTrades.length === 0) {
            return 0;
        }
        const sumOfAllLosingTrades = losingTrades.reduce((acc, {profit}) => {
            return (acc + Number(profit));
        }, 0);
        return roundingNumbers(sumOfAllLosingTrades, 2);
    }

    getTotalReturn() {
        if (this.trades.length === 0) {
            return 0;
        }
        const sumOfAllTrades = this.trades.reduce((acc, {profit}) => {
            return (acc + Number(profit));
        }, 0);
        return roundingNumbers(sumOfAllTrades, 2);
    }

    getAverageReturn() {
        if (this.trades.length === 0) {
            return 0;
        }
        const totalNumberOfTrade = this.trades.length;
        const averageReturn = this.getTotalReturn() / totalNumberOfTrade;
        return roundingNumbers(averageReturn, 2);
    }

    getAverageWin() {
        if (this.trades.length === 0) {
            return 0;
        }
        const totalNumberOfWinningTrades = this.getWinningTrades().length;
        const averageWin = this.getTotalGrossProfit() / totalNumberOfWinningTrades;
        return roundingNumbers(averageWin, 2);
    }

    getAverageLoss() {
       if (this.trades.length === 0) {
           return 0;
       }
       const totalNumberOfLosingTrades = this.getLosingTrades().length;
       const averageLoss = this.getTotalGrossLoss() / totalNumberOfLosingTrades;
         return Math.abs(roundingNumbers(averageLoss, 2));
    }

    getLargestWin() {
        if (this.trades.length === 0) {
            return 0;
        }
        const largestWin = Math.max(...this.trades.map(trade => Number(trade.profit)));
        return largestWin;
    }

    getLargestLoss() {
        if (this.trades.length === 0) {
            return 0;
        }
        const largestLoss = Math.min(...this.trades.map(trade => Number(trade.profit)));
        return largestLoss;
    }

    getTotalTradeQuantity() {
        return this.trades.length;
    }

    getWinningTrades() {
        return this.trades.filter((trade) => { return trade.profit > 0})
    }
    getLosingTrades() {
       return this.trades.filter((trade => trade.profit <0 ))
    }
    getBreakevenTrades() {
       return this.trades.filter((trade => trade.profit === 0 ))
    }

    getWinningPercentage() {
        return roundingNumbers((this.getWinningTrades().length/this.getTotalTradeQuantity() * 100), 2);
    }
    getLosingPercentage() {
        return roundingNumbers((this.getLosingTrades().length/this.getTotalTradeQuantity() * 100), 2);
    }

    getTotalTradesAtTime(time) {
        return this.trades.filter((trade) => trade.time === time);
    };

    getTotalTradeAtPrice(price) {
        return this.trades.filter((trade) => trade.price === price);
    }

    getProfitFactor() {
        return Math.abs(roundingNumbers((this.getTotalGrossProfit() / this.getTotalGrossLoss()), 2));
    }

    getProfitsPerDay() {
        const datesProfits = this.trades.reduce((acc, trade) => {
            if (trade.date_close in acc) {
                acc[trade.date_close] += Number(trade.profit)
            } else {
                acc[trade.date_close ]= Number(trade.profit)
            }
            return acc
        }, {})
        return datesProfits;
    }

    getAccumulatedProfitsPerDay() {
        // get the profits per day
        const profitsPerDay = this.getProfitsPerDay(); // returns an object with the date as the key and the profit as the value
        // use object entry to turn datesProfits into an array of arrays
        let arrayProfitsPerDay = Object.entries(profitsPerDay);
        arrayProfitsPerDay.sort((a, b) => {
            return new Date(a[0]) - new Date(b[0]);
        });
        // reduce through the array of the array
        const dateAccumulatedProfits = []
        const  getAccumulatedProfitsPerDay = arrayProfitsPerDay.reduce((acc, [date, profit]) => {
            // for each element create an object with the date and the accumulated profit
            const dateProfitObject = {
                date: date,
                "Accumulated Profits": roundingNumbers((acc + profit), 2)
            };
            dateAccumulatedProfits.push(dateProfitObject);
            return acc + profit;
        }, 0)
        return dateAccumulatedProfits;
    }
    getAllTradeByDate(date) {
        // get array of all trades
        const allTrades = this.trades;
        // filter by date by the date_close
        const tradesByDate = allTrades.filter((trade) => {
            new Date (trade.date_close).toISOString() === date.toISOString();
        })
        // return array of trades by date
        return tradesByDate;
    }

    //trade execution metrics
    getExecutionsByTradeId(tradeId) {
        // get the arrays of all executions
        const executionsOfAllTrades = this.executions.filter((execution) => execution.trade_id === tradeId); // returns an array of all executions of a trade
        // filter by trade_id
        return executionsOfAllTrades;
    }

    getTotalVolumePerTrade(tradeId) {
        const executionsOfTrade = this.getExecutionsByTradeId(tradeId);
        const totalVolume = executionsOfTrade.reduce((acc, executions) => {
            acc += executions.qty;
            return acc;
        })
        return totalVolume;
    }

    getTradeSide(tradeId) {
        // get array of executions of trade
        const executionsOfTrade = this.getExecutionsByTradeId(tradeId);
        // get the first element of array and return the side
        const side = executionsOfTrade[0].side;
        if (side === 'SS' || side === 'BC') {
            return 'Short';
        } else {
            return 'Long';
        }
    }
}

module.exports = TradePerformanceAnalyzer;
