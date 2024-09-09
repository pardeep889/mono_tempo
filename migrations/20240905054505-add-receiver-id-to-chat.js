module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Chats', 'receiverId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addConstraint('Chats', {
      fields: ['receiverId'],
      type: 'foreign key',
      name: 'Chats_receiverId_fkey',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Chats', 'Chats_receiverId_fkey');
    await queryInterface.removeColumn('Chats', 'receiverId');
  },
};
