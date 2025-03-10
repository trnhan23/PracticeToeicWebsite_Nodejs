'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reading_And_Listening extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reading_And_Listening.hasMany(models.RL_And_QA, { foreignKey: 'readAndListenId', as: 'RLQA_ReadAndListenData' });
    }
  }
  Reading_And_Listening.init({
    audioFile: DataTypes.STRING,
    images: DataTypes.STRING,
    text: DataTypes.TEXT,
    questionType: DataTypes.STRING,
    examId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Reading_And_Listening',
    tableName: 'reading_and_listening',
  });
  return Reading_And_Listening;
};

