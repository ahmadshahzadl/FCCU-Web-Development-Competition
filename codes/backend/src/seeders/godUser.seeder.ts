import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../modules/user/User.model';
import { env, validateEnv } from '../config/env';

/**
 * Seed God User - Creates the initial admin user with full access
 */
export const seedGodUser = async (): Promise<void> => {
  try {
    console.log('🌱 Starting God User seeder...');

    // Validate environment variables first
    validateEnv();

    // Ensure values exist
    if (!env.GOD_USER_EMAIL || !env.GOD_USER_USERNAME || !env.GOD_USER_PASSWORD) {
      throw new Error('God User credentials are not properly configured in .env file');
    }

    // Check if god user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: env.GOD_USER_EMAIL.toLowerCase() },
        { username: env.GOD_USER_USERNAME.toLowerCase() },
      ],
    });

    if (existingUser) {
      console.log('✅ God User already exists. Skipping seed.');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Role: ${existingUser.role}`);
      return;
    }

    // Create god user
    const godUser = await User.create({
      email: env.GOD_USER_EMAIL.toLowerCase(),
      username: env.GOD_USER_USERNAME.toLowerCase(),
      password: env.GOD_USER_PASSWORD, // Will be hashed by pre-save hook
      name: env.GOD_USER_NAME,
      role: 'admin',
    });

    console.log('✅ God User created successfully!');
    console.log('📋 Credentials:');
    console.log(`   Email: ${godUser.email}`);
    console.log(`   Username: ${godUser.username}`);
    console.log(`   Password: ${env.GOD_USER_PASSWORD}`);
    console.log(`   Role: ${godUser.role}`);
    console.log('⚠️  Please change the password after first login!');
  } catch (error: any) {
    console.error('❌ Error seeding God User:', error.message);
    throw error;
  }
};

/**
 * Run seeder standalone
 */
const runSeeder = async (): Promise<void> => {
  try {
    await connectDatabase();
    await seedGodUser();
    await disconnectDatabase();
    console.log('✅ Seeder completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}

