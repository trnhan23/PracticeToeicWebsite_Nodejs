'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RL_And_QA extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RL_And_QA.belongsTo(models.Reading_And_Listening, { foreignKey: 'readAndListenId', as: 'RLQA_ReadAndListenData' });
      RL_And_QA.belongsTo(models.Question_And_Answer, { foreignKey: 'questionAndAnswerId', as: 'RLQA_QuestionAndAnswerData' });
    }
  }
  RL_And_QA.init({
    readAndListenId: DataTypes.INTEGER,
    questionAndAnswerId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'RL_And_QA',
    tableName: 'rl_and_qa',
  });
  return RL_And_QA;
};