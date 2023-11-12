const { User } = require('../db/models');

const authenticateUser = async (username, password) => {
    try {
        const username = await User.findOne({
            where: {
                username: username,
                password: password
            }
        })
    } catch (error) {
        throw error
    }
}
