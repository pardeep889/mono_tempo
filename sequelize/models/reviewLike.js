'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ReviewLike extends Model {
    static associate(models) {
      this.belongsTo(models.Review, { foreignKey: 'reviewId', as: 'review' });
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  ReviewLike.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Reviews', // Name of the target model
        key: 'id', // Key in the target model
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Name of the target model
        key: 'id', // Key in the target model
      },
    },
  },
  {
    sequelize,
    modelName: "ReviewLike",
  });
  return ReviewLike;
};
