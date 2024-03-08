"use strict";
const { Model} = require("sequelize");
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {npx
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Journal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      has_trade: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      entry: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Journal",
    }
  );
  return Journal;
};
