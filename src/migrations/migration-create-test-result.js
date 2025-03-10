'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('test_result', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // questionId: DataTypes.INTEGER,
      questionId: {
        type: Sequelize.INTEGER
      },
      // testId: DataTypes.INTEGER,
      testId: {
        type: Sequelize.INTEGER
      },
      // answer: DataTypes.STRING,
      answer: {
        type: Sequelize.STRING
      },
      // stateAnswer: DataTypes.STRING,
      stateAnswer: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('test_result');
  }
};