require('dotenv').config();
const express = require('express')
const tradeRouter = require('./routes/tradesRoute.js')
const cors = require('cors');
const { sequelize } = require('./db/models/index.js');
const app = express()
const port = process.env.PORT || 4000;
const passport = require('./strategies/localStrategy.js');
const authRouter = require('./routes/authRoutes.js')
const cookie = require('cookie-parser');


//middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize())
app.use('/api/trades', tradeRouter);
app.use('/auth', authRouter);
app.use(cookie());

const connectToDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('connected to the database');
    } catch (error) {
        console.log('error connecting to the database', error);
    }
};

connectToDb();

app.listen(port, () => {
    console.log('server is running on port 4000')
});
