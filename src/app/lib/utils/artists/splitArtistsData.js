import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artistsFilePath = path.join(process.cwd(), 'src/app/lib/data/artists.json');
const artistsData = JSON.parse(fs.readFileSync(artistsFilePath, 'utf8'));

const outputDir = path.join(process.cwd(), 'src/app/lib/data/artists');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const artistsByLetter = {};
artistsData.forEach(artist => {
  const firstLetter = artist.name.charAt(0).toUpperCase();
  if (!artistsByLetter[firstLetter]) {
    artistsByLetter[firstLetter] = [];
  }
  artistsByLetter[firstLetter].push(artist);
});

const artistIndex = {};

Object.keys(artistsByLetter).sort().forEach(letter => {
  const fileName = `artists-${letter.toLowerCase()}.json`;
  const filePath = path.join(outputDir, fileName);
  
  fs.writeFileSync(filePath, JSON.stringify(artistsByLetter[letter], null, 2));
  console.log(`Created ${fileName} with ${artistsByLetter[letter].length} artists`);
  
  artistsByLetter[letter].forEach(artist => {
    artistIndex[artist.id] = letter.toLowerCase();
  });
});

const indexFilePath = path.join(outputDir, 'index.json');
fs.writeFileSync(indexFilePath, JSON.stringify(artistIndex, null, 2));
console.log(`Created index.json with ${Object.keys(artistIndex).length} entries`);

console.log('Artist data split successfully!');
