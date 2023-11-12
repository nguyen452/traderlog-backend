const { User } = require('../db/models');
const bcrypt = require('bcrypt');



module.exports = async function insertUser({username, password, firstName, lastName, email}) {
    //helper function hash password
    const hashPassword = async (password, saltRounds) => {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            console.log(error)
        }
        return null;
    };
    // insert user into database
    try {
        const hashedPassword = await hashPassword(password, 10);
        if(!hashPassword) throw new Error("Error hashing password");

        const newUser = await User.create({
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashedPassword
        })
        return newUser;
    } catch (error) {
        console.error("Error inserting user:", error);
    }
        return null;
};
