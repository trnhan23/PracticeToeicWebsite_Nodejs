'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Test.hasMany(models.Test_Result, { foreignKey: 'testId', as: 'TestResult_TestData' });
      Test.belongsTo(models.Exam, { foreignKey: 'examId', as: 'Test_ExamData' });
      Test.belongsTo(models.User, { foreignKey: 'userId', as: 'Test_UserData' });

    }
  }
  Test.init({
    examId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    correctAnswer: DataTypes.INTEGER,
    skipAnswer: DataTypes.INTEGER,
    countListenAnswer: DataTypes.INTEGER,
    countReadAnswer: DataTypes.INTEGER,
    totalQuestion: DataTypes.INTEGER,
    testTime: DataTypes.INTEGER,
    testDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Test',
  });
  return Test;
};