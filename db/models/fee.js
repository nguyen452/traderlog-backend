'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Fee.belongsTo(
        models.Trade,
          {foreignKey: 'trade_id' , onDelete: 'CASCADE', onUpdate: 'CASCADE'}
      );
    }
  }
  Fee.init({
    commission: DataTypes.DECIMAL,
    sec: DataTypes.DECIMAL,
    taf: DataTypes.DECIMAL,
    nscc: DataTypes.DECIMAL,
    nasdaq: DataTypes.DECIMAL,
    ecn_remove: DataTypes.DECIMAL,
    ecn_add: DataTypes.DECIMAL,
    trade_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Fee',
    tableName: 'fees'
  });
  return Fee;
};
