class TradePerformanceAnalyzer {
    constructor() {
        this.trades = [];
    }

    addTrade(trade) {
        this.trades.push(trade);
    }

    getTotalGrossProfit() {
        const winningTrades = this.getWinningTrades();
        if (winningTrades.length === 0) {
            return 0;
        }
        const sumOfAllWinningTrades = winningTrades.reduce((accumulator, {profit}) => {
            return accumulator + profit;
        }, 0)
        return sumOfAllWinningTrades
    }

    getTotalGrossLoss() {
        const losingTrades = this.getLosingTrades();
        if (losingTrades.length === 0) {
            return 0;
        }
        const sumOfAllLosingTrades = losingTrades.reduce((acc, {profit}) => {
            return (acc + profit);
        }, 0);
    }

    getTotalReturn() {
        if (this.trades.length === 0) {
            return 0;
        }
        const sumOfAllTrades = this.trades.reduce((acc, {profit}) => {
            return (acc + profit);
        }, 0);
        return sumOfAllTrades;
    }

    getAverageReturn() {
        if (this.trades.length === 0) {
            return 0;
        }
        const totalNumberOfTrade = this.trades.length;
        const averageReturn = this.getTotalReturn() / totalNumberOfTrade;
        return averageReturn;
    }

    getLargestWin() {
        if (this.trades.length === 0) {
            return 0;
        }
        const min = Math.min(...this.trades.profit);
        return min;
    }

    getLargestLoss() {
        if (this.trades.length === 0) {
            return 0;
        }
        const min = Math.max(...this.trades.profit);
        return max;
    }

    getTotalTradeQuantity() {
        return this.data.length;
    }

    getWinningTrades() {
        return this.trades.filter((trade) => { return trade.profit > 0})
    };
    getLosingTrades() {
       return this.trades.filter((trade => trade.profit <0 ))
    };;
    getBreakevenTrades() {
       return this.trades.filter((trade => trade.profit === 0 ))
    }

    getTotalTradesAtTime(time) {
        return this.trades.filter((trade) => trade.time === time);
    };

    getTotalTradeAtPrice(price) {
        return this.trades.filter((trade) => trade.price === price);
    }

}
module.exports = TradePerformanceAnalyzer;
