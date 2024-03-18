const roundingNumbers = require("./roundingNumbers");
const { convertToCents, convertToDollars } = require("./moneyCalculation");
const { Execution } = require("../db/models");
const convertTimeToSeconds = require("./convertTimetoSecond");

class TradePerformanceAnalyzer {
    constructor() {
        this.trades = [];
        this.executions = {};
    }

    addTrade(trade) {
        this.trades.push(trade);
    }

    getTotalGrossProfit() {
        const winningTrades = this.getWinningTrades();
        if (winningTrades.length === 0) {
            return 0;
        }
        const sumOfAllWinningTrades = winningTrades.reduce(
            (accumulator, { profit }) => {
                return accumulator + Number(profit);
            },
            0
        );
        return roundingNumbers(sumOfAllWinningTrades, 2);
    }

    getTotalGrossLoss() {
        const losingTrades = this.getLosingTrades();
        if (losingTrades.length === 0) {
            return 0;
        }
        const sumOfAllLosingTrades = losingTrades.reduce((acc, { profit }) => {
            return acc + Number(profit);
        }, 0);
        return roundingNumbers(sumOfAllLosingTrades, 2);
    }

    getTotalReturn() {
        if (this.trades.length === 0) {
            return 0;
        }
        const sumOfAllTrades = this.trades.reduce((acc, { profit }) => {
            return acc + Number(profit);
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
        const averageWin =
            this.getTotalGrossProfit() / totalNumberOfWinningTrades;
        return roundingNumbers(averageWin, 2);
    }

    getAverageLoss() {
        if (this.trades.length === 0) {
            return 0;
        }
        const totalNumberOfLosingTrades = this.getLosingTrades().length;
        const averageLoss =
            this.getTotalGrossLoss() / totalNumberOfLosingTrades;
        return Math.abs(roundingNumbers(averageLoss, 2));
    }

    getLargestWin() {
        if (this.trades.length === 0) {
            return 0;
        }
        const largestWin = Math.max(
            ...this.trades.map((trade) => Number(trade.profit))
        );
        return largestWin;
    }

    getLargestLoss() {
        if (this.trades.length === 0) {
            return 0;
        }
        const largestLoss = Math.min(
            ...this.trades.map((trade) => Number(trade.profit))
        );
        return largestLoss;
    }

    getTotalTradeQuantity() {
        return this.trades.length;
    }

    getWinningTrades() {
        return this.trades.filter((trade) => {
            return trade.profit > 0;
        });
    }
    getLosingTrades() {
        return this.trades.filter((trade) => trade.profit < 0);
    }
    getBreakevenTrades() {
        return this.trades.filter((trade) => trade.profit === 0);
    }

    getWinningPercentage() {
        return roundingNumbers(
            (this.getWinningTrades().length / this.getTotalTradeQuantity()) *
                100,
            2
        );
    }
    getLosingPercentage() {
        return roundingNumbers(
            (this.getLosingTrades().length / this.getTotalTradeQuantity()) *
                100,
            2
        );
    }

    getTotalTradesAtTime(time) {
        return this.trades.filter((trade) => trade.time === time);
    }

    getTotalTradeAtPrice(price) {
        return this.trades.filter((trade) => trade.price === price);
    }

    getProfitFactor() {
        return Math.abs(
            roundingNumbers(
                this.getTotalGrossProfit() / this.getTotalGrossLoss(),
                2
            )
        );
    }
    getAllYears() {
        // get the array of all trades
        const allTrades = this.trades;
        // filter the date_close to get the unique years
        const uniqueYear = allTrades.reduce((acc,trade) => {
            const year = trade.date_close.splice(0,4);
            if (!acc.includes(year)) {
                acc.push(year);
            }
            return acc;
        }, [])
        return uniqueYear;

    }
    getProfitsPerDay() {
        const datesProfits = this.trades.reduce((acc, trade) => {
            if (trade.date_close in acc) {
                acc[trade.date_close] += convertToCents(Number(trade.profit));
            } else {
                acc[trade.date_close] = convertToCents(Number(trade.profit));
            }
            return acc;
        }, {});
        const profitsInDollars = {};
        for (const [date, profit] of Object.entries(datesProfits)) {
            profitsInDollars[date] = convertToDollars(profit);
        }
        return profitsInDollars;
    };
    getNumberOfTradesPerDay() {
      // that a list of all trades
      const trades = this.trades;
      return trades.reduce((acc, trade) => {
        if (trade.date_close in acc) {
          acc[trade.date_close] += 1;
        } else {
            acc[trade.date_close] = 1;
        }
        return acc;
      }, {});
    }

    calculateTotalProfit() {
        const totalProfit = this.trades.reduce((acc, trade) => {
            return acc + Number(trade.profit);
        }, 0);
        return roundingNumbers(totalProfit, 2);
    }

    calculateTotalLoss() {
        const totalLoss = this.trades.reduce((acc, trade) => {
            if (trade.profit < 0) {
                return acc + Number(trade.profit);
            }
            return acc;
        }, 0);
        return roundingNumbers(totalLoss, 2);
    }

    calculateNetProfit() {
        const totalProfit = this.calculateTotalProfit();
        const totalLoss = this.calculateTotalLoss();
        return roundingNumbers(totalProfit + totalLoss, 2);
    }

    calculateAverageProfit() {
        const totalProfit = this.calculateTotalProfit();
        const totalTrades = this.trades.length;
        if (totalTrades === 0) {
            return 0;
        }
        return roundingNumbers(totalProfit / totalTrades, 2);
    }

    calculateAverageLoss() {
        const totalLoss = this.calculateTotalLoss();
        const losingTrades = this.getLosingTrades().length;
        if (losingTrades === 0) {
            return 0;
        }
        return roundingNumbers(totalLoss / losingTrades, 2);
    }

    calculateProfitFactor() {
        const totalProfit = this.calculateTotalProfit();
        const totalLoss = this.calculateTotalLoss();
        if (totalLoss === 0) {
            return 0;
        }
        return roundingNumbers(totalProfit / Math.abs(totalLoss), 2);
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
        const dateAccumulatedProfits = [];
        const getAccumulatedProfitsPerDay = arrayProfitsPerDay.reduce(
            (acc, [date, profit]) => {
                // for each element create an object with the date and the accumulated profit
                const dateProfitObject = {
                    date: date,
                    "Accumulated Profits": roundingNumbers(acc + profit, 2),
                };
                dateAccumulatedProfits.push(dateProfitObject);
                return acc + profit;
            },
            0
        );
        return dateAccumulatedProfits;
    }
    getAllTradeByDate(date) {
        // get array of all trades
        const allTrades = this.trades;
        // filter by date by the date_close
        const tradesByDate = allTrades.filter((trade) => {
            new Date(trade.date_close).toISOString() === date.toISOString();
        });
        // return array of trades by date
        return tradesByDate;
    }

    // ***********************************************************trade execution metrics
    async addExecutionsByTradeId(tradeId) {
        const executions = await Execution.findAll({
            where: {
                trade_id: tradeId,
            },
        });
        this.executions[tradeId] = executions;
    }

    getExecutionsByTradeId(tradeId) {
        // get the arrays of all executions of a trade
        const executions = this.executions[tradeId];
        return executions; //return array of executions
    }

    getTotalVolumePerTrade(tradeId) {
        const executionsOfTrade = this.getExecutionsByTradeId(tradeId);
        const totalVolume = executionsOfTrade.reduce((acc, execution) => {
            acc += execution.qty;
            return acc;
        }, 0);
        return totalVolume;
    }

    getTradeSide(tradeId) {
        // get array of executions of trade
        const executionsOfTrade = this.getExecutionsByTradeId(tradeId);
        // get the first element of array and return the side
        const side = executionsOfTrade[0].side;
        if (side === "SS" || side === "BC") {
            return "Short";
        } else {
            return "Long";
        }
    }

    getAverageEntryPrice(tradeId) {
        const tradeExecutions = this.getExecutionsByTradeId(tradeId); // returns array of executions
        // get the trade side
        const tradeSide = this.getTradeSide(tradeId);
        if (tradeSide === "Long") {
            // get all the executions with side = "B"
            const weightedSumOfExecutions = tradeExecutions.reduce(
                (acc, execution) => {
                    if (execution.side === "B") {
                        acc += execution.price * execution.qty;
                    }
                    return acc;
                },
                0
            );
            const totalBuyVolume = tradeExecutions.reduce((acc, execution) => {
                if (execution.side === "B") {
                    acc += execution.qty;
                }
                return acc;
                },
                0

            );
            const averageEntryPrice = weightedSumOfExecutions / totalBuyVolume;
            return roundingNumbers(averageEntryPrice, 2);
        } else {
            const weightedSumOfExecutions = tradeExecutions.reduce(
                (acc, execution) => {
                    if (execution.side === "SS") {
                        acc += execution.price * execution.qty;
                    }
                    return acc;
                },
                0
            );
            const totalSellVolume = tradeExecutions.reduce((acc, execution) => {
                if (execution.side === "SS") {
                    acc += execution.qty;
                }
                return acc;
            }, 0);
            const averageEntryPrice = weightedSumOfExecutions / totalSellVolume;
            return roundingNumbers(averageEntryPrice, 2);
        }
    }

    getAverageExitPrice(tradeId) {
        const tradeExecutions = this.getExecutionsByTradeId(tradeId); // returns array of executions
        // get the trade side
        const tradeSide = this.getTradeSide(tradeId);
        if (tradeSide === "Long") {
            // get all the executions with side = "S"
            const weightedSumOfExecutions = tradeExecutions.reduce(
                (acc, execution) => {
                    if (execution.side === "S") {
                        acc += execution.price * execution.qty;
                    }
                    return acc;
                },
                0
            );
            const totalSellVolume = tradeExecutions.reduce((acc, execution) => {
                if (execution.side === "S") {
                    acc += execution.qty;
                }
                return acc;
            }, 0);
            const averageExitPrice = weightedSumOfExecutions / totalSellVolume;
            return roundingNumbers(averageExitPrice, 2);
        } else {
            const weightedSumOfExecutions = tradeExecutions.reduce(
                (acc, execution) => {
                    if (execution.side === "BC") {
                        acc += execution.price * execution.qty;
                    }
                    return acc;
                },
                0
            );
            const totalBuyVolume = tradeExecutions.reduce((acc, execution) => {
                if (execution.side === "BC") {
                    acc += execution.qty;
                }
                return acc;
            }, 0);
            const averageExitPrice = weightedSumOfExecutions / totalBuyVolume;
            return roundingNumbers(averageExitPrice, 2);
        }
    }

    getDuration(tradeId) {
        // is this a day trade or swing trade
        // get the date_open and date_close
        const date_open = this.trades.find(
            (trade) => trade.id === tradeId
        ).date_open;
        const date_close = this.trades.find(
            (trade) => trade.id === tradeId
        ).date_close;
        const executions = this.getExecutionsByTradeId(tradeId);
        if (date_open === date_close) {
            // day trade
            // get the time_open and time_close
            executions.sort((a, b) => {
                return a.time - b.time;
            });

            const time_openInSec = convertTimeToSeconds(executions[0].time);

            const time_closeInSec = convertTimeToSeconds(
                executions[executions.length - 1].time
            );

            const duration = time_closeInSec - time_openInSec;

            if (duration < 60) {
                return "Less than 1 min";
            } else if (duration < 3600) {
                return `${Math.floor(duration / 60)} min`;
            } else {
                return `${Math.floor(duration / 3600)} hr ${Math.floor(
                    (duration % 3600) / 60
                )} min`;
            }
        } else {
            // swing trade
            const day =
                (new Date(date_close) - new Date(date_open)) /
                1000 /
                60 /
                60 /
                24;
            return `${day} days`;
        }
    }

    getTime_closed(tradeId) {
        const executions = this.getExecutionsByTradeId(tradeId);
        executions.sort((a, b) => {
            return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
        });
        return executions[0].time;
    }

    //combinations of trade data plus executions
    getCompleteTradesInfo() {
        // get array of all trades
        const allTrades = this.trades;
        // iterate through each trade
        const allTradesInfo = allTrades.map((trade) => {
            // call functions to get executions #, side, total volume
            const executions_number = this.getExecutionsByTradeId(
                trade.id
            ).length;
            const side = this.getTradeSide(trade.id);
            const total_volume = this.getTotalVolumePerTrade(trade.id);
            const trade_Id = trade.id;
            const date_open = trade.date_open;
            const date_close = trade.date_close;
            const symbol = trade.symbol;
            const entry_price = this.getAverageEntryPrice(trade.id);
            const exit_price = this.getAverageExitPrice(trade.id);
            const duration = this.getDuration(trade.id);
            const profit = trade.profit;
            const time_closed = this.getTime_closed(trade.id);

            // const fees = trade.fees;
            return {
                trade_Id,
                date_open,
                date_close,
                symbol,
                duration,
                entry_price,
                exit_price,
                "P&L": profit,
                executions_number,
                side,
                total_volume,
                time_closed
            };
        });
        return allTradesInfo;
        // get info like tradeId, side, symbol, qty, date, profit, volume, executions store in an array of objects
    }
}

module.exports = TradePerformanceAnalyzer;
