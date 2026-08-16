require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, User, Supplier, Product } = require('./models');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Catch-all error handler — prevents unhandled errors from crashing requests
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;

// Seeds a handful of starter Suppliers + Products so a first-time visitor
// (or the catalogue right after a Render free-tier reset) never sees an
// empty list. Only runs when the Supplier table is empty, so it never
// duplicates data or overwrites anything you've added yourself.
async function seedStarterData() {
  const supplierCount = await Supplier.count();
  if (supplierCount > 0) return; // already has data — don't touch it

  const suppliers = await Supplier.bulkCreate([
    { name: 'Everest Traders', email: 'contact@everesttraders.com', phone: '01-4123456', address: 'Kathmandu, Nepal' },
    { name: 'Himalayan Supplies Co.', email: 'sales@himalayansupplies.com', phone: '01-4987654', address: 'Lalitpur, Nepal' },
    { name: 'Kantipur Wholesale', email: 'info@kantipurwholesale.com', phone: '01-4555222', address: 'Bhaktapur, Nepal' },
  ], { returning: true });

  await Product.bulkCreate([
    { name: 'Wireless Mouse', sku: 'WM-001', description: 'Compact 2.4GHz wireless mouse.', price: 850, quantity: 24, supplierId: suppliers[0].id },
    { name: 'Mechanical Keyboard', sku: 'KB-002', description: 'RGB backlit mechanical keyboard.', price: 3200, quantity: 3, supplierId: suppliers[0].id },
    { name: 'USB-C Hub', sku: 'HB-003', description: '7-in-1 USB-C hub with HDMI.', price: 1800, quantity: 15, supplierId: suppliers[1].id },
    { name: 'HD Webcam', sku: 'WC-004', description: '1080p webcam with built-in mic.', price: 2100, quantity: 2, supplierId: suppliers[1].id },
    { name: 'Laptop Stand', sku: 'LS-005', description: 'Adjustable aluminium laptop stand.', price: 1450, quantity: 30, supplierId: suppliers[2].id },
    { name: 'Bluetooth Speaker', sku: 'SP-006', description: 'Portable speaker, 10hr battery.', price: 2750, quantity: 8, supplierId: suppliers[2].id },
  ]);

  console.log('Starter suppliers and products seeded');
}

sequelize.sync().then(async () => {
  const existing = await User.findOne({ where: { username: 'admin' } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', passwordHash });
    console.log('Default admin created');
  }

  await seedStarterData();

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});