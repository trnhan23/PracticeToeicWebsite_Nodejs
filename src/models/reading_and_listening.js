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
    }
  }
  Reading_And_Listening.init({
    audioFile: DataTypes.STRING,
    images: DataTypes.STRING,
    text: DataTypes.TEXT,
    script: DataTypes.TEXT,
    questionType: DataTypes.STRING,
    examId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Reading_And_Listening',
  });
  return Reading_And_Listening;
};