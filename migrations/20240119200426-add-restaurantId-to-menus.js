'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Menus', 'restaurantId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Restaurants', 
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Menus', 'restaurantId');
  },
};