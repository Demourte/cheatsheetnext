import { NextResponse } from 'next/server';
import { getAllArtists, createArtist } from './artistsDataManager';

// GET /api/artists - Get all artists
export async function GET(request) {
  try {
    const artists = getAllArtists();
    return NextResponse.json(artists);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/artists - Create a new artist
export async function POST(request) {
  try {
    const artistData = await request.json();
    
    // Validate required fields
    if (!artistData.name || !artistData.id) {
      return NextResponse.json(
        { error: 'Artist name and ID are required' }, 
        { status: 400 }
      );
    }
    
    // Create the artist
    const newArtist = createArtist(artistData);
    return NextResponse.json(newArtist, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
