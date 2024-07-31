// src/models/exploreLike.js
"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ExploreLike extends Model {
    static associate(models) {
      // Define associations if needed
    }
  }

  ExploreLike.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      exploreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "ExploreLike",
      timestamps: true // To track when the like was created
    }
  );

  return ExploreLike;
};
