'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  Likes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,      
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exploreId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};
