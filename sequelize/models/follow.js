// src/models/follow.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      this.belongsTo(models.User, { as: 'follower', foreignKey: 'followerId' });
      this.belongsTo(models.User, { as: 'followed', foreignKey: 'followedId' });
    }
  }
  Follow.init(
    {
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Follow",
      timestamps: true, // Enable timestamps to track follows
    }
  );
  return Follow;
};
