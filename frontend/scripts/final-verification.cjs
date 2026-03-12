const fs = require('fs');
const path = require('path');

console.log('🔍 Final Verification - Checking Photo Loading');
console.log('='.repeat(50));

// Get actual photos
const downloadsPath = path.join(__dirname, '../public/styles/downloads');
const menPhotos = fs.readdirSync(path.join(downloadsPath, 'men')).filter(f => f.endsWith('.jpg'));
const womenPhotos = fs.readdirSync(path.join(downloadsPath, 'women')).filter(f => f.endsWith('.jpg'));

// Read updated data files
const menDataPath = path.join(__dirname, '../data/faceShapeStyles.ts');
const womenDataPath = path.join(__dirname, '../data/womenFaceShapeStyles.ts');

const menData = fs.readFileSync(menDataPath, 'utf8');
const womenData = fs.readFileSync(womenDataPath, 'utf8');

// Extract image paths from updated data files
function extractImagePaths(data) {
  const regex = /image: '([^']+)'/g;
  const paths = [];
  let match;
  while ((match = regex.exec(data)) !== null) {
    paths.push(match[1]);
  }
  return paths;
}

const menImagePaths = extractImagePaths(menData);
const womenImagePaths = extractImagePaths(womenData);

console.log('\n📊 VERIFICATION RESULTS:');
console.log('='.repeat(25));

console.log('\n👨 MEN\'S PHOTOS:');
console.log(`Data file references: ${menImagePaths.length}`);
console.log(`Actual photos available: ${menPhotos.length}`);

// Check if all referenced photos exist
const missingMen = [];
const foundMen = [];
menImagePaths.forEach(imagePath => {
  const filename = imagePath.split('/').pop();
  if (menPhotos.includes(filename)) {
    foundMen.push(filename);
  } else {
    missingMen.push(filename);
  }
});

console.log(`✅ Found: ${foundMen.length}`);
console.log(`❌ Missing: ${missingMen.length}`);

if (missingMen.length > 0) {
  console.log('\nStill missing men photos:');
  missingMen.forEach(photo => console.log(`   - ${photo}`));
}

console.log('\n👩 WOMEN\'S PHOTOS:');
console.log(`Data file references: ${womenImagePaths.length}`);
console.log(`Actual photos available: ${womenPhotos.length}`);

// Check if all referenced photos exist
const missingWomen = [];
const foundWomen = [];
womenImagePaths.forEach(imagePath => {
  const filename = imagePath.split('/').pop();
  if (womenPhotos.includes(filename)) {
    foundWomen.push(filename);
  } else {
    missingWomen.push(filename);
  }
});

console.log(`✅ Found: ${foundWomen.length}`);
console.log(`❌ Missing: ${missingWomen.length}`);

if (missingWomen.length > 0) {
  console.log('\nStill missing women photos:');
  missingWomen.forEach(photo => console.log(`   - ${photo}`));
}

// Summary
console.log('\n📈 SUMMARY:');
console.log('='.repeat(15));
console.log(`Total photos working: ${foundMen.length + foundWomen.length}`);
console.log(`Total photos missing: ${missingMen.length + missingWomen.length}`);
console.log(`Success rate: ${Math.round(((foundMen.length + foundWomen.length) / (menImagePaths.length + womenImagePaths.length)) * 100)}%`);

// Check for the problematic file
const hasProblematicFile = menPhotos.includes('soft-curls-heart (2).jpg');
if (hasProblematicFile) {
  console.log('\n⚠️  STILL NEEDS FIX:');
  console.log('Rename "soft-curls-heart (2).jpg" to "soft-curls-heart.jpg"');
}

console.log('\n🎯 READY TO TEST?');
if (missingMen.length === 0 && missingWomen.length === 0 && !hasProblematicFile) {
  console.log('🎉 YES! All photos are properly configured!');
  console.log('Start your server and test the style advisor.');
} else {
  console.log('⚠️  Almost ready! Fix the issues above first.');
}

// Create a test URL list
console.log('\n📱 SAMPLE PHOTO URLS:');
console.log('='.repeat(20));
if (foundMen.length > 0) {
  console.log('Men examples:');
  foundMen.slice(0, 3).forEach(photo => {
    console.log(`   /styles/downloads/men/${photo}`);
  });
}
if (foundWomen.length > 0) {
  console.log('Women examples:');
  foundWomen.slice(0, 3).forEach(photo => {
    console.log(`   /styles/downloads/women/${photo}`);
  });
}
