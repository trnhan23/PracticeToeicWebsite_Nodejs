'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {

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
      // categoryBlogId: DataTypes.INTEGER,
      categoryBlogId: {
        type: Sequelize.INTEGER
      },
      // titleBlog: DataTypes.STRING,
      titleBlog: {
        type: Sequelize.STRING
      },
      // contentBlog: DataTypes.TEXT,
      contentBlog: {
        type: Sequelize.TEXT
      },
      // imageBlog: DataTypes.STRING,
      imageBlog: {
        type: Sequelize.STRING
      },
      // publishedAt: DataTypes.DATE,
      publishedAt: {
        type: Sequelize.DATE
      },
      // stateBlog: DataTypes.BOOLEAN,
      stateBlog: {
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
    await queryInterface.dropTable('blogs');
  }
};