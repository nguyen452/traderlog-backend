'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'demo1',
        email: 'demo1@gmail.com',
        password: 'demo1'
      },
      {
        username: 'demo2',
        email: 'demo2@gmail.com',
        password: 'demo2'
      }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});

  }
};
