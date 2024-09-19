module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true, // This field will store the URL of the attachment if any
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable for group messages
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable for one-to-one and self-chat messages
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
      isSelfChat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Flag to indicate if the message is a self-chat
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Every message belongs to a chat
        references: {
          model: 'Chats',
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
    });
  
    // Associations
    Message.associate = function (models) {
      Message.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderId' });
      Message.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiverId' });
      Message.belongsTo(models.Group, { foreignKey: 'groupId' });
    };
  
    return Message;
  };
  