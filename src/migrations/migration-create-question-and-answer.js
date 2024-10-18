'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_and_answer', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      numberQuestion: {
        type: Sequelize.INTEGER
      },

      // questionText: DataTypes.STRING,
      questionText: {
        type: Sequelize.STRING
      },
      // answerA: DataTypes.STRING,
      answerA: {
        type: Sequelize.STRING
      },
      // answerB: DataTypes.STRING,
      answerB: {
        type: Sequelize.STRING
      },
      // answerC: DataTypes.STRING,
      answerC: {
        type: Sequelize.STRING
      },
      // answerD: DataTypes.STRING,
      answerD: {
        type: Sequelize.STRING
      },
      // correctAnswer: DataTypes.STRING,
      correctAnswer: {
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
    await queryInterface.dropTable('question_and_answer');
  }
};