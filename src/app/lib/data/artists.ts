import { Artist } from './artistTypes';

export const artists: Artist[] = require('./artists.json');

export function getArtistById(id: string): Artist | undefined {
  return artists.find(artist => artist.id === id);
}
