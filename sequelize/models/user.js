"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uid: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      accountStatus: {
        type: DataTypes.ENUM,
        values: Object.values(["active", "inactive","deleted", "pending"]),
        defaultValue: "active",
      },
      role: {
        type: DataTypes.ENUM,
        values: Object.values(["USER", "ADMIN","MOD"]),
        defaultValue: "USER",
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripeCustomerId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      forgotLink:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      userStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isSubscribed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordChangeRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false, // Disable automatic timestamps
    }
  );
  return User;
};
