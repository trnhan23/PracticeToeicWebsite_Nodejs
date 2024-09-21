'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {

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
      // parentCmtId: DataTypes.INTEGER,
      parentCmtId: {
        type: Sequelize.INTEGER
      },
      // contentComment: DataTypes.STRING,
      contentComment: {
        type: Sequelize.STRING
      },
      // cmtDate: DataTypes.DATE,
      cmtDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('comments');
  }
};