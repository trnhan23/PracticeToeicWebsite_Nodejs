'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Exam.belongsTo(models.Exam, { foreignKey: 'examId', as: 'userExam_ExamData' });
      User_Exam.belongsTo(models.User, { foreignKey: 'userId', as: 'userExam_UserData' });
    }
  }
  User_Exam.init({
    userId: DataTypes.INTEGER,
    examId: DataTypes.INTEGER,
    statusExam: DataTypes.BOOLEAN,

  }, {
    sequelize,
    modelName: 'User_Exam',
    tableName: 'user_exam',
  });
  return User_Exam;
};