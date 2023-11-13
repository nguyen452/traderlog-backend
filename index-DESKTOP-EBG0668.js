require('dotenv').config();
const express = require('express')
const tradeRouter = require('./routes/tradesRoute.js')
const cors = require('cors');
const { sequelize } = require('./db/models/index.js');
const app = express()
const port = process.env.PORT || 4000;
const passport = require('./strategies/localStrategy.js');
const authRouter = require('./routes/authRoutes.js')

const corsOptions = {
    origin: 'http://localhost:3000', // or true if you want to allow all origins
    credentials: true,
    // ... other options
};

app.use(cors(corsOptions));

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize())
app.use('/api/trades', tradeRouter);
app.use('/auth', authRouter);

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
