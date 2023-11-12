const express = require('express');
const tradeRouter = express.Router();
const{ addTradesToTracker } = require('../utility/tradeCalculation');
const insertTrades = require('../utility/insertTrades');


const multer = require('multer');
const fs = require('fs');
const Papa = require('papaparse');
const upload = multer( { dest: './db/uploads'})


// get all trade
tradeRouter.get('/total-return', (req, res) => {

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
tradeRouter.post('/import', upload.single('fileUpload'), (req, res) => {
    fs.readFile(req.file.path, 'utf8', async (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const results = Papa.parse(data, {
                header: true,
                skipEmptyLines: true
            })
            // take raw data and convert them to trades in an array
            const processedTrades = addTradesToTracker(results.data);

            await insertTrades(processedTrades);
            //delete file from uploads folder

            //send response to client
            res.json({status: 'success'})
        }
    })
})

// update trade by id
tradeRouter.put('/:id', (req,res) => {
    //code to update trade matching id in database
});

// delete trade by id
tradeRouter.delete('/:id', (req, res) => {
    //code to delete trade matching id from database
});


module.exports = tradeRouter;
