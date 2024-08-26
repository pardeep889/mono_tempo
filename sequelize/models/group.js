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
  