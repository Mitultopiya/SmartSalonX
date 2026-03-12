const fs = require('fs');
const path = require('path');

// Define required photos by category and face shape
const requiredPhotos = {
  'hairstyles': {
    'oval': [
      'classic-professional-1.jpg',
      'pompadour-oval.jpg',
      'quiff-oval.jpg',
      'sidepart-oval.jpg',
      'crew-oval.jpg',
      'textured-medium-diamond.jpg',
      'side-swept-diamond.jpg',
      'soft-layered-diamond.jpg',
      'layered-square.jpg',
      'side-swept-square.jpg',
      'wavy-quiff-square.jpg',
      'spiky-round.jpg',
      'pompadour-round.jpg',
      'quiff-round.jpg',
      'full-side-oblong.jpg',
      'curly-side-oblong.jpg',
      'wavy-crew-oblong.jpg',
      'wide-crop-oblong.jpg'
    ],
    'round': [
      'angular-round.jpg',
      'pompadour-round.jpg',
      'quiff-round.jpg',
      'spiky-round.jpg',
      'undercut-round.jpg'
    ],
    'square': [
      'boxed-square.jpg',
      'layered-square.jpg',
      'side-swept-square.jpg',
      'wavy-quiff-square.jpg'
    ],
    'heart': [
      'deep-side-heart.jpg',
      'fringe-heart.jpg',
      'wavy-shag-heart.jpg'
    ],
    'diamond': [
      'side-swept-diamond.jpg',
      'soft-layered-diamond.jpg',
      'textured-medium-diamond.jpg',
      'sleek-goatee-diamond.jpg'
    ],
    'oblong': [
      'full-side-oblong.jpg',
      'curly-side-oblong.jpg',
      'wavy-crew-oblong.jpg',
      'wide-crop-oblong.jpg'
    ]
  },
  'beards': {
    'oval': [
      'full-oval.jpg',
      'goatee-oval.jpg',
      'stubble-oval.jpg',
      'van-dyke-square.jpg'
    ],
    'round': [
      'angular-round.jpg',
      'extended-goatee-round.jpg',
      'heavy-stubble-round.jpg'
    ],
    'square': [
      'boxed-square.jpg',
      'rounded-square.jpg',
      'van-dyke-square.jpg'
    ],
    'heart': [
      'anchor-heart.jpg',
      'circle-heart.jpg',
      'full-rounded-heart.jpg'
    ],
    'diamond': [
      'designer-stubble-diamond.jpg',
      'sleek-goatee-diamond.jpg',
      'soul-patch-diamond.jpg',
      'van-dyke-square.jpg'
    ],
    'oblong': [
      'extended-boxed-oblong.jpg',
      'full-wide-oblong.jpg',
      'wide-circle-oblong.jpg'
    ]
  },
  'women': {
    'oval': [
      'long-layers-oval.jpg',
      'bob-oval.jpg',
      'beach-waves-oval.jpg',
      'high-ponytail-oval.jpg',
      'keratin-treatment-oval.jpg',
      'deep-conditioning-oval.jpg',
      'balayage-oval.jpg',
      'ombre-oval.jpg'
    ],
    'round': [
      'long-v-cut-layers-round.jpg',
      'angled-bob-round.jpg',
      'layered-pixie-round.jpg',
      'deep-side-part-round.jpg',
      'volume-boost-round.jpg',
      'texturizing-round.jpg',
      'vertical-highlights-round.jpg',
      'root-melt-round.jpg'
    ],
    'square': [
      'soft-wavy-lob-square.jpg',
      'layered-shag-square.jpg',
      'side-swept-bangs-square.jpg',
      'curly-bob-square.jpg',
      'smoothing-square.jpg',
      'intensive-moisture-square.jpg',
      'soft-balayage-square.jpg',
      'warm-tones-square.jpg',
      'soft-blowout-square.jpg',
      'romantic-updo-square.jpg'
    ],
    'heart': [
      'long-wavy-heart.jpg',
      'side-bangs-layers-heart.jpg',
      'chin-length-bob-heart.jpg',
      'soft-curls-heart.jpg',
      'root-volume-heart.jpg',
      'face-framing-texturizing-heart.jpg',
      'dimensional-color-heart.jpg',
      'face-framing-lowlights-heart.jpg',
      'half-up-half-down-heart.jpg',
      'side-swept-heart.jpg'
    ],
    'diamond': [
      'medium-length-cut-diamond.jpg',
      'side-part-layers-diamond.jpg',
      'textured-bob-diamond.jpg',
      'swept-back-diamond.jpg',
      'gloss-shine-diamond.jpg',
      'protein-treatment-diamond.jpg',
      'dimensional-highlights-diamond.jpg',
      'subtle-color-melt-diamond.jpg',
      'elegant-updo-diamond.jpg',
      'sleek-diamond.jpg'
    ],
    'oblong': [
      'wavy-chin-length-bob-oblong.jpg',
      'side-bangs-volume-oblong.jpg',
      'layered-medium-cut-oblong.jpg',
      'voluminous-curls-oblong.jpg',
      'volume-boost-oblong.jpg',
      'width-enhancing-texturizing-oblong.jpg',
      'horizontal-color-oblong.jpg',
      'side-highlights-oblong.jpg',
      'wide-blowout-oblong.jpg',
      'half-up-volume-oblong.jpg'
    ]
  }
};

