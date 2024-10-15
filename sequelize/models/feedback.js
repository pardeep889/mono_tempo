module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define("Feedback", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      screenshot: {
        type: DataTypes.STRING(255),
        allowNull: true, // Optional
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
  
    Feedback.associate = function (models) {
      Feedback.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Feedback;
  };
  