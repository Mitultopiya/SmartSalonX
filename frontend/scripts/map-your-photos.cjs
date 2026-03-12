const fs = require('fs');
const path = require('path');

console.log('🗺️  Photo Mapping Assistant for Your 86 Photos');
console.log('='.repeat(50));

// Simplified list of essential styles (reduced from 114 to ~86)
const essentialStyles = {
  'hairstyles': {
    'oval': [
      'pompadour-oval.jpg',
      'quiff-oval.jpg',
      'sidepart-oval.jpg',
      'crew-oval.jpg'
    ],
    'round': [
      'pompadour-round.jpg',
      'quiff-round.jpg',
      'spiky-round.jpg'
    ],
    'square': [
      'boxed-square.jpg',
      'layered-square.jpg',
      'side-swept-square.jpg'
    ],
    'heart': [
      'deep-side-heart.jpg',
      'fringe-heart.jpg'
    ],
    'diamond': [
      'side-swept-diamond.jpg',
      'soft-layered-diamond.jpg'
    ],
    'oblong': [
      'full-side-oblong.jpg',
      'curly-side-oblong.jpg'
    ]
  },
  'beards': {
    'oval': [
      'full-oval.jpg',
      'goatee-oval.jpg'
    ],
    'round': [
      'angular-round.jpg',
      'heavy-stubble-round.jpg'
    ],
    'square': [
      'boxed-square.jpg',
      'rounded-square.jpg'
    ],
    'heart': [
      'anchor-heart.jpg',
      'circle-heart.jpg'
    ],
    'diamond': [
      'designer-stubble-diamond.jpg',
      'sleek-goatee-diamond.jpg'
    ],
    'oblong': [
      'extended-boxed-oblong.jpg',
      'full-wide-oblong.jpg'
    ]
  },
  'women': {
    'oval': [
      'long-layers-oval.jpg',
      'bob-oval.jpg',
      'beach-waves-oval.jpg',
      'high-ponytail-oval.jpg'
    ],
    'round': [
      'angled-bob-round.jpg',
      'texturizing-round.jpg',
      'vertical-highlights-round.jpg'
    ],
    'square': [
      'curly-bob-square.jpg',
      'soft-balayage-square.jpg',
      'warm-tones-square.jpg'
    ],
    'heart': [
      'soft-curls-heart.jpg',
      'side-swept-heart.jpg'
    ],
    'diamond': [
      'textured-bob-diamond.jpg',
      'elegant-updo-diamond.jpg'
    ],
    'oblong': [
      'voluminous-curls-oblong.jpg',
      'volume-boost-oblong.jpg',
      'wide-blowout-oblong.jpg'
    ]
  }
};

console.log('\n📋 ESSENTIAL STYLES LIST (Reduced to ~86 photos):');
console.log('This covers the most popular styles for each face shape.\n');

let totalEssential = 0;
for (const [category, faceShapes] of Object.entries(essentialStyles)) {
  console.log(`📁 ${category.toUpperCase()}`);
  console.log('-'.repeat(30));
  
  for (const [faceShape, photos] of Object.entries(faceShapes)) {
    console.log(`  🎯 ${faceShape.toUpperCase()} (${photos.length} photos):`);
    photos.forEach(photo => {
      console.log(`    - ${photo}`);
      totalEssential++;
    });
    console.log('');
  }
}

console.log(`📊 Total essential photos needed: ${totalEssential}`);
console.log('\n🎯 This gives you 2-4 styles per face shape per category,');
console.log('   which is perfect for a great user experience!\n');

// Create a mapping template
console.log('📝 PHOTO MAPPING TEMPLATE:');
console.log('='.repeat(30));
console.log('Copy this list and fill in your actual photo filenames:');
console.log('');

console.log('👨 MEN\'S HAIRSTYLES:');
console.log('Oval Face:');
console.log('  pompadour-oval.jpg → [your-photo-filename.jpg]');
console.log('  quiff-oval.jpg → [your-photo-filename.jpg]');
console.log('  sidepart-oval.jpg → [your-photo-filename.jpg]');
console.log('  crew-oval.jpg → [your-photo-filename.jpg]');
console.log('');

console.log('Round Face:');
console.log('  pompadour-round.jpg → [your-photo-filename.jpg]');
console.log('  quiff-round.jpg → [your-photo-filename.jpg]');
console.log('  spiky-round.jpg → [your-photo-filename.jpg]');
console.log('');

console.log('🧔 MEN\'S BEARDS:');
console.log('Oval Face:');
console.log('  full-oval.jpg → [your-photo-filename.jpg]');
console.log('  goatee-oval.jpg → [your-photo-filename.jpg]');
console.log('');

console.log('👩 WOMEN\'S STYLES:');
console.log('Oval Face:');
console.log('  long-layers-oval.jpg → [your-photo-filename.jpg]');
console.log('  bob-oval.jpg → [your-photo-filename.jpg]');
console.log('  beach-waves-oval.jpg → [your-photo-filename.jpg]');
console.log('  high-ponytail-oval.jpg → [your-photo-filename.jpg]');
console.log('');

console.log('🚀 NEXT STEPS:');
console.log('1. Put your 86 photos in: frontend/public/styles/downloads/');
console.log('2. Use this template to map your photos to the required names');
console.log('3. Rename your photos to match the required filenames');
console.log('4. Move them to the appropriate folders');
console.log('5. Run the check script to verify: node scripts/check-photos.cjs');
