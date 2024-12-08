'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tests', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // examId: DataTypes.INTEGER,
      examId: {
        type: Sequelize.INTEGER
      },
      // userId: DataTypes.INTEGER,
      userId: {
        type: Sequelize.INTEGER
      },
      // correctAnswer: DataTypes.INTEGER,
      correctAnswer: {
        type: Sequelize.INTEGER
      },
      // totalQuestion: DataTypes.INTEGER,
      totalQuestion: {
        type: Sequelize.INTEGER
      },
      // testTime: DataTypes.INTEGER,
      testTime: {
        type: Sequelize.INTEGER
      },
      // testDate: DataTypes.DATE,
      testDate: {
        type: Sequelize.DATE
      },
      // skipAnswer: DataTypes.INTEGER,
      skipAnswer: {
        type: Sequelize.INTEGER
      },
      // countListenAnswer: DataTypes.INTEGER,
      countListenAnswer: {
        type: Sequelize.INTEGER
      },
      // countReadAnswer: DataTypes.INTEGER,
      countReadAnswer: {
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
    await queryInterface.dropTable('tests');
  }
};