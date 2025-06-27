import { extractCategories } from '@/app/lib/utils/artists/extractCategories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all unique categories from artists
    const categories = await extractCategories();
    
    // Return the categories as JSON
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { category } = await request.json();
    
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    
    // In a real app, you would save this to a database
    // For now, we'll just return success
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}
