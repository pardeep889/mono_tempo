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
          model: 'Users',  // Reference to the User model
          key: 'id',
        },
      },
      // Email Notifications
      notifyByEmail: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Allow email notifications by default
      },
      // Push Notifications
      notifyByPush: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Allow push notifications by default
      },
      // SMS Notifications
      notifyBySMS: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,  // SMS notifications are opt-in
      },
      // Notification preferences for different types
      notifyForLikes: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Receive notifications for likes by default
      },
      notifyForComments: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Receive notifications for comments by default
      },
      notifyForFollows: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Receive notifications for follows by default
      },
      notifyForMessages: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Receive notifications for direct/private messages
      },
      notifyForGroupMessages: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Receive notifications for group messages
      },
      notifyForGroupInvites: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Receive notifications for group invites
      },
      notifyForPayments: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Receive notifications for payments
      },
      notifyForOther: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // General or other notifications
      },
      // Daily or Weekly Digest (to reduce notification frequency)
      digestFrequency: {
        type: DataTypes.ENUM,
        values: ['DAILY', 'WEEKLY', 'NONE'],  // User can opt for digest emails
        defaultValue: 'NONE',  // No digest by default
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
  