const fs = require('fs');
const path = require('path');

// Read the women's styles data
const womenStylesPath = path.join(__dirname, '../../frontend/data/womenFaceShapeStyles.ts');
const content = fs.readFileSync(womenStylesPath, 'utf8');

// Extract image paths using regex
const imageRegex = /image: '([^']+)'/g;
const images = [];
let match;
while ((match = imageRegex.exec(content)) !== null) {
  images.push(match[1]);
}

console.log('Found images:', images.length);
images.forEach(img => console.log(img));

// Create placeholder images
const fsPromises = require('fs').promises;

async function createPlaceholders() {
  for (const imgPath of images) {
    const fullPath = path.join(__dirname, '../../frontend/public', imgPath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    await fsPromises.mkdir(dir, { recursive: true });
    
    // Create a simple placeholder SVG
    const svg = `<svg width='300' height='300' xmlns='http://www.w3.org/2000/svg'>
      <rect width='100%' height='100%' fill='#f0f0f0'/>
      <text x='50%' y='50%' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='#666'>
        ${path.basename(imgPath, '.jpg').replace(/-/g, ' ').toUpperCase()}
      </text>
    </svg>`;
    
    await fsPromises.writeFile(fullPath, svg);
    console.log('Created:', fullPath);
  }
}

createPlaceholders().then(() => {
  console.log('All placeholder images created successfully!');
}).catch(err => {
  console.error('Error creating placeholders:', err);
});
