const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  price: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Product;