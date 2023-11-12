'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(
        models.Trade,
          {foreignKey: 'user_id' , onDelete: 'CASCADE', onUpdate: 'CASCADE'}
      );

    }
  }
  User.init({
    username: {
      type:DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    first_name: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type:DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type:DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};
