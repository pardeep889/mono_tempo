'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ReviewsReplies extends Model {
    static associate(models) {
      this.belongsTo(models.Review, { foreignKey: 'reviewId', as: 'review' });
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  ReviewsReplies.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Name of the target model
        key: 'id', // Key in the target model
      },
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    isCreater: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "ReviewsReplies",
  });
  return ReviewsReplies;
};
