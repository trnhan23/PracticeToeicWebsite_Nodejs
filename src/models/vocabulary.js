'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vocabulary extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Vocabulary.hasMany(models.Flashcard_Vocabulary, { foreignKey: 'vocabularyId', as: 'FV_VocabularyData' })
        }
    }
    Vocabulary.init({
        word: DataTypes.STRING,
        definition: DataTypes.STRING,
        partOfSpeech: DataTypes.STRING,
        exampleSentence: DataTypes.STRING,
        pronunciation: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Vocabulary',
        tableName: 'vocabularies',
    });
    return Vocabulary;
};