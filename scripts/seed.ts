import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/support_system';

// Define schemas locally to avoid path alias issues in standalone script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'agent', 'admin'], default: 'customer' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Clear existing users for a clean seed (optional, but good for demo)
    // await User.deleteMany({});

    const users = [
      {
        name: 'System Admin',
        email: 'admin@example.com',
        password: 'adminpassword',
        role: 'admin',
      },
      {
        name: 'Support Agent One',
        email: 'agent@example.com',
        password: 'agentpassword',
        role: 'agent',
      },
      {
        name: 'Test Customer',
        email: 'customer@example.com',
        password: 'customerpassword',
        role: 'customer',
      }
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`User ${u.email} already exists, skipping.`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await User.create({
        ...u,
        password: hashedPassword,
      });
      console.log(`Created ${u.role}: ${u.email} / ${u.password}`);
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
