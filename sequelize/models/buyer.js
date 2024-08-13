'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    static associate(models) {
    }
  }
  Buyer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,      
    },
    uid: DataTypes.STRING,
    exploreId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    custId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull:true
    }    
  }, {
    sequelize,
    modelName: 'Buyer',
  });
  return Buyer;
};
