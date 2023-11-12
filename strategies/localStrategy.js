const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
// module for database access
const { User } = require("../db/models/index.js");

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        // function to check if username and password match
        async function (username, password, done) {
            try {
                const user = await User.findOne({
                    where: {
                        username: username,
                    },
                });
                if (!user) {
                    return done(null, false, { message: "Invalid credential" });
                } else {
                    const isMatch = await bcrypt.compare(
                        password,
                        user.password // hashed in database
                    );
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: "Invalid credential",
                        });
                    }
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

module.exports = passport;
