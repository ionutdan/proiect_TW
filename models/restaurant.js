const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

module.exports = (sequelize) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    revenue: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expenses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Restaurant;
};