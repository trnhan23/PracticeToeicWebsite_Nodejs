'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test_Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Test_Result.belongsTo(models.Test, { foreignKey: 'testId', as: 'TestResult_TestData' });
      Test_Result.belongsTo(models.Question_And_Answer, { foreignKey: 'questionId', as: 'TestResult_QuestionData' });

    }
  }
  Test_Result.init({
    questionId: DataTypes.INTEGER,
    testId: DataTypes.INTEGER,
    answer: DataTypes.STRING,
    stateAnswer: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Test_Result',
    tableName: 'test_result',

  });
  return Test_Result;
};