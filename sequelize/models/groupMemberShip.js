module.exports = (sequelize, DataTypes) => {
    const GroupMembership = sequelize.define("GroupMembership", {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: ["ADMIN", "MEMBER"],
        defaultValue: "MEMBER",
      },
      invitedBy: {
        type: DataTypes.INTEGER,
        allowNull: true, // This can be null for public groups
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
    GroupMembership.associate = function (models) {
      GroupMembership.belongsTo(models.User, { foreignKey: 'userId' });
      GroupMembership.belongsTo(models.Group, { foreignKey: 'groupId' });
    };
  
    return GroupMembership;
  };
  