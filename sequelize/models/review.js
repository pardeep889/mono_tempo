'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    static associate(models) {
      
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
    text: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: "Review",
  }
);
return Review;
};