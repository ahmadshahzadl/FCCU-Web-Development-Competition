import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { Category } from '../modules/category/Category.model';

const defaultCategories = [
  {
    name: 'Maintenance',
    slug: 'maintenance',
    description: 'Maintenance-related requests',
    isActive: true,
  },
  {
    name: 'Academic',
    slug: 'academic',
    description: 'Academic-related requests',
    isActive: true,
  },
  {
    name: 'Lost & Found',
    slug: 'lost-found',
    description: 'Lost and found items',
    isActive: true,
  },
  {
    name: 'General',
    slug: 'general',
    description: 'General requests',
    isActive: true,
  },
];

async function seedDefaultCategories() {
  try {
    await connectDatabase();
    console.log('🌱 Seeding default categories...');

    for (const categoryData of defaultCategories) {
      const existingCategory = await Category.findOne({
        $or: [{ name: categoryData.name }, { slug: categoryData.slug }],
      });

      if (!existingCategory) {
        await Category.create(categoryData);
        console.log(`✅ Created category: ${categoryData.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${categoryData.name}`);
      }
    }

    console.log('✅ Default categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedDefaultCategories();

