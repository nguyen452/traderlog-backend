'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      commission: {
        type: Sequelize.DECIMAL
      },
      sec: {
        type: Sequelize.DECIMAL
      },
      taf: {
        type: Sequelize.DECIMAL
      },
      nscc: {
        type: Sequelize.DECIMAL
      },
      nasdaq: {
        type: Sequelize.DECIMAL
      },
      ecn_remove: {
        type: Sequelize.DECIMAL
      },
      ecn_add: {
        type: Sequelize.DECIMAL
      },
      trade_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fees');
  }
};
