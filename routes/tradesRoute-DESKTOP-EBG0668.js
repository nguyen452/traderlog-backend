const express = require('express');
const tradeRouter = express.Router();
const{ addTradesToTracker } = require('../utility/tradeCalculation');
const insertTrades = require('../utility/insertTrades');


const multer = require('multer');
const fs = require('fs').promises;
const Papa = require('papaparse');
const upload = multer( { dest: './db/uploads'})


// get all trade
tradeRouter.get('/', (req, res) => {
    console.log('get all trades')
    res.json({message: 'get all trades'})
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
    try {
        //create an array of promises for each of the path
        const filesPromises = req.files.map(file => fs.readFile(file.path, 'utf8'));
        const results = await Promise.all(filesPromises);
        // iterate through each of the results
        for (const result of results) {
            const parsedData = Papa.parse(result, {
                header: true,
                skipEmptyLines: true
            });
            const processedTrades = addTradesToTracker(parsedData.data);
            console.log(processedTrades)
            // await insertTrades(processedTrades);
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
