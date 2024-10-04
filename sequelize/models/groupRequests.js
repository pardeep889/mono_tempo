module.exports = (sequelize, DataTypes) => {
    const GroupRequest = sequelize.define('GroupRequest', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'REJECTED', 'APPROVED'),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      acceptedBy: {
        type: DataTypes.INTEGER,  // This will store the admin's userId who accepted the request
        allowNull: true,
      },
    });
  
    GroupRequest.associate = function (models) {
      GroupRequest.belongsTo(models.Group, { foreignKey: 'groupId' });
      GroupRequest.belongsTo(models.User, { foreignKey: 'userId' });
      GroupRequest.belongsTo(models.User, { foreignKey: 'acceptedBy', as: 'AcceptedByAdmin' });
    };
  
    return GroupRequest;
  };
  