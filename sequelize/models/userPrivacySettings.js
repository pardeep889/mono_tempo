module.exports = (sequelize, DataTypes) => {
    const UserPrivacySettings = sequelize.define('UserPrivacySettings', {
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
      // Account Visibility
      isPrivateAccount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,  // false means public account
      },
      // Story Privacy
      hideStoryFromUsers: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of user IDs
        allowNull: true,
      },
      allowMessageRepliesFrom: {
        type: DataTypes.ENUM,
        values: ['EVERYONE', 'FOLLOWING', 'NONE'],
        defaultValue: 'EVERYONE',
      },
      // Post Privacy
      allowCommentsFrom: {
        type: DataTypes.ENUM,
        values: ['EVERYONE', 'FOLLOWING', 'NONE'],
        defaultValue: 'EVERYONE',
      },
      showActivityStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // true means activity status is visible
      },
      // Tagging & Mentions
      allowTagsFrom: {
        type: DataTypes.ENUM,
        values: ['EVERYONE', 'FOLLOWING', 'NONE'],
        defaultValue: 'EVERYONE',
      },
      allowMentionsFrom: {
        type: DataTypes.ENUM,
        values: ['EVERYONE', 'FOLLOWING', 'NONE'],
        defaultValue: 'EVERYONE',
      },
      // Message Privacy
      allowMessagesFrom: {
        type: DataTypes.ENUM,
        values: ['EVERYONE', 'FOLLOWING', 'NONE'],
        defaultValue: 'EVERYONE',
      },
      allowGroupInvitesFrom: {
        type: DataTypes.ENUM,
        values: ['EVERYONE', 'FOLLOWING', 'NONE'],
        defaultValue: 'EVERYONE',
      },
      // Block & Restrict Users
      blockedUsers: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of user IDs
        allowNull: true,
      },
      restrictedUsers: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of user IDs
        allowNull: true,
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
    UserPrivacySettings.associate = function (models) {
      UserPrivacySettings.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return UserPrivacySettings;
  };
  