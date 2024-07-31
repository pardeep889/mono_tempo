'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    static associate(models) {
      this.hasMany(models.ReviewsReplies, { foreignKey: 'reviewId', as: 'replies' });
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Name of the target model
        key: 'id', // Key in the target model
      },
    },
    text: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exploreId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Review",
  });
  return Review;
};
