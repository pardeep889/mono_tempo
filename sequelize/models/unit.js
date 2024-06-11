"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {  
    static associate(models) {}
  }
  Unit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      unitNumber:  {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      exploreId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Unit",
    }
  );
  return Unit;
};
