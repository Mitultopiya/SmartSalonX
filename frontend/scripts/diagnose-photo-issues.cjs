const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnosing Photo Issues');
console.log('='.repeat(40));

// Get actual photos
const downloadsPath = path.join(__dirname, '../public/styles/downloads');
const menPhotos = fs.readdirSync(path.join(downloadsPath, 'men')).filter(f => f.endsWith('.jpg'));
const womenPhotos = fs.readdirSync(path.join(downloadsPath, 'women')).filter(f => f.endsWith('.jpg'));

// Read data files to see what photos are expected
const menDataPath = path.join(__dirname, '../data/faceShapeStyles.ts');
const womenDataPath = path.join(__dirname, '../data/womenFaceShapeStyles.ts');

const menData = fs.readFileSync(menDataPath, 'utf8');
const womenData = fs.readFileSync(womenDataPath, 'utf8');

// Extract image paths from data files
function extractImagePaths(data, folder) {
  const regex = /image: '([^']+)'/g;
  const paths = [];
  let match;
  while ((match = regex.exec(data)) !== null) {
    paths.push(match[1]);
  }
  return paths.map(path => path.split('/').pop());
}

const expectedMenPhotos = extractImagePaths(menData, 'men');
const expectedWomenPhotos = extractImagePaths(womenData, 'women');

console.log('\n📊 PHOTO ANALYSIS:');
console.log('='.repeat(20));

console.log('\n👨 MEN\'S PHOTOS:');
console.log(`Available: ${menPhotos.length}`);
console.log(`Expected: ${expectedMenPhotos.length}`);

const missingMen = expectedMenPhotos.filter(photo => !menPhotos.includes(photo));
const extraMen = menPhotos.filter(photo => !expectedMenPhotos.includes(photo));

if (missingMen.length > 0) {
  console.log('\n❌ Missing men photos:');
  missingMen.forEach(photo => console.log(`   - ${photo}`));
}

if (extraMen.length > 0) {
  console.log('\n⚠️  Extra men photos (not in data):');
  extraMen.forEach(photo => console.log(`   - ${photo}`));
}

console.log('\n👩 WOMEN\'S PHOTOS:');
console.log(`Available: ${womenPhotos.length}`);
console.log(`Expected: ${expectedWomenPhotos.length}`);

const missingWomen = expectedWomenPhotos.filter(photo => !womenPhotos.includes(photo));
const extraWomen = womenPhotos.filter(photo => !expectedWomenPhotos.includes(photo));

if (missingWomen.length > 0) {
  console.log('\n❌ Missing women photos:');
  missingWomen.forEach(photo => console.log(`   - ${photo}`));
}

if (extraWomen.length > 0) {
  console.log('\n⚠️  Extra women photos (not in data):');
  extraWomen.forEach(photo => console.log(`   - ${photo}`));
}

// Find filename issues
console.log('\n🔧 FILENAME ISSUES:');
console.log('='.repeat(20));

const problematicFiles = menPhotos.concat(womenPhotos).filter(photo => {
  return photo.includes(' (') || photo.includes(')') || !photo.match(/^[a-z0-9-]+\.jpg$/i);
});

if (problematicFiles.length > 0) {
  console.log('\n⚠️  Problematic filenames:');
  problematicFiles.forEach(photo => console.log(`   - ${photo}`));
  console.log('\n💡 These files need to be renamed to remove spaces and special characters');
}

// Generate fix suggestions
console.log('\n🛠️  SUGGESTED FIXES:');
console.log('='.repeat(20));

console.log('\n1. IMMEDIATE FIXES:');
if (menPhotos.includes('soft-curls-heart (2).jpg')) {
  console.log('   - Rename "soft-curls-heart (2).jpg" → "soft-curls-heart.jpg"');
}

console.log('\n2. MISSING PHOTOS:');
console.log(`   - Men: ${missingMen.length} photos missing`);
console.log(`   - Women: ${missingWomen.length} photos missing`);

console.log('\n3. EXTRA PHOTOS:');
console.log(`   - Men: ${extraMen.length} extra photos (can be ignored)`);
console.log(`   - Women: ${extraWomen.length} extra photos (can be ignored)`);

console.log('\n📋 DETAILED REPORT:');
console.log('='.repeat(20));

// Create a detailed report file
const report = {
  summary: {
    totalMenPhotos: menPhotos.length,
    totalWomenPhotos: womenPhotos.length,
    expectedMenPhotos: expectedMenPhotos.length,
    expectedWomenPhotos: expectedWomenPhotos.length,
    missingMen: missingMen.length,
    missingWomen: missingWomen.length,
    extraMen: extraMen.length,
    extraWomen: extraWomen.length
  },
  missingMen,
  missingWomen,
  extraMen,
  extraWomen,
  problematicFiles,
  availableMenPhotos: menPhotos,
  availableWomenPhotos: womenPhotos
};

fs.writeFileSync(
  path.join(__dirname, '../public/styles/photo-diagnosis-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('✅ Detailed report saved to: photo-diagnosis-report.json');

console.log('\n🎯 QUICK FIXES TO APPLY:');
console.log('='.repeat(25));

if (missingMen.length === 0 && missingWomen.length === 0 && problematicFiles.length === 0) {
  console.log('🎉 All photos are properly configured!');
} else {
  console.log('1. Fix problematic filenames');
  console.log('2. Add missing photos or update data files');
  console.log('3. Test the style advisor');
}
