const sharp = require('sharp');
const fs = require('fs');

async function processIcons() {
  try {
    const inputPath = 'logobig.png';
    
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('logobig.png not found');
      return;
    }

    // src/app/icon.png (192x192)
    await sharp(inputPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile('src/app/icon.png');
    console.log('Generated src/app/icon.png');

    // src/app/apple-icon.png (180x180) - usually with a solid background, but we'll use contain
    await sharp(inputPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .flatten({ background: '#ffffff' })
      .toFile('src/app/apple-icon.png');
    console.log('Generated src/app/apple-icon.png');

    // Generate a 32x32 png for fallback and rename it to favicon.ico (most modern browsers accept this trick, or we can just leave it to icon.png)
    // Actually, just delete the old ones in public/
    if (fs.existsSync('public/icon.png')) fs.unlinkSync('public/icon.png');
    if (fs.existsSync('public/favicon.ico')) fs.unlinkSync('public/favicon.ico');
    if (fs.existsSync('public/apple-icon.png')) fs.unlinkSync('public/apple-icon.png');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

processIcons();
