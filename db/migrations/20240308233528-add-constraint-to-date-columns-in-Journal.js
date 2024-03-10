'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Journals", "date", {
       type: Sequelize.DATEONLY,
       allowNull: false,
       unique: true
    })
   },

   async down (queryInterface, Sequelize) {
     await queryInterface.changeColumn("Journals", "date", {
      type: Sequelize.DATEONLY,
      allowNull: false
     })
   }
};
