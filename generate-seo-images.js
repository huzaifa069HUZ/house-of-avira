const sharp = require('sharp');
const path = require('path');

async function generateImages() {
  const logoPath = path.join(__dirname, 'public', 'LOGO.png');
  const faviconPath = path.join(__dirname, 'src', 'app', 'icon.png');
  const ogImagePath = path.join(__dirname, 'src', 'app', 'opengraph-image.png');
  const appleIconPath = path.join(__dirname, 'src', 'app', 'apple-icon.png');

  try {
    await sharp(logoPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(faviconPath);
    console.log('Created icon.png');

    await sharp(logoPath)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toFile(appleIconPath);
    console.log('Created apple-icon.png');

    const bg = Buffer.from(
      `<svg width="1200" height="630">
        <rect width="100%" height="100%" fill="#000000" />
      </svg>`
    );
    
    const resizedLogo = await sharp(logoPath)
      .resize(600, 315, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp(bg)
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .toFile(ogImagePath);
    console.log('Created opengraph-image.png');

  } catch (err) {
    console.error('Error generating images:', err);
  }
}

generateImages();
