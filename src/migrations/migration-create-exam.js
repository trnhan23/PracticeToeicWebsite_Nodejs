'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exams', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // userId: DataTypes.INTEGER,
      userId: {
        type: Sequelize.INTEGER
      },
      // categoryExamId: DataTypes.INTEGER,
      categoryExamId: {
        type: Sequelize.INTEGER
      },
      // titleExam: DataTypes.STRING,
      titleExam: {
        type: Sequelize.STRING
      },
      // countUserTest: DataTypes.INTEGER,
      countUserTest: {
        type: Sequelize.INTEGER
      },

      countComment: {
        type: Sequelize.INTEGER
      },

      status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('exams');
  }
};