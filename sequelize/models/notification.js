"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver', // The user who receives the notification
      });

      this.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender', // The user who triggered the notification
      });
    }
  }

  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['like', 'comment', 'follow', 'message' , 'other'],
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      referenceId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be exploreId or userId, depending on the notification type
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Foreign key to the User model (who will receive the notification)
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Foreign key to the User model (who triggered the notification)
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
      modelName: "Notification",
      timestamps: true, // Enable timestamps for createdAt/updatedAt
    }
  );

  return Notification;
};
