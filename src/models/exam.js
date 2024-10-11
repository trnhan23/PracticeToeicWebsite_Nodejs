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

    }
  }
  Exam.init({
    userId: DataTypes.INTEGER,
    categoryExamId: DataTypes.INTEGER,
    titleExam: DataTypes.STRING,
    stateExam: DataTypes.BOOLEAN,
    countUserTest: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Exam',
  });
  return Exam;
};