module.exports = (sequelize, DataTypes) => {
  const UserNotificationSettings = sequelize.define('UserNotificationSettings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    // Notification settings for various types of notifications
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // true means email notifications are enabled
    },
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // true means push notifications are enabled
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // false means SMS notifications are disabled
    },
    // Notification types (you can add more as needed)
    receiveLikeNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    receiveCommentNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    receiveFollowNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    receiveGroupInviteNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    receivePrivateMessageNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    receivePaymentNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Timestamps
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
  UserNotificationSettings.associate = function (models) {
    UserNotificationSettings.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return UserNotificationSettings;
};
