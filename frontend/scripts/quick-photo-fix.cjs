const fs = require('fs');
const path = require('path');

console.log('🔧 Quick Photo Fix - Updating Data Files');
console.log('='.repeat(45));

// Read men's data file
const menDataPath = path.join(__dirname, '../data/faceShapeStyles.ts');
let menData = fs.readFileSync(menDataPath, 'utf8');

// Update men's photo paths to match your actual files
const menReplacements = {
  'sidepart-oval.jpg': 'professional-side-part-oval.jpg',
  'crew-oval.jpg': 'short-crew-oval.jpg',
  'full-oval.jpg': 'full-beard-oval.jpg',
  'goatee-oval.jpg': 'classic-goatee-oval.jpg',
  'stubble-oval.jpg': 'designer-stubble-oval.jpg',
  'pompadour-round.jpg': 'high-volume-pompadour-round.jpg',
  'quiff-round.jpg': 'angular-quiff-round.jpg',
  'spiky-round.jpg': 'textured-spiky-round.jpg',
  'undercut-round.jpg': 'high-fade-undercut-round.jpg',
  'angular-round.jpg': 'angular-beard-round.jpg',
  'crop-square.jpg': 'textured-crop-square.jpg',
  'wavy-quiff-square.jpg': 'wavy-modern-quiff-square.jpg',
  'side-swept-square.jpg': 'side-swept-fringe-square.jpg',
  'layered-square.jpg': 'layered-medium-square.jpg',
  'rounded-square.jpg': 'rounded-beard-square.jpg',
  'boxed-square.jpg': 'short-boxed-beard-square.jpg',
  'fringe-heart.jpg': 'textured-fringe-heart.jpg',
  'deep-side-heart.jpg': 'deep-side-part-heart.jpg',
  'wavy-shag-heart.jpg': 'modern-wavy-shag-heart.jpg',
  'soft-curls-heart.jpg': 'soft-curls-heart (2).jpg',
  'full-rounded-heart.jpg': 'full-rounded-beard-heart.jpg',
  'anchor-heart.jpg': 'anchor-beard-heart.jpg',
  'circle-heart.jpg': 'circle-beard-heart.jpg',
  'full-side-oblong.jpg': 'full-side-part-oblong.jpg',
  'wide-crop-oblong.jpg': 'wide-textured-crop-oblong.jpg',
  'full-wide-oblong.jpg': 'full-wide-beard-oblong.jpg',
  'extended-boxed-oblong.jpg': 'extended-boxed-beard-oblong.jpg',
  'wide-circle-oblong.jpg': 'wide-circle-beard-oblong.jpg'
};

// Apply replacements
Object.entries(menReplacements).forEach(([oldName, newName]) => {
  const oldPath = `/styles/downloads/men/${oldName}`;
  const newPath = `/styles/downloads/men/${newName}`;
  menData = menData.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
});

// Write back
fs.writeFileSync(menDataPath, menData);
console.log('✅ Men\'s data file updated');

// Read women's data file
const womenDataPath = path.join(__dirname, '../data/womenFaceShapeStyles.ts');
let womenData = fs.readFileSync(womenDataPath, 'utf8');

// Update women's photo paths
const womenReplacements = {
  'blowout-oval.jpg': 'beach-waves-oval.jpg',
  'updo-oval.jpg': 'high-ponytail-oval.jpg',
  'v-cut-round.jpg': 'long-v-cut-layers-round.jpg',
  'pixie-round.jpg': 'layered-pixie-round.jpg',
  'side-part-round.jpg': 'deep-side-part-round.jpg',
  'volume-treatment-round.jpg': 'volume-boost-round.jpg',
  'high-volume-round.jpg': 'texturizing-round.jpg',
  'textured-updo-round.jpg': 'texturizing-round.jpg',
  'wavy-lob-square.jpg': 'soft-wavy-lob-square.jpg',
  'shag-square.jpg': 'layered-shag-square.jpg',
  'side-swept-square.jpg': 'side-swept-bangs-square.jpg',
  'moisture-square.jpg': 'intensive-moisture-square.jpg',
  'long-waves-heart.jpg': 'long-wavy-heart.jpg',
  'side-bangs-heart.jpg': 'side-bangs-layers-heart.jpg',
  'chin-bob-heart.jpg': 'chin-length-bob-heart.jpg',
  'face-framing-heart.jpg': 'face-framing-texturizing-heart.jpg',
  'dimensional-heart.jpg': 'dimensional-color-heart.jpg',
  'lowlights-heart.jpg': 'face-framing-lowlights-heart.jpg',
  'half-up-heart.jpg': 'half-up-half-down-heart.jpg',
  'medium-diamond.jpg': 'medium-length-cut-diamond.jpg',
  'side-part-diamond.jpg': 'side-part-layers-diamond.jpg',
  'gloss-diamond.jpg': 'gloss-shine-diamond.jpg',
  'protein-diamond.jpg': 'protein-treatment-diamond.jpg',
  'dimensional-diamond.jpg': 'dimensional-highlights-diamond.jpg',
  'color-melt-diamond.jpg': 'subtle-color-melt-diamond.jpg',
  'wavy-bob-oblong.jpg': 'wavy-chin-length-bob-oblong.jpg',
  'side-bangs-oblong.jpg': 'side-bangs-volume-oblong.jpg',
  'layered-oblong.jpg': 'layered-medium-cut-oblong.jpg',
  'width-texturizing-oblong.jpg': 'volume-boost-oblong.jpg',
  'half-up-oblong.jpg': 'half-up-volume-oblong.jpg'
};

// Apply replacements
Object.entries(womenReplacements).forEach(([oldName, newName]) => {
  const oldPath = `/styles/downloads/women/${oldName}`;
  const newPath = `/styles/downloads/women/${newName}`;
  womenData = womenData.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
});

// Write back
fs.writeFileSync(womenDataPath, womenData);
console.log('✅ Women\'s data file updated');

console.log('\n🎯 NEXT STEPS:');
console.log('1. Rename "soft-curls-heart (2).jpg" to "soft-curls-heart.jpg"');
console.log('2. Start your server: npm run dev-https');
console.log('3. Test the style advisor');
console.log('\n✅ All photo paths updated to match your actual files!');
