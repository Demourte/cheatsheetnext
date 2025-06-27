import fs from 'fs';
import path from 'path';

// Base directory for artist data files
// const ARTISTS_DIR = path.join(process.cwd(), 'src/app/lib/data/artists');
const ARTISTS_JSON_PATH = path.join(process.cwd(), 'src/app/lib/data/artists.json');

/**
 * Get all artists from the main JSON file
 * @returns {Array} - Array of artist objects
 */
export const getAllArtists = () => {
  try {
    if (fs.existsSync(ARTISTS_JSON_PATH)) {
      const data = fs.readFileSync(ARTISTS_JSON_PATH, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading artists data:', error);
    return [];
  }
};

/**
 * Get artist by ID
 * @param {string} id - Artist ID
 * @returns {Object|null} - Artist object or null if not found
 */
export const getArtistById = (id) => {
  try {
    const artists = getAllArtists();
    return artists.find(artist => artist.id === id) || null;
  } catch (error) {
    console.error('Error getting artist by ID:', error);
    return null;
  }
};

/**
 * Create a new artist
 * @param {Object} artistData - Artist data
 * @returns {Object} - Created artist
 */
export const createArtist = (artistData) => {
  try {
    // Ensure required fields are present
    if (!artistData.name || !artistData.id) {
      throw new Error('Artist name and ID are required');
    }
    
    // Get all artists
    const artists = getAllArtists();
    
    // Check if artist with this ID already exists
    if (artists.some(artist => artist.id === artistData.id)) {
      throw new Error(`Artist with ID ${artistData.id} already exists`);
    }
    
    // Add the new artist
    artists.push(artistData);
    
    // Write back to the file
    fs.writeFileSync(ARTISTS_JSON_PATH, JSON.stringify(artists, null, 2));
    
    return artistData;
  } catch (error) {
    console.error('Error creating artist:', error);
    throw error;
  }
};

/**
 * Update an existing artist
 * @param {string} id - Artist ID
 * @param {Object} artistData - Updated artist data
 * @returns {Object|null} - Updated artist or null if not found
 */
export const updateArtist = (id, artistData) => {
  try {
    // Get all artists
    const artists = getAllArtists();
    
    // Find the artist to update
    const artistIndex = artists.findIndex(artist => artist.id === id);
    if (artistIndex === -1) {
      return null;
    }
    
    // Update the artist
    const updatedArtist = { ...artists[artistIndex], ...artistData };
    artists[artistIndex] = updatedArtist;
    
    // Write back to the file
    fs.writeFileSync(ARTISTS_JSON_PATH, JSON.stringify(artists, null, 2));
    
    return updatedArtist;
  } catch (error) {
    console.error('Error updating artist:', error);
    throw error;
  }
};

/**
 * Delete an artist
 * @param {string} id - Artist ID
 * @returns {boolean} - True if deleted, false if not found
 */
export const deleteArtist = (id) => {
  try {
    // Get all artists
    const artists = getAllArtists();
    
    // Find the artist to delete
    const artistIndex = artists.findIndex(artist => artist.id === id);
    if (artistIndex === -1) {
      return false;
    }
    
    // Remove the artist
    artists.splice(artistIndex, 1);
    
    // Write back to the file
    fs.writeFileSync(ARTISTS_JSON_PATH, JSON.stringify(artists, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error deleting artist:', error);
    throw error;
  }
};
