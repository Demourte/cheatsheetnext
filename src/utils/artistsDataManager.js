const fs = require('fs');
const path = require('path');

// Base directory for artist data files
const ARTISTS_DIR = path.join(process.cwd(), 'src/data/artists');

/**
 * Get the path to the appropriate artist file based on the first letter
 * @param {string} letter - The first letter of the artist's name
 * @returns {string} - Path to the artist file
 */
const getArtistFilePath = (letter) => {
  return path.join(ARTISTS_DIR, `artists-${letter.toLowerCase()}.json`);
};

/**
 * Get all artists (optionally filtered by letter)
 * @param {string} letter - Optional letter to filter by
 * @returns {Array} - Array of artist objects
 */
const getAllArtists = (letter = null) => {
  if (letter) {
    // Return artists for a specific letter
    const filePath = getArtistFilePath(letter);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return [];
  } else {
    // Return all artists by combining all files
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
const getArtistById = (id) => {
  // Read the index file to find which letter file contains this artist
  const indexPath = path.join(ARTISTS_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    return null;
  }
  
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const letter = index[id];
  
  if (!letter) {
    return null;
  }
  
  const filePath = getArtistFilePath(letter);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const artists = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return artists.find(artist => artist.id === id) || null;
};

/**
 * Create a new artist
 * @param {Object} artistData - Artist data
 * @returns {Object} - Created artist
 */
const createArtist = (artistData) => {
  // Ensure required fields are present
  if (!artistData.name || !artistData.id) {
    throw new Error('Artist name and ID are required');
  }
  
  // Determine which file to add the artist to
  const firstLetter = artistData.name.charAt(0).toUpperCase();
  const filePath = getArtistFilePath(firstLetter);
  
  // Read existing artists for this letter
  let artists = [];
  if (fs.existsSync(filePath)) {
    artists = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  // Check if artist with this ID already exists
  if (artists.some(artist => artist.id === artistData.id)) {
    throw new Error(`Artist with ID ${artistData.id} already exists`);
  }
  
  // Add the new artist
  artists.push(artistData);
  
  // Write back to the file
  fs.writeFileSync(filePath, JSON.stringify(artists, null, 2));
  
  // Update the index
  updateIndex(artistData.id, firstLetter.toLowerCase());
  
  return artistData;
};

/**
 * Update an existing artist
 * @param {string} id - Artist ID
 * @param {Object} artistData - Updated artist data
 * @returns {Object|null} - Updated artist or null if not found
 */
const updateArtist = (id, artistData) => {
  // Find the artist's current file
  const indexPath = path.join(ARTISTS_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    return null;
  }
  
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const currentLetter = index[id];
  
  if (!currentLetter) {
    return null;
  }
  
  const currentFilePath = getArtistFilePath(currentLetter);
  if (!fs.existsSync(currentFilePath)) {
    return null;
  }
  
  // Read current artists in this file
  let artists = JSON.parse(fs.readFileSync(currentFilePath, 'utf8'));
  
  // Find the artist to update
  const artistIndex = artists.findIndex(artist => artist.id === id);
  if (artistIndex === -1) {
    return null;
  }
  
  // If the name is changing, we might need to move the artist to a different file
  const newFirstLetter = artistData.name ? artistData.name.charAt(0).toUpperCase() : artists[artistIndex].name.charAt(0).toUpperCase();
  
  // If the artist needs to move to a different file
  if (newFirstLetter.toLowerCase() !== currentLetter) {
    // Remove from current file
    artists.splice(artistIndex, 1);
    fs.writeFileSync(currentFilePath, JSON.stringify(artists, null, 2));
    
    // Add to new file
    const newFilePath = getArtistFilePath(newFirstLetter);
    let newFileArtists = [];
    if (fs.existsSync(newFilePath)) {
      newFileArtists = JSON.parse(fs.readFileSync(newFilePath, 'utf8'));
    }
    
    // Create the updated artist object
    const updatedArtist = { ...artists[artistIndex], ...artistData };
    newFileArtists.push(updatedArtist);
    fs.writeFileSync(newFilePath, JSON.stringify(newFileArtists, null, 2));
    
    // Update the index
    updateIndex(id, newFirstLetter.toLowerCase());
    
    return updatedArtist;
  } else {
    // Update in the current file
    const updatedArtist = { ...artists[artistIndex], ...artistData };
    artists[artistIndex] = updatedArtist;
    fs.writeFileSync(currentFilePath, JSON.stringify(artists, null, 2));
    return updatedArtist;
  }
};

/**
 * Delete an artist
 * @param {string} id - Artist ID
 * @returns {boolean} - True if deleted, false if not found
 */
const deleteArtist = (id) => {
  // Find the artist's file
  const indexPath = path.join(ARTISTS_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    return false;
  }
  
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const letter = index[id];
  
  if (!letter) {
    return false;
  }
  
  const filePath = getArtistFilePath(letter);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  // Read artists in this file
  let artists = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Find the artist to delete
  const artistIndex = artists.findIndex(artist => artist.id === id);
  if (artistIndex === -1) {
    return false;
  }
  
  // Remove the artist
  artists.splice(artistIndex, 1);
  fs.writeFileSync(filePath, JSON.stringify(artists, null, 2));
  
  // Update the index
  removeFromIndex(id);
  
  return true;
};

/**
 * Update the index file with a new artist ID and letter mapping
 * @param {string} id - Artist ID
 * @param {string} letter - Letter (lowercase)
 */
const updateIndex = (id, letter) => {
  const indexPath = path.join(ARTISTS_DIR, 'index.json');
  let index = {};
  
  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  }
  
  index[id] = letter;
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
};

/**
 * Remove an artist ID from the index
 * @param {string} id - Artist ID
 */
const removeFromIndex = (id) => {
  const indexPath = path.join(ARTISTS_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    return;
  }
  
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  delete index[id];
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
};

module.exports = {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist
};
