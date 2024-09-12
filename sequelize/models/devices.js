"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // The user associated with the device
      });
    }
  }

  Device.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      deviceId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      fcmToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      deviceType: {
        type: DataTypes.ENUM,
        values: ['ios', 'android', 'web'],
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Foreign key to the User model
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Device",
      timestamps: true,
    }
  );

  return Device;
};
