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
    Chat.associate = function (models) {
      Chat.belongsTo(models.User, { as: 'User', foreignKey: 'userId' });
      Chat.belongsTo(models.Group, { as: 'Group', foreignKey: 'groupId' });
    };
  
    return Chat;
  };
  