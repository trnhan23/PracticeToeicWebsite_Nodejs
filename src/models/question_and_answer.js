'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question_And_Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question_And_Answer.init({
    questionText: DataTypes.STRING,
    answerA: DataTypes.STRING,
    answerB: DataTypes.STRING,
    answerC: DataTypes.STRING,
    answerD: DataTypes.STRING,
    correctAnswer: DataTypes.STRING,
    questionTextScript: DataTypes.STRING,
    answerAScript: DataTypes.STRING,
    answerBScript: DataTypes.STRING,
    answerCScript: DataTypes.STRING,
    answerDScript: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Question_And_Answer',
  });
  return Question_And_Answer;
};