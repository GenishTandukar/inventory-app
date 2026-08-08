const sequelize = require('../config/database');
const Supplier = require('./Supplier');
const Product = require('./Product');
const User = require('./User');

// one Supplier has many Products
Supplier.hasMany(Product, { foreignKey: 'supplierId' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = { sequelize, Supplier, Product, User };