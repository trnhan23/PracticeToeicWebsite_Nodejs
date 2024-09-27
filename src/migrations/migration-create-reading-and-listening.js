'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reading_and_listening', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // audioFile: DataTypes.STRING,
      audioFile: {
        type: Sequelize.STRING
      },
      // images: DataTypes.STRING,
      images: {
        type: Sequelize.STRING
      },
      // text: DataTypes.TEXT,
      text: {
        type: Sequelize.TEXT
      },
      // script: DataTypes.TEXT,
      script: {
        type: Sequelize.TEXT
      },
      // questionType: DataTypes.STRING,
      questionType: {
        type: Sequelize.STRING
      },
      // examId: DataTypes.INTEGER,
      examId: {
        type: Sequelize.INTEGER
      },
      // questionId: DataTypes.INTEGER,
      questionId: {
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
    await queryInterface.dropTable('reading_and_listening');
  }
};