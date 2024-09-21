'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('flashcards', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            // userId: DataTypes.INTEGER,
            userId: {
                type: Sequelize.INTEGER
            },
            // flashcardName: DataTypes.STRING,
            flashcardName: {
                type: Sequelize.STRING
            },
            // description: DataTypes.STRING,
            description: {
                type: Sequelize.STRING
            },
            // amount: DataTypes.INTEGER,
            amount: {
                type: Sequelize.INTEGER
            },
            // isResetReview: DataTypes.BOOLEAN,
            isResetReview: {
                type: Sequelize.BOOLEAN
            },
            // countVocabularyViewed: DataTypes.INTEGER,
            countVocabularyViewed: {
                type: Sequelize.INTEGER
            },
            // countUserViewed: DataTypes.INTEGER,
            countUserViewed: {
                type: Sequelize.INTEGER
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('flashcards');
    }
};