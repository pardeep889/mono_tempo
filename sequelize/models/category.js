'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
    }
  }
  Category.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,      
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    name: { 
      type: DataTypes.STRING,
      unique:true
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    parentId: {type: DataTypes.INTEGER,
      defaultValue: null
    },
    
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
