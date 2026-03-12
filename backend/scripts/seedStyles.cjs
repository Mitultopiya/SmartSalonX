const mongoose = require('mongoose');
const Style = require('../models/Style');
require('dotenv').config();

const sampleStyles = [
  // Hairstyles
  {
    name: 'Classic Pompadour',
    category: 'hairstyle',
    suitableFaceShapes: ['oval', 'square', 'oblong'],
    images: ['/styles/pompadour1.jpg', '/styles/pompadour2.jpg'],
    description: 'Timeless style with volume on top and shorter sides. Perfect for formal occasions.',
    popularity: 95,
    tags: ['classic', 'formal', 'versatile', 'elegant'],
    price: 1500,
    duration: 45,
    difficulty: 'medium',
    maintenance: 'high',
    seasons: ['spring', 'fall', 'winter'],
    ageGroups: ['young-adult', 'adult'],
    hairTypes: ['straight', 'wavy']
  },
  {
    name: 'Textured Quiff',
    category: 'hairstyle',
    suitableFaceShapes: ['oval', 'round', 'heart'],
    images: ['/styles/quiff1.jpg', '/styles/quiff2.jpg'],
    description: 'Modern textured style with height and movement. Great for casual and professional settings.',
    popularity: 88,
    tags: ['modern', 'trendy', 'casual', 'versatile'],
    price: 1200,
    duration: 30,
    difficulty: 'easy',
    maintenance: 'medium',
    seasons: ['spring', 'summer', 'fall'],
    ageGroups: ['teen', 'young-adult', 'adult'],
    hairTypes: ['straight', 'wavy', 'curly']
  },
  {
    name: 'Side Part',
    category: 'hairstyle',
    suitableFaceShapes: ['oval', 'square', 'diamond'],
    images: ['/styles/sidepart1.jpg', '/styles/sidepart2.jpg'],
    description: 'Professional look with deep side part. Clean and sophisticated for business settings.',
    popularity: 82,
    tags: ['professional', 'classic', 'clean', 'business'],
    price: 1000,
    duration: 25,
    difficulty: 'easy',
    maintenance: 'low',
    seasons: ['spring', 'fall', 'winter'],
    ageGroups: ['young-adult', 'adult', 'mature'],
    hairTypes: ['straight', 'wavy']
  },
  {
    name: 'Buzz Cut',
    category: 'hairstyle',
    suitableFaceShapes: ['oval', 'square', 'oblong'],
    images: ['/styles/buzz1.jpg', '/styles/buzz2.jpg'],
    description: 'Short and low-maintenance military style. Bold and confident look.',
    popularity: 75,
    tags: ['short', 'low-maintenance', 'bold', 'military'],
    price: 500,
    duration: 15,
    difficulty: 'easy',
    maintenance: 'low',
    seasons: ['summer', 'spring', 'fall'],
    ageGroups: ['teen', 'young-adult', 'adult', 'mature'],
    hairTypes: ['straight', 'wavy', 'curly', 'coily']
  },
  {
    name: 'Crew Cut',
    category: 'hairstyle',
    suitableFaceShapes: ['round', 'square', 'heart'],
    images: ['/styles/crew1.jpg', '/styles/crew2.jpg'],
    description: 'Short on sides, slightly longer on top. Classic American haircut.',
    popularity: 80,
    tags: ['short', 'classic', 'clean', 'american'],
    price: 800,
    duration: 20,
    difficulty: 'easy',
    maintenance: 'low',
    seasons: ['summer', 'spring', 'fall'],
    ageGroups: ['teen', 'young-adult', 'adult'],
    hairTypes: ['straight', 'wavy', 'curly']
  },
  {
    name: 'Undercut',
    category: 'hairstyle',
    suitableFaceShapes: ['oval', 'heart', 'diamond'],
    images: ['/styles/undercut1.jpg', '/styles/undercut2.jpg'],
    description: 'Short sides with longer hair on top. Edgy and modern style.',
    popularity: 85,
    tags: ['modern', 'edgy', 'trendy', 'versatile'],
    price: 1300,
    duration: 35,
    difficulty: 'medium',
    maintenance: 'medium',
    seasons: ['spring', 'summer', 'fall'],
    ageGroups: ['teen', 'young-adult', 'adult'],
    hairTypes: ['straight', 'wavy']
  },
  // Beard Styles
  {
    name: 'Full Beard',
    category: 'beard',
    suitableFaceShapes: ['oval', 'square', 'oblong'],
    images: ['/styles/fullbeard1.jpg', '/styles/fullbeard2.jpg'],
    description: 'Complete beard growth for mature look. Requires patience and maintenance.',
    popularity: 90,
    tags: ['full', 'mature', 'classic', 'masculine'],
    price: 300,
    duration: 20,
    difficulty: 'medium',
    maintenance: 'high',
    seasons: ['fall', 'winter'],
    ageGroups: ['adult', 'mature'],
    hairTypes: ['straight', 'wavy', 'curly']
  },
  {
    name: 'Goatee',
    category: 'beard',
    suitableFaceShapes: ['oval', 'round', 'heart'],
    images: ['/styles/goatee1.jpg', '/styles/goatee2.jpg'],
    description: 'Chin hair with mustache combination. Classic and versatile style.',
    popularity: 85,
    tags: ['classic', 'versatile', 'clean', 'popular'],
    price: 200,
    duration: 15,
    difficulty: 'easy',
    maintenance: 'medium',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    ageGroups: ['young-adult', 'adult', 'mature'],
    hairTypes: ['straight', 'wavy', 'curly']
  },
  {
    name: 'Stubble',
    category: 'beard',
    suitableFaceShapes: ['oval', 'square', 'diamond', 'heart'],
    images: ['/styles/stubble1.jpg', '/styles/stubble2.jpg'],
    description: 'Light beard growth for rugged look. Low maintenance and stylish.',
    popularity: 88,
    tags: ['casual', 'low-maintenance', 'rugged', 'modern'],
    price: 100,
    duration: 10,
    difficulty: 'easy',
    maintenance: 'low',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    ageGroups: ['teen', 'young-adult', 'adult', 'mature'],
    hairTypes: ['straight', 'wavy', 'curly', 'coily']
  },
  {
    name: 'Van Dyke',
    category: 'beard',
    suitableFaceShapes: ['oval', 'heart', 'diamond'],
    images: ['/styles/vandyke1.jpg', '/styles/vandyke2.jpg'],
    description: 'Pointed beard with floating mustache. Stylish and elegant.',
    popularity: 78,
    tags: ['stylish', 'classic', 'elegant', 'sophisticated'],
    price: 250,
    duration: 20,
    difficulty: 'medium',
    maintenance: 'high',
    seasons: ['fall', 'winter', 'spring'],
    ageGroups: ['young-adult', 'adult', 'mature'],
    hairTypes: ['straight', 'wavy']
  },
  {
    name: 'Circle Beard',
    category: 'beard',
    suitableFaceShapes: ['round', 'square', 'oblong'],
    images: ['/styles/circle1.jpg', '/styles/circle2.jpg'],
    description: 'Rounded beard connecting mustache. Balanced and modern look.',
    popularity: 82,
    tags: ['rounded', 'balanced', 'modern', 'clean'],
    price: 200,
    duration: 15,
    difficulty: 'easy',
    maintenance: 'medium',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    ageGroups: ['young-adult', 'adult', 'mature'],
    hairTypes: ['straight', 'wavy', 'curly']
  }
];

async function seedStyles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salon_management');
    console.log('✅ Connected to MongoDB');

    // Clear existing styles
    await Style.deleteMany({});
    console.log('🗑️ Cleared existing styles');

    // Insert sample styles
    const insertedStyles = await Style.insertMany(sampleStyles);
    console.log(`✅ Inserted ${insertedStyles.length} styles`);

    console.log('🎉 Style seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding styles:', error);
    process.exit(1);
  }
}

seedStyles();
