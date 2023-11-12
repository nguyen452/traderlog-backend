'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //add the user_id foreign key to trades table
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('trades', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'trades-foreign-key',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    // add the table_id foreign key to executions table

    await queryInterface.addConstraint('executions', {
      fields: ['trade_id'],
      type: 'foreign key',
      name: 'execution-foreign-key',
      references: {
        table: 'trades',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    //add the trade_id foreign key to fees table

    await queryInterface.addConstraint('fees', {
      fields: ['trade_id'],
      type: 'foreign key',
      name: 'fees-foreign-key',
      references: {
        table: 'trades',
        field: 'id'
      },
      onDelete:  'cascade',
      onUpdate: 'cascade'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('fees', 'fees-foreign-key');
    await queryInterface.removeConstraint('executions', 'execution-foreign-key');
    await queryInterface.removeConstraint('trades', 'trades-foreign-key');

  }

};
