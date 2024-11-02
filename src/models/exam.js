'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Exam.belongsTo(models.Category_Exam, { foreignKey: 'categoryExamId', as: 'categoryExamData' });
      Exam.hasMany(models.User_Exam, { foreignKey: 'examId', as: 'userExam_ExamData' });
      Exam.hasMany(models.Test, { foreignKey: 'examId', as: 'Test_ExamData' });

    }
  }
  Exam.init({
    userId: DataTypes.INTEGER,
    categoryExamId: DataTypes.INTEGER,
    titleExam: DataTypes.STRING,
    countUserTest: DataTypes.INTEGER,
    countComment: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Exam',
  });
  return Exam;
};