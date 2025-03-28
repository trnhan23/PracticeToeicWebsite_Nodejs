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

      Category_Exam.hasMany(models.Exam, { foreignKey: 'categoryExamId', as: 'categoryExamData' })

    }
  }
  Category_Exam.init({
    userId: DataTypes.INTEGER,
    titleCategoryExam: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Category_Exam',
    tableName: 'category_exam',
  });
  return Category_Exam;
};