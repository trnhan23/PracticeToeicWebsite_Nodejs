'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scores', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // correctAnswer: DataTypes.INTEGER,
      correctAnswer: {
        type: Sequelize.INTEGER
      },
      // listenScore: DataTypes.INTEGER,
      listenScore: {
        type: Sequelize.INTEGER
      },
      // readingScore: DataTypes.INTEGER,
      readingScore: {
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
    await queryInterface.dropTable('scores');
  }
};