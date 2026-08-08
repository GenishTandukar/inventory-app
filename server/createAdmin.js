require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

async function run() {
  await sequelize.sync();
  const passwordHash = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', passwordHash });
  console.log('Admin user created: admin / admin123');
  process.exit();
}
run();