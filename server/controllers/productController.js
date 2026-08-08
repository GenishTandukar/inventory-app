const { Product, Supplier } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  const where = {};
  if (req.query.search) {
    where.name = { [Op.like]: `%${req.query.search}%` };
  }
  if (req.query.supplierId) {
    where.supplierId = req.query.supplierId;
  }
  const products = await Product.findAll({ where, include: Supplier });
  res.json(products);
};

exports.getOne = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: Supplier });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await product.update(req.body);
  res.json(product);
};

exports.remove = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await product.destroy();
  res.status(204).send();
};