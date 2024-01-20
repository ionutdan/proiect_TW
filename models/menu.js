const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

module.exports = (sequelize) => {
  const Menu = sequelize.define('Menus', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Menu;
};