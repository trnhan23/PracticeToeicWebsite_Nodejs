'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Topic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Nếu sau này có quan hệ với các bảng khác, bạn có thể khai báo ở đây
            // Ví dụ: Topic.hasMany(models.Flashcard, { foreignKey: 'topicId', as: 'flashcards' });
        }
    }
    Topic.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Topic',
        tableName: 'topics', // Đảm bảo tên bảng đúng như trong database
        timestamps: true, // Tự động thêm createdAt và updatedAt
    });
    return Topic;
};
