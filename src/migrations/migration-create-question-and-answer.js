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
      // questionTextScript: DataTypes.STRING,
      questionTextScript: {
        type: Sequelize.STRING
      },
      // answerAScript: DataTypes.STRING,
      answerAScript: {
        type: Sequelize.STRING
      },
      // answerBScript: DataTypes.STRING,
      answerBScript: {
        type: Sequelize.STRING
      },
      // answerCScript: DataTypes.STRING,
      answerCScript: {
        type: Sequelize.STRING
      },
      // answerDScript: DataTypes.STRING,
      answerDScript: {
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