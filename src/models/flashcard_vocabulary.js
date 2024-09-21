'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flashcard_Vocabulary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Flashcard_Vocabulary.init({
    flashcardId: DataTypes.INTEGER,
    vocabularyId: DataTypes.INTEGER,
    isReview: DataTypes.BOOLEAN,
    
  }, {
    sequelize,
    modelName: 'Flashcard_Vocabulary',
  });
  return Flashcard_Vocabulary;
};