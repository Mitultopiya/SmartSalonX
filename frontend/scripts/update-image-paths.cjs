const fs = require('fs');
const path = require('path');

console.log('🔄 Updating Image Paths for Your Folder Structure');
console.log('='.repeat(50));

// Read the men's data file
const menDataPath = path.join(__dirname, '../data/faceShapeStyles.ts');
let menData = fs.readFileSync(menDataPath, 'utf8');

// Read the women's data file
const womenDataPath = path.join(__dirname, '../data/womenFaceShapeStyles.ts');
let womenData = fs.readFileSync(womenDataPath, 'utf8');

console.log('📁 Updating men\'s hairstyle paths...');
// Replace men's hairstyle paths
menData = menData.replace(/\/styles\/hairstyles\//g, '/styles/downloads/men/');

console.log('📁 Updating men\'s beard paths...');
// Replace men's beard paths  
menData = menData.replace(/\/styles\/beards\//g, '/styles/downloads/men/');

console.log('📁 Updating women\'s style paths...');
// Replace women's style paths
womenData = womenData.replace(/\/styles\/women\//g, '/styles/downloads/women/');

// Write updated files back
fs.writeFileSync(menDataPath, menData);
fs.writeFileSync(womenDataPath, womenData);

console.log('✅ All image paths updated successfully!');
console.log('');
console.log('📋 Updated paths:');
console.log('  Men\'s hairstyles: /styles/downloads/men/[filename].jpg');
console.log('  Men\'s beards: /styles/downloads/men/[filename].jpg');
console.log('  Women\'s styles: /styles/downloads/women/[filename].jpg');
console.log('');
console.log('🎯 Now your photos will load correctly from the downloads folder!');

// Create a verification script
console.log('');
console.log('🔍 Creating photo verification script...');

const verificationScript = `
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Your Photos Are Accessible');
console.log('='.repeat(40));

const stylesPath = path.join(__dirname, '../public/styles/downloads');

// Check men's photos
console.log('\\n👨 MEN\\'S PHOTOS:');
console.log('-'.repeat(20));
const menPath = path.join(stylesPath, 'men');
if (fs.existsSync(menPath)) {
  const menPhotos = fs.readdirSync(menPath).filter(f => f.endsWith('.jpg'));
  console.log(\`✅ Found \${menPhotos.length} men's photos\`);
  menPhotos.forEach(photo => console.log(\`   - \${photo}\`));
} else {
  console.log('❌ Men folder not found');
}

// Check women's photos
console.log('\\n👩 WOMEN\\'S PHOTOS:');
console.log('-'.repeat(20));
const womenPath = path.join(stylesPath, 'women');
if (fs.existsSync(womenPath)) {
  const womenPhotos = fs.readdirSync(womenPath).filter(f => f.endsWith('.jpg'));
  console.log(\`✅ Found \${womenPhotos.length} women's photos\`);
  womenPhotos.forEach(photo => console.log(\`   - \${photo}\`));
} else {
  console.log('❌ Women folder not found');
}

console.log('\\n🎉 Total photos ready: ' + 
  (fs.existsSync(menPath) ? fs.readdirSync(menPath).filter(f => f.endsWith('.jpg')).length : 0) +
  (fs.existsSync(womenPath) ? fs.readdirSync(womenPath).filter(f => f.endsWith('.jpg')).length : 0) + ' photos');
`;

fs.writeFileSync(path.join(__dirname, 'verify-photos.cjs'), verificationScript);
console.log('✅ Created verification script: scripts/verify-photos.cjs');
console.log('');
console.log('🚀 Next steps:');
console.log('1. Run: node scripts/verify-photos.cjs (to verify photos)');
console.log('2. Start your server: npm run dev-https');
console.log('3. Test the style advisor with your photos!');
