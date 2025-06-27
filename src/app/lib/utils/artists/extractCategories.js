import fs from 'fs';
import path from 'path';

const artistsFilePath = path.join(process.cwd(), 'src/app/lib/data/artists.json');
const categoriesFilePath = path.join(process.cwd(), 'src/app/lib/data/categories.json');

async function extractCategories() {
  try {
    const artistsData = JSON.parse(fs.readFileSync(artistsFilePath, 'utf8'));
    
    const allCategories = artistsData.flatMap(artist => artist.category || []);
    
    const uniqueCategories = [...new Set(allCategories)].sort();
    
    fs.writeFileSync(categoriesFilePath, JSON.stringify(uniqueCategories, null, 2));
    
    // Successfully extracted categories
    return uniqueCategories;
  } catch (error) {
    console.error('Error extracting categories:', error);
    throw error;
  }
}

// Only run this when imported directly, not when imported as a module
if (import.meta.url === import.meta.main) {
  extractCategories();
}

export { extractCategories };
