module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["PRIVATE", "GROUP", "SELF"],
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for group chats
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for private and self chats
      references: {
        model: 'Groups',
        key: 'id',
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for self and group chats
      references: {
        model: 'Users', // Reference to the User model for receiver
        key: 'id',
      },
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
  }, {
    timestamps: true, // Ensure timestamps are managed automatically
  });

  // Associations
  Chat.associate = function (models) {
    Chat.belongsTo(models.User, { as: 'sender', foreignKey: 'userId' });

    // User who receives the message
    Chat.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverId' });

    // Group association (if the chat is in a group)
    Chat.belongsTo(models.Group, { as: 'group', foreignKey: 'groupId' });
    Chat.hasMany(models.Message, { foreignKey: 'chatId', as: 'latestMessage' });
  };

  return Chat;
};
