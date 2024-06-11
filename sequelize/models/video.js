"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {  
    static associate(models) {}
  }
  Video.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      caption:DataTypes.TEXT,
      unitNumber:DataTypes.INTEGER,
      videoNumber:DataTypes.INTEGER,
      title:DataTypes.STRING,
      exploreId:DataTypes.STRING,
      videoDetails: {
        type: DataTypes.JSON,
        defaultValue: null,
      }
    },
    {
      sequelize,
      modelName: "Video",
    }
  );
  return Video;
};
