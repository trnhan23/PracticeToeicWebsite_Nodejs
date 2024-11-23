'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vocabularies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            // word: DataTypes.STRING,
            word: {
                type: Sequelize.STRING
            },
            // definition: DataTypes.STRING,
            definition: {
                type: Sequelize.STRING
            },
            // partOfSpeech: DataTypes.STRING,
            partOfSpeech: {
                type: Sequelize.STRING
            },
            // exampleSentence: DataTypes.STRING,
            exampleSentence: {
                type: Sequelize.STRING
            },
            // pronunciation: DataTypes.STRING,
            pronunciation: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('vocabularies');
    }
};