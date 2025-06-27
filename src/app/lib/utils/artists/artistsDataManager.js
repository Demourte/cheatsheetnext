import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTISTS_DIR = path.join(process.cwd(), 'src/app/lib/data/artists');

/**
 * Get the path to the appropriate artist file based on the first letter
 * @param {string} letter - The first letter of the artist's name
 * @returns {string} - Path to the artist file
 */
export const getArtistFilePath = (letter) => {
  return path.join(ARTISTS_DIR, `artists-${letter.toLowerCase()}.json`);
};

/**
 * Get all artists (optionally filtered by letter)
 * @param {string} letter - Optional letter to filter by
 * @returns {Array} - Array of artist objects
 */
export const getAllArtists = (letter = null) => {
  if (letter) {
    const filePath = getArtistFilePath(letter);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return [];
  } else {
    const allArtists = [];
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    
    letters.forEach(letter => {
      const filePath = getArtistFilePath(letter);
      if (fs.existsSync(filePath)) {
        const artists = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        allArtists.push(...artists);
      }
    });
    
    return allArtists;
  }
};

/**
 * Get artist by ID
 * @param {string} id - Artist ID
 * @returns {Object|null} - Artist object or null if not found
 */
export const getArtistById = (id) => {
  const indexPath = path.join(ARTISTS_DIR, 'index.json');
  
  if (fs.existsSync(indexPath)) {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const letter = index[id];
    
    if (letter) {
      const filePath = getArtistFilePath(letter);
      if (fs.existsSync(filePath)) {
        const artists = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return artists.find(artist => artist.id === id) || null;
      }
    }
  }
  
  const allArtists = getAllArtists();
  return allArtists.find(artist => artist.id === id) || null;
};

/**
 * Save artist data
 * @param {Object} artist - Artist object to save
 * @returns {boolean} - Success status
 */
export const saveArtist = (artist) => {
  const letter = artist.name.charAt(0).toLowerCase();
  const filePath = getArtistFilePath(letter);
  
  let artists = [];
  if (fs.existsSync(filePath)) {
    artists = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  const existingIndex = artists.findIndex(a => a.id === artist.id);
  if (existingIndex >= 0) {
    artists[existingIndex] = artist;
  } else {
    artists.push(artist);
  }
  
  artists.sort((a, b) => a.name.localeCompare(b.name));
  
  fs.writeFileSync(filePath, JSON.stringify(artists, null, 2));
  
  updateArtistIndex(artist.id, letter);
  
  return true;
};

/**
 * Delete artist by ID
 * @param {string} id - Artist ID
 * @returns {boolean} - Success status
 */
export const deleteArtist = (id) => {
  // Find the artist first
  const artist = getArtistById(id);
  if (!artist) return false;
  
  const letter = artist.name.charAt(0).toLowerCase();
  const filePath = getArtistFilePath(letter);
  
  if (fs.existsSync(filePath)) {
    let artists = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    artists = artists.filter(a => a.id !== id);
    
    fs.writeFileSync(filePath, JSON.stringify(artists, null, 2));
    
    removeFromArtistIndex(id);
    
    return true;
  }
  
  return false;
};

/**
 * Update the artist index with the artist ID and its letter file
 * @param {string} id - Artist ID
 * @param {string} letter - First letter of the artist's name
 */
export const updateArtistIndex = (id, letter) => {
  const indexPath = path.join(ARTISTS_DIR, 'index.json');
  
  let index = {};
  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  }
  
  index[id] = letter.toLowerCase();
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
};

/**
 * Remove an artist ID from the index
 * @param {string} id - Artist ID
 */
export const removeFromArtistIndex = (id) => {
  const indexPath = path.join(ARTISTS_DIR, 'index.json');
  
  if (fs.existsSync(indexPath)) {
    let index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    delete index[id];
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  }
};
