'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TrailerVideo extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  TrailerVideo.init({
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
    videoPath: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coverImagePath: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    localPath: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'TrailerVideo',
  });
  return TrailerVideo;
};
