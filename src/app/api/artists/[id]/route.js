import { NextResponse } from 'next/server';
import { getArtistById, updateArtist, deleteArtist } from '../artistsDataManager';

// GET /api/artists/:id - Get a specific artist
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const artist = getArtistById(id);
    
    if (!artist) {
      return NextResponse.json(
        { error: `Artist with ID ${id} not found` }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(artist);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/artists/:id - Update an artist
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const artistData = await request.json();
    
    const updatedArtist = updateArtist(id, artistData);
    
    if (!updatedArtist) {
      return NextResponse.json(
        { error: `Artist with ID ${id} not found` }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedArtist);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/artists/:id - Delete an artist
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deleted = deleteArtist(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: `Artist with ID ${id} not found` }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
