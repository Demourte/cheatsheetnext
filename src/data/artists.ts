import { Artist } from './artistTypes';

// This file imports artist data from JSON
// Structured for easy maintenance and updates
export const artists: Artist[] = require('./artists.json');

// Export a function to get an artist by ID
export function getArtistById(id: string): Artist | undefined {
  return artists.find(artist => artist.id === id);
}
