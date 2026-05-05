import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const photos = [
  'rayong-future',
  'ubon-future',
  'yala-future',
  'maemoh-future',
  'phuket-marine'
];

const publicPhotos = 'public/photos';

async function optimize() {
  for (const name of photos) {
    const input = path.join(publicPhotos, `${name}.png`);
    if (!fs.existsSync(input)) continue;

    console.log(`Optimizing ${name}...`);
    
    // Generate .webp
    await sharp(input)
      .webp({ quality: 82 })
      .toFile(path.join(publicPhotos, `${name}.webp`));
      
    // Generate .jpg
    await sharp(input)
      .jpeg({ quality: 82 })
      .toFile(path.join(publicPhotos, `${name}.jpg`));
      
    // Remove temporary .png
    fs.unlinkSync(input);
  }
  console.log('Done.');
}

optimize().catch(console.error);
