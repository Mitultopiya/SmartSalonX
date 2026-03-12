const fs = require('fs');
const path = require('path');
const https = require('https');

// Create models directory if it doesn't exist
const modelsDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Model files to download
const models = [
  {
    name: 'tiny_face_detector_model-weights_manifest.json',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json'
  },
  {
    name: 'tiny_face_detector_model-shard1',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1'
  },
  {
    name: 'face_landmark_68_model-weights_manifest.json',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json'
  },
  {
    name: 'face_landmark_68_model-shard1',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1'
  },
  {
    name: 'face_recognition_model-weights_manifest.json',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json'
  },
  {
    name: 'face_recognition_model-shard1',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1'
  }
];

// Download function
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(filePath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the partial file
      console.error(`❌ Error downloading ${url}:`, err.message);
      reject(err);
    });
  });
}

// Download all models
async function downloadAllModels() {
  console.log('📥 Downloading face-api.js models...\n');
  
  try {
    for (const model of models) {
      const filePath = path.join(modelsDir, model.name);
      console.log(`⬇️  Downloading: ${model.name}`);
      
      await downloadFile(model.url, filePath);
    }
    
    console.log('\n🎉 All models downloaded successfully!');
    console.log(`📁 Models saved to: ${modelsDir}`);
    console.log('\n📋 Files downloaded:');
    models.forEach(model => {
      console.log(`   - ${model.name}`);
    });
    
  } catch (error) {
    console.error('\n❌ Failed to download models:', error.message);
    console.log('\n💡 You can download them manually from:');
    console.log('   https://github.com/justadudewhohacks/face-api.js#models');
  }
}

downloadAllModels();
