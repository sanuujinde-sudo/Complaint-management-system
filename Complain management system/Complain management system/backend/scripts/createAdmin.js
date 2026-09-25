const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in .env');
  }
  if (password.length < 6) throw new Error('ADMIN_PASSWORD must be at least 6 characters');

  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.password = passwordHash;
    existing.role = 'ADMIN';
    await existing.save();
    console.log(`Admin account updated: ${email}`);
  } else {
    await User.create({ name, email, password: passwordHash, role: 'ADMIN' });
    console.log(`Admin account created: ${email}`);
  }
  process.exit(0);
};

createAdmin().catch(error => {
  console.error(error.message);
  process.exit(1);
});
