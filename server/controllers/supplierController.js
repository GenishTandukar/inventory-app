const { Supplier } = require('../models');

exports.getAll = async (req, res) => {
  const suppliers = await Supplier.findAll();
  res.json(suppliers);
};

exports.getOne = async (req, res) => {
  const supplier = await Supplier.findByPk(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  res.json(supplier);
};

exports.create = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const supplier = await Supplier.findByPk(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  await supplier.update(req.body);
  res.json(supplier);
};

exports.remove = async (req, res) => {
  const supplier = await Supplier.findByPk(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  await supplier.destroy();
  res.status(204).send();
};