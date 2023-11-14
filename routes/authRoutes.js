const express = require("express");
const authRouter = express.Router();
//module for authentication
const passport = require("../strategies/localStrategy.js");
//module for inserting user into database
const insertUser = require("../utility/insertUser.js");

const jwt = require("jsonwebtoken");
// route to authenticate user
authRouter.post("/login", (req, res) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = {
            id: user.id,
            username: user.username
        }
        console.log(payload)
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
            issuer:"http://localhost:4000",
            // audience:"www.trader-log.com"
        });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,  // Ensure this is set to false if not on HTTPS
            sameSite:'Lax',
            path:"/",
            maxAge: 3600000
        });

        return res.status(200).json({ message: 'User is authenticated.', userId:user.id });
    })(req, res);
});


authRouter.post("/sign-up", async (req, res) => {
    //function to insert into the database

    try {
        const newUser = await insertUser(req.body);
        if (newUser) {
            res.status(201).json(newUser);
        } else {
            res.status(400).json({ message: "Error inserting user" });
        }

    } catch (error) {
        res.status(500).json({message:"Server error while inserting user", error: error.message})
    }
});

module.exports = authRouter;
