module.exports = (sequelize, DataTypes) => {
    const GroupInvite = sequelize.define("GroupInvite", {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
      invitedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      invitedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ["PENDING", "ACCEPTED", "REJECTED"],
        defaultValue: "PENDING",
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
    GroupInvite.associate = function (models) {
      GroupInvite.belongsTo(models.User, { foreignKey: 'invitedUserId', as: 'invitedUser' });
      GroupInvite.belongsTo(models.Group, {  as: 'group', foreignKey: 'groupId' });
      GroupInvite.belongsTo(models.User, { foreignKey: 'invitedBy', as: 'inviter' });
    };
  
    return GroupInvite;
  };
  