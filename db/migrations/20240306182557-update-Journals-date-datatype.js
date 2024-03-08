'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.changeColumn("Journals", "date", {
      type: Sequelize.DATEONLY,
      allowNull: false
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Journals", "date", {
      type: Sequelize.DATE,
      allowNull: false
    })
  }
};
