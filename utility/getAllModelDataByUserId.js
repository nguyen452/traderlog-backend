
const getAllModelDataByUserId = async (model, userId) => {
    const trades = await model.findAll({
        where: {
            user_id: userId
        }
    });
    return trades;
};

module.exports = getAllModelDataByUserId;
