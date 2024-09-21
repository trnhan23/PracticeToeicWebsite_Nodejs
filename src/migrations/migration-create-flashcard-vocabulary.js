'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('flashcard_vocabulary', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            // flashcardId: DataTypes.INTEGER,
            flashcardId: {
                type: Sequelize.INTEGER
            },
            // vocabularyId: DataTypes.INTEGER,
            vocabularyId: {
                type: Sequelize.INTEGER
            },
            // isReview: DataTypes.BOOLEAN,
            isReview: {
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('flashcard_vocabulary');
    }
};