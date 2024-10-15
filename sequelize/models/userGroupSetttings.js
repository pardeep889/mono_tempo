module.exports = (sequelize, DataTypes) => {
    const UserGroupSettings = sequelize.define("UserGroupSettings", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
      notificationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // By default, notifications are enabled
      },
      notificationPreferences: {
        type: DataTypes.ENUM,
        values: ["ALL", "MENTIONS_ONLY", "NONE"],
        defaultValue: "ALL", // Default to receiving all notifications
      },
      muteGroup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // User can mute the group entirely
      },
      visibility: {
        type: DataTypes.ENUM,
        values: ["VISIBLE", "HIDDEN"],
        defaultValue: "VISIBLE", // Controls visibility of the user in the group
      },
      lastActivity: {
        type: DataTypes.DATE,
        allowNull: true, // Tracks the user's last activity in the group
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  
    // Associations
    UserGroupSettings.associate = function (models) {
      UserGroupSettings.belongsTo(models.User, { foreignKey: 'userId' });
      UserGroupSettings.belongsTo(models.Group, { foreignKey: 'groupId' });
    };
  
    return UserGroupSettings;
  };
  