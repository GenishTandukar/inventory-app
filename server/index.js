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

app.use('/api/products', require('./routes/productRoutes'));


const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});