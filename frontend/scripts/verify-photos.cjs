
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Your Photos Are Accessible');
console.log('='.repeat(40));

const stylesPath = path.join(__dirname, '../public/styles/downloads');

// Check men's photos
console.log('\n👨 MEN\'S PHOTOS:');
console.log('-'.repeat(20));
const menPath = path.join(stylesPath, 'men');
if (fs.existsSync(menPath)) {
  const menPhotos = fs.readdirSync(menPath).filter(f => f.endsWith('.jpg'));
  console.log(`✅ Found ${menPhotos.length} men's photos`);
  menPhotos.forEach(photo => console.log(`   - ${photo}`));
} else {
  console.log('❌ Men folder not found');
}

// Check women's photos
console.log('\n👩 WOMEN\'S PHOTOS:');
console.log('-'.repeat(20));
const womenPath = path.join(stylesPath, 'women');
if (fs.existsSync(womenPath)) {
  const womenPhotos = fs.readdirSync(womenPath).filter(f => f.endsWith('.jpg'));
  console.log(`✅ Found ${womenPhotos.length} women's photos`);
  womenPhotos.forEach(photo => console.log(`   - ${photo}`));
} else {
  console.log('❌ Women folder not found');
}

console.log('\n🎉 Total photos ready: ' + 
  (fs.existsSync(menPath) ? fs.readdirSync(menPath).filter(f => f.endsWith('.jpg')).length : 0) +
  (fs.existsSync(womenPath) ? fs.readdirSync(womenPath).filter(f => f.endsWith('.jpg')).length : 0) + ' photos');
