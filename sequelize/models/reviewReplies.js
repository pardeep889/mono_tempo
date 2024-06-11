'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ReviewsReplies extends Model {
    static associate(models) {
      
    }
  }
  ReviewsReplies.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    isCreater:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
  },
  {
    sequelize,
    modelName: "ReviewsReplies",
  }
);
return ReviewsReplies;
};