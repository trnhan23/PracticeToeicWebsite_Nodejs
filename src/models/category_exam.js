'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category_Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category_Exam.init({
    userId: DataTypes.INTEGER,
    titleCategoryExam: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Category_Exam',
  });
  return Category_Exam;
};