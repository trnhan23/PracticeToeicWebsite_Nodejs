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
      Flashcard_Vocabulary.belongsTo(models.Flashcard, { foreignKey: 'flashcardId', as: 'FV_FlashcardData' });
      Flashcard_Vocabulary.belongsTo(models.Vocabulary, { foreignKey: 'vocabularyId', as: 'FV_VocabularyData' });
    }
  }
  Flashcard_Vocabulary.init({
    flashcardId: DataTypes.INTEGER,
    vocabularyId: DataTypes.INTEGER,
    isReview: DataTypes.BOOLEAN,
    
  }, {
    sequelize,
    modelName: 'Flashcard_Vocabulary',
    tableName: 'flashcard_vocabulary',
  });
  return Flashcard_Vocabulary;
};