const fs = require('fs');
const path = require('path');

// Read the original artists.json file
const artistsFilePath = path.join(__dirname, '../data/artists.json');
const artistsData = JSON.parse(fs.readFileSync(artistsFilePath, 'utf8'));

// Create a directory for the split files if it doesn't exist
const outputDir = path.join(__dirname, '../data/artists');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Group artists by the first letter of their name
const artistsByLetter = {};
artistsData.forEach(artist => {
  const firstLetter = artist.name.charAt(0).toUpperCase();
  if (!artistsByLetter[firstLetter]) {
    artistsByLetter[firstLetter] = [];
  }
  artistsByLetter[firstLetter].push(artist);
});

// Create an index file to map artist IDs to their respective files
const artistIndex = {};

// Write each group to a separate file
Object.keys(artistsByLetter).sort().forEach(letter => {
  const fileName = `artists-${letter.toLowerCase()}.json`;
  const filePath = path.join(outputDir, fileName);
  
  fs.writeFileSync(filePath, JSON.stringify(artistsByLetter[letter], null, 2));
  console.log(`Created ${fileName} with ${artistsByLetter[letter].length} artists`);
  
  // Add entries to the index
  artistsByLetter[letter].forEach(artist => {
    artistIndex[artist.id] = letter.toLowerCase();
  });
});

// Write the index file
const indexFilePath = path.join(outputDir, 'index.json');
fs.writeFileSync(indexFilePath, JSON.stringify(artistIndex, null, 2));
console.log(`Created index.json with ${Object.keys(artistIndex).length} entries`);

console.log('Artist data split successfully!');
