// Type definitions for artist data
export interface Artist {
  id: string;
  name: string;
  imagePath: string;
  prompt: string;
  category: string[];
  birthYear?: number | null;
  deathYear?: number | null;
  notes?: string;
  // Extended fields for form handling
  firstName?: string;
  lastName?: string;
}