const stylesPath = path.join(__dirname, '../public/styles');

function checkPhoto(category, filename) {
  const filePath = path.join(stylesPath, category, filename);
  
  try {
    const stats = fs.statSync(filePath);
    const fileSizeKB = stats.size / 1024;
    
    // Check if file is too small (likely placeholder)
    if (fileSizeKB < 50) {
      return {
        exists: true,
        size: fileSizeKB,
        status: 'placeholder',
        message: `⚠️  Too small (${fileSizeKB.toFixed(1)}KB) - needs replacement`
      };
    } else if (fileSizeKB > 1000) {
      return {
        exists: true,
        size: fileSizeKB,
        status: 'too-large',
        message: `⚠️  Too large (${fileSizeKB.toFixed(1)}KB) - should be under 1MB`
      };
    } else {
      return {
        exists: true,
        size: fileSizeKB,
        status: 'good',
        message: `✅ Good size (${fileSizeKB.toFixed(1)}KB)`
      };
    }
  } catch (error) {
    return {
      exists: false,
      size: 0,
      status: 'missing',
      message: `❌ Missing file`
    };
  }
}

console.log('🔍 Checking hairstyle and beard photos...\n');

let totalRequired = 0;
let totalGood = 0;
let totalMissing = 0;
let totalPlaceholder = 0;

for (const [category, faceShapes] of Object.entries(requiredPhotos)) {
  console.log(`\n📁 ${category.toUpperCase()}`);
  console.log('='.repeat(50));
  
  for (const [faceShape, photos] of Object.entries(faceShapes)) {
    console.log(`\n🎯 ${faceShape.toUpperCase()} Face (${photos.length} photos):`);
    console.log('-'.repeat(30));
    
    for (const photo of photos) {
      totalRequired++;
      const result = checkPhoto(category, photo);
      
      if (result.status === 'good') totalGood++;
      else if (result.status === 'missing') totalMissing++;
      else if (result.status === 'placeholder') totalPlaceholder++;
      
      console.log(`  ${result.message} ${photo}`);
    }
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`Total photos required: ${totalRequired}`);
console.log(`✅ Good photos: ${totalGood}`);
console.log(`❌ Missing photos: ${totalMissing}`);
console.log(`⚠️  Placeholder photos: ${totalPlaceholder}`);
console.log(`📈 Completion: ${((totalGood / totalRequired) * 100).toFixed(1)}%`);

if (totalMissing > 0 || totalPlaceholder > 0) {
  console.log('\n🚀 NEXT STEPS:');
  if (totalMissing > 0) {
    console.log(`1. Add ${totalMissing} missing photos`);
  }
  if (totalPlaceholder > 0) {
    console.log(`2. Replace ${totalPlaceholder} placeholder photos with real images`);
  }
  console.log('3. Check that all photos are between 50KB - 1MB');
  console.log('4. Restart your server to see changes');
} else {
  console.log('\n🎉 All photos are properly set up!');
}
