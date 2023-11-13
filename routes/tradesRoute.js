const express = require('express');
const tradeRouter = express.Router();
const{ addTradesToTracker } = require('../utility/tradeCalculation');
const insertTrades = require('../utility/insertTrades');
const { Trade } = require('../db/models')
const getAllModelDataByUserId = require('../utility/getAllModelDataByUserId')


const multer = require('multer');
const fs = require('fs').promises;
const Papa = require('papaparse');
const upload = multer( { dest: './db/uploads'})
const passport = require('../strategies/jwtStrategy');
const TradeAnalyzer = require('../utility/tradeAnalyzer');

tradeRouter.use(passport.authenticate('jwt', {session: false}));

// tradeRouter.use((req, res, next) => {
//     console.log(req.user)
//     let userId = req.user.user_id;
//     let userIdParams = req.params.userId;

//     if (userId === userIdParams) {
//         next()
//     } else {
//         res.status(401).json({message:'unauthorized access'})
//     }
// })


// get all trade
tradeRouter.get('/tradeMetrics', async (req, res) => {
    // pull all trades from database
    const tradeData = await getAllModelDataByUserId(Trade, req.user.id)

    const tradesAnalyzer = new TradeAnalyzer;
    // add trades to tradeAnalyzer

    tradeData.forEach((trade) => {
        tradesAnalyzer.addTrade(trade)
    });
    const totalGrossProfit = tradesAnalyzer.getTotalGrossProfit()


    // create instance of trade analyzer
    // add all trades to trade analyzer
    // call the functions to get the trading metrics
    res.json({message: 'this message', totalGrossProfit: totalGrossProfit})
    //code to pull all trades matching user id from database and return them
});

// get trade by id
tradeRouter.get('/:id', (req, res) => {
    //code to pull trade matching id from database and return it
});

// create new trade
tradeRouter.post('/', (req, res) => {
    //code to create new trade in database
});

// import trades and add to database
tradeRouter.post('/import', upload.array('fileUploads'), async (req, res) => {
    console.log("import is called")
    try {
        //create an array of promises for each of the path
        const filesPromises = req.files.map(file => fs.readFile(file.path, 'utf8'));
        const results = await Promise.all(filesPromises);
        console.log(results)
        // iterate through each of the results
        for (const result of results) {
            const parsedData = Papa.parse(result, {
                header: true,
                skipEmptyLines: true
            });
            const processedTrades = addTradesToTracker(parsedData.data);
            console.log(processedTrades)
            await insertTrades(processedTrades, req.user.id);
        }

        res.status(201).json({status: 'success'});
    } catch (error) {
        res.status(500).json({status: 'error', message: 'Error processing files'});
    }
});


// update trade by id
tradeRouter.put('/:id', (req,res) => {
    //code to update trade matching id in database
});

// delete trade by id
tradeRouter.delete('/:id', (req, res) => {
    //code to delete trade matching id from database
});


module.exports = tradeRouter;
