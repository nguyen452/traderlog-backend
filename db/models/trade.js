'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Trade.belongsTo(models.User, {foreignKey: 'user_id'});
      Trade.hasMany(models.Execution, {foreignKey: 'trade_id'});
      Trade.hasOne(models.Fee, {foreignKey: 'trade_id'});
    }
  }
  Trade.init({
    date_open: {
      type: Sequelize.DATE,
        allowNull: false
    },
    date_close: {
        type: Sequelize.DATE,
        allowNull: false
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profit: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Trade',
    tableName: 'trades'
  });
  return Trade;
};
