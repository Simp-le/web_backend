'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'New project',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      jsonValue: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: '{}',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project');
  }
};