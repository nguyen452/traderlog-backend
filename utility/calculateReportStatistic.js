
const roundingNumbers = require('./roundingNumbers');

const calculateReportStatistic = (tradesAnalyzer) => {
    const totalGrossProfit = tradesAnalyzer.getTotalGrossProfit();
    const averageDailyPnL = tradesAnalyzer.getAverageDailyPnl();
    const averageDailyVolume = tradesAnalyzer.getAverageDailyVolume();
    const averagePerSharePnL = tradesAnalyzer.trades.length === 0 ? 0 : roundingNumbers(
        tradesAnalyzer.getTotalGrossProfit() /
            tradesAnalyzer.getTotalVolumeTraded(),
        2
    );
    const averageWinningTrade = tradesAnalyzer.getAverageWin();
    const averageLosingTrade = tradesAnalyzer.getAverageLoss();
    const totalNumberOfTrades = tradesAnalyzer.trades.length;
    const totalWinningTrades = tradesAnalyzer.getWinningTrades().length;
    const totalLosingTrades = tradesAnalyzer.getLosingTrades().length;
    const maxConsecutiveWins = tradesAnalyzer.getMaxConsecutiveWins();
    const maxConsecutiveLosses = tradesAnalyzer.getMaxConsecutiveLosses();
    return {
        totalGrossProfit,
        averageDailyPnL,
        averageDailyVolume,
        averagePerSharePnL,
        averageWinningTrade,
        averageLosingTrade,
        totalNumberOfTrades,
        totalWinningTrades,
        totalLosingTrades,
        maxConsecutiveWins,
        maxConsecutiveLosses,
    };
}

module.exports = calculateReportStatistic;
