require('dotenv').config();
const { sequelize } = require('./models');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/suppliers', require('./routes/supplierRoutes'));

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/products', require('./routes/productRoutes'));


const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');

sequelize.sync().then(async () => {
  const existing = await User.findOne({ where: { username: 'admin' } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', passwordHash });
    console.log('Default admin created');
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});