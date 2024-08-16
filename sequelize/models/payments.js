'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Payments extends Model {
    static associate(models) {
      
    }
  }
  Payments.init({
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      priceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
    
  },
  {
    sequelize,
    modelName: "Payments",
  }
);
return Payments;
};