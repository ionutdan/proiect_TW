const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

module.exports = (sequelize) => {
  const Menu = sequelize.define('Menus', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.INTEGER, // This should match your Restaurant model's primary key data type
      allowNull: false,
    },
  });

  return Menu;
};