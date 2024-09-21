'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flashcard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Flashcard.init({
    userId: DataTypes.INTEGER,
    flashcardName: DataTypes.STRING,
    description: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    isResetReview: DataTypes.BOOLEAN,
    countVocabularyViewed: DataTypes.INTEGER,
    countUserViewed: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Flashcard',
  });
  return Flashcard;
};