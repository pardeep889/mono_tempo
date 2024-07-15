"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Explore extends Model {
    static associate(models) {}
  }
  Explore.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      docId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      collabType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      connectedGroup: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      exploreRating: {
        type: DataTypes.FLOAT,
        defaultValue: null,
      },
      isFree: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      price: {
        type: DataTypes.JSON,
        defaultValue: null,
      },
      totalReviewsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      location: {
        type: DataTypes.JSON, // Updated to JSON to accommodate object structure
        defaultValue: null,
      },
      categoryID: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      statusLastModified: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      promoted : {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "Explore",
    }
  );
  return Explore;
};
