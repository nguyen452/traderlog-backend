class TradePerformanceAnalyzer {
    constructor() {
        this.trades = [];
    }

    addTrade(trade) {
        this.data.push(data);
    }

    getTotalGrossProfit() {
        const winningTrades = this.getWinningTrades();
        if (winningTrades.length === 0) {
            return 0;
        }
        const sumOfAllWinningTrades = winningTrades.reduce((acc, trade) => {
            return (acc += trade);
        });
    }

    getTotalGrossLoss() {
        const losingTrades = this.getLosingTrades();
        if (losingTrades.length === 0) {
            return 0;
        }
        const sumOfAllLosingTrades = losingTrades.reduce((acc, trade) => {
            return (acc += trade);
        });
    }

    getTotalReturn() {
        if (this.trades.length === 0) {
            return 0;
        }
        const sumOfAllTrades = this.trades.reduce((acc, trade) => {
            return (acc += trade);
        });
        return sumOfAllTrades;
    }

    getAverageReturn() {
        if (this.trades.length === 0) {
            return 0;
        }
        const totalNumberOfTrade = this.trades.length + 1;
        const averageReturn = this.getTotalReturn() / totalNumberOfTrade;
        return averageReturn;
    }

    getLargestWin() {
        if (this.trades.length === 0) {
            return 0;
        }
        const min = Math.min(...this.trades);
        return min;
    }

    getLargestLoss() {
        if (this.trades.length === 0) {
            return 0;
        }
        const min = Math.max(...this.trades);
        return max;
    }

    getTotalTradeQuantity() {
        return this.data.length;
    }

    getWinningTrades() {
        return this.trades.filter((trade) => trade > 0)
    };
    getLosingTrades() {
       return this.trades.filter((trade => trade <0 ))
    };;
    getBreakevenTrades() {
       return this.trades.filter((trade => trade === 0 ))
    }

    getTotalTradesAtTime(time) {
        return this.trades.filter((trade) => trade.time === time);
    };

    getTotalTradeAtPrice(price) {
        return this.trades.filter((trade) => trade.price === price);
    }

}
module.exports = TradePerformanceAnalyzer;
