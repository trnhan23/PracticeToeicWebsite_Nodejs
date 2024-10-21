'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.User_Exam, { foreignKey: 'userId', as: 'userExam_UserData' });
      User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comment_UserData' });

    }
  }
  User.init({
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    email: DataTypes.STRING,
    fullName: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING,
    bio: DataTypes.STRING,
    registrationDate: DataTypes.DATE,
    roleId: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};