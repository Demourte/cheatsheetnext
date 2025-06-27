const fs = require('fs');
const path = require('path');

// Read the original data.js file
const originalDataPath = '/home/james/ghekodev/cheatsheet/src/data.js';
const originalData = fs.readFileSync(originalDataPath, 'utf8');

// Extract the raw artist data by evaluating the JavaScript
// This is a safer approach than trying to parse it as JSON
const vm = require('vm');
const context = {};
vm.createContext(context);
vm.runInContext(originalData, context);

// Now context.data should contain the array of artists
if (!context.data || !Array.isArray(context.data)) {
  console.error('Failed to extract artist data from data.js');
  process.exit(1);
}

const artists = context.data;
console.log(`Successfully extracted ${artists.length} artists from data.js`);

// Helper function to generate a more descriptive prompt
function generateDetailedPrompt(artist) {
  // Always generate a detailed prompt, regardless of what's in the original data
  // We're not using the original prompt anymore
  
  // Extract useful information from categories
  const categories = artist.Category ? artist.Category.split(', ').filter(Boolean) : [];
  
  // Extract art mediums (painting, illustration, etc)
  const mediums = categories.filter(cat => [
    'Painting', 'Illustration', 'Photography', 'Sculpture', 'Comic', 
    'Concept Art', 'Watercolor', 'Oil', 'Acrylic', 'Ink', 'Pastel', 
    'Gouache', 'Tempera', 'Engraving', 'Woodcut', 'Linocut', 'Print'
  ].some(medium => cat.includes(medium)));
  
  // Extract art styles
  const styles = categories.filter(cat => [
    'Surrealism', 'Expressionism', 'Impressionism', 'Cubism', 'Abstract', 
    'Pop-Art', 'Art Nouveau', 'Symbolism', 'Realism', 'Futurism', 'Baroque'
  ].some(style => cat.includes(style)));
  
  // Extract subject matter
  const subjects = categories.filter(cat => [
    'Portrait', 'Landscape', 'Still Life', 'Marine', 'Cityscape', 
    'Fantasy', 'Sci-Fi', 'Horror', 'Mythology', 'Botanical'
  ].some(subject => cat.includes(subject)));
  
  // Extract era if available
  const eraCats = categories.filter(cat => cat.includes('Century'));
  const era = eraCats.length > 0 ? eraCats[0] : '';
  
  // Build the detailed prompt
  let detailedPrompt = `artwork in the style of ${artist.Name}`;
  
  // Add mediums
  if (mediums.length > 0) {
    detailedPrompt += `, ${mediums.join(', ').toLowerCase()}`;
  }
  
  // Add styles
  if (styles.length > 0) {
    detailedPrompt += `, ${styles.join(', ')}`;
  }
  
  // Add subjects if available
  if (subjects.length > 0) {
    detailedPrompt += `, ${subjects.join(', ').toLowerCase()}`;
  }
  
  // Add era if available
  if (era) {
    detailedPrompt += `, ${era}`;
  }
  
  // Add country if available
  const countryCat = categories.find(cat => 
    !cat.includes('Century') && 
    !mediums.includes(cat) && 
    !styles.includes(cat) && 
    !subjects.includes(cat) &&
    cat !== 'B&W' && 
    cat !== 'Cover Art' &&
    cat !== 'Character Design' &&
    cat !== 'Game Art'
  );
  
  if (countryCat) {
    detailedPrompt += `, ${countryCat}`;
  }
  
  return detailedPrompt;
}

// Convert to the new format
const convertedArtists = artists.map(artist => {
  // Generate an ID from the name (replace spaces with hyphens, remove special characters)
  const id = artist.Name.replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-')
                      .trim();
  
  // Map the categories
  const categories = artist.Category ? artist.Category.split(', ').filter(Boolean) : [];
  
  return {
    id,
    name: artist.Name,
    imagePath: artist.Image ? `/artists/${artist.Image}` : null,
    prompt: generateDetailedPrompt(artist),
    category: categories, // Keep all categories
    birthYear: artist.Born ? parseInt(artist.Born, 10) : null,
    deathYear: artist.Death ? parseInt(artist.Death, 10) : null,
    notes: artist.Extrainfo || null
  };
});

// Write the converted data to the new JSON file
const outputPath = '/home/james/ghekodev/sd-helper/src/data/artists.json';
fs.writeFileSync(outputPath, JSON.stringify(convertedArtists, null, 2), 'utf8');

console.log(`Converted ${convertedArtists.length} artists to the new format.`);
console.log(`Output saved to: ${outputPath}`);
