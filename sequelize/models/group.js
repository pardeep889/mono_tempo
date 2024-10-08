module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define("Group", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["PUBLIC", "PRIVATE"],
        defaultValue: "PUBLIC",
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      inviteCode: {
        type: DataTypes.STRING(255),
        allowNull: true, // Nullable until an invite code is generated
      },
      inviteCodeExpiration: {
        type: DataTypes.DATE,
        allowNull: true, // Nullable until an expiration time is set
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
    Group.associate = function (models) {
      Group.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
      Group.belongsToMany(models.User, {
        through: models.GroupMembership,
        as: 'members',
        foreignKey: 'groupId',
        otherKey: 'userId',
      });
    };
  
    return Group;
  };
  