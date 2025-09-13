require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/users');
const Tenant = require('./models/Tenant');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('MongoDB connected');

    // Delete old data
    await Tenant.deleteMany({});
    await User.deleteMany({});

    // Create tenants
    const acme = await Tenant.create({ slug: 'acme', name: 'Acme', plan: 'free', noteLimit: 3 });
    const globex = await Tenant.create({ slug: 'globex', name: 'Globex', plan: 'free', noteLimit: 3 });
    console.log('Tenants created');

    // Create users (passwords will be hashed automatically)
    const users = [
      { email: 'admin@acme.test', password: 'password', role: 'admin', tenantId: acme._id },
      { email: 'user@acme.test', password: 'password', role: 'member', tenantId: acme._id },
      { email: 'admin@globex.test', password: 'password', role: 'admin', tenantId: globex._id },
      { email: 'user@globex.test', password: 'password', role: 'member', tenantId: globex._id },
    ];

    for (let u of users) {
      const user = new User(u); // pre('save') hook will hash password
      await user.save();
    }

    console.log('Users created');
    console.log('Seeding complete');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    await mongoose.disconnect();
  }
}

seed();
