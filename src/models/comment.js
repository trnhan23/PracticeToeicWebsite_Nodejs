'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'comment_UserData' });
      
    }
  }
  Comment.init({
    examId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    parentCmtId: DataTypes.INTEGER,
    contentComment: DataTypes.STRING,
    cmtDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments'
  });
  return Comment;
};