const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { User } = require("../db/models/index.js");

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt"];
    }
    console.log(token)
    return token;

}

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
    issuer: "http://localhost:4000",
    // audience: "www.trader-log.com",
};

passport.use(
    new JwtStrategy(options, async function (jwt_payload, done) {
        try {
            const user = await User.findByPk(jwt_payload.id);

            if (!user) {
                return done(null, false, { message: "Invalid credential" });
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    })
);

module.exports = passport;
