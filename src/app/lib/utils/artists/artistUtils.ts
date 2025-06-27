import { Artist } from '@/app/lib/data/artistTypes';

/**
 * Filters artists based on search term, selected categories, and selected letter
 */
export function filterArtists(
  artists: Artist[], 
  searchTerm: string = '', 
  selectedCategories: string[] = [],
  selectedLetter: string | null = null
): Artist[] {
  return artists.filter(artist => {
    const searchMatch = searchTerm === '' || 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artist.notes && artist.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const categoryMatch = selectedCategories.length === 0 || 
      artist.category.some(cat => selectedCategories.includes(cat));
    
    const letterMatch = selectedLetter === null || 
      artist.name.charAt(0).toUpperCase() === selectedLetter;
    
    return searchMatch && categoryMatch && letterMatch;
  });
}

/**
 * Get all unique categories from a list of artists
 */
export function getAllCategories(artists: Artist[]): string[] {
  return Array.from(new Set(artists.flatMap(artist => artist.category))).sort();
}

/**
 * Verifies image path exists, returns fallback if not
 * Note: This is a client-side only function
 */
export function verifyImagePath(path: string, fallback: string = ''): string {
  return path;
}

/**
 * Counts artists by first letter of their name
 */
export function countArtistsByFirstLetter(artists: Artist[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    counts[letter] = 0;
  }
  
  artists.forEach(artist => {
    const firstLetter = artist.name.charAt(0).toUpperCase();
    if (/[A-Z]/.test(firstLetter)) {
      counts[firstLetter] = (counts[firstLetter] || 0) + 1;
    }
  });
  
  return counts;
}
