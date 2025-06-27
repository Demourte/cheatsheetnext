"use client";

import ArtistCard from "@/components/ArtistCard";
import { Artist } from "@/data/artistTypes";

interface ArtistGridProps {
  artists: Artist[];
  onClearFilters: () => void;
  totalArtists?: number;
  viewMode?: string;
}

export default function ArtistGrid({ 
  artists, 
  onClearFilters, 
  totalArtists = 0,
  viewMode = "grid"
}: ArtistGridProps) {
  
  return (
    <>
      {artists.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} {...artist} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} {...artist} viewMode="list" />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-lg">No artists found matching your criteria.</p>
          <button 
            onClick={onClearFilters}
            className="btn btn-sm btn-primary mt-4"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
