'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init({
    userId: DataTypes.INTEGER,
    categoryBlogId: DataTypes.INTEGER,
    titleBlog: DataTypes.STRING,
    contentBlog: DataTypes.TEXT,
    imageBlog: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
    stateBlog: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};