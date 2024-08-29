"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.Follow,
        as: 'followers',
        foreignKey: 'followedId',
        otherKey: 'followerId',
      });

      this.belongsToMany(models.User, {
        through: models.Follow,
        as: 'following',
        foreignKey: 'followerId',
        otherKey: 'followedId',
      });

      this.hasMany(models.ExploreLike, { foreignKey: 'userId', as: 'likes' });

      this.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });

      this.hasMany(models.ReviewsReplies, { foreignKey: 'userId', as: 'reviewReplies' });

      this.hasMany(models.ReviewLike, { foreignKey: 'userId', as: 'reviewLikes' });
      this.hasMany(models.GroupMembership, { foreignKey: 'userId', as: 'groupMemberships' });
      this.hasMany(models.Group, { foreignKey: 'creatorId', as: 'createdGroups' });
      this.belongsToMany(models.Group, {
        through: models.GroupMembership,
        as: 'groups',
        foreignKey: 'userId',
        otherKey: 'groupId',
      });

    }
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
        values: ["active", "inactive", "deleted", "pending"],
        defaultValue: "active",
      },
      role: {
        type: DataTypes.ENUM,
        values: ["USER", "ADMIN", "MOD"],
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
        unique: true,
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
      forgotLink: {
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
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false, // Disable automatic timestamps
    }
  );

  return User;
};
