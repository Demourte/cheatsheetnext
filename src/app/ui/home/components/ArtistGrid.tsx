import { Artist } from "@/app/lib/data/artistTypes";
import ArtistCard from "./ArtistCard";
import Image from "next/image";
import { List, AlertCircle, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/app/common/components/ToastProvider";
import { useState } from "react";

interface ArtistGridProps {
  artists: Artist[];
  onClearFilters: () => void;
  totalArtists: number;
  viewMode: string;
}

export default function ArtistGrid({
  artists,
  onClearFilters,
  totalArtists,
  viewMode
}: ArtistGridProps) {
  const { showToast } = useToast();
  const [copyingArtistId, setCopyingArtistId] = useState<string | null>(null);
  const [copiedArtistId, setCopiedArtistId] = useState<string | null>(null);
  
  const copyPrompt = (artist: Artist) => {
    // Set copying state
    setCopyingArtistId(artist.id);
    
    // Simulate a small delay for the copy operation
    setTimeout(() => {
      navigator.clipboard.writeText(artist.prompt)
        .then(() => {
          // Set copied state
          setCopyingArtistId(null);
          setCopiedArtistId(artist.id);
          showToast(`Copied ${artist.name}'s prompt to clipboard`, 'success');
          
          // Reset back to idle state after 1.5 seconds
          setTimeout(() => {
            setCopiedArtistId(null);
          }, 1500);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          showToast("Failed to copy to clipboard", "error");
          setCopyingArtistId(null);
        });
    }, 400); // Small delay to show the spinner
  };
  // If no artists match the filters
  if (artists.length === 0) {
    return (
      <>
        <div className="bg-base-100 p-8 rounded-lg shadow-md text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-warning" />
          <h3 className="text-xl font-bold mb-2">No artists found</h3>
          <p className="mb-4">No artists match your current filters.</p>
          <button 
            className="btn btn-primary"
            onClick={onClearFilters}
          >
            Clear filters
          </button>
        </div>
      </>
    );
  }
  
  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {artists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      ) : (
        <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="w-16">Image</th>
                <th>Name</th>
                <th>Categories</th>
                <th className="w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map(artist => (
                <tr key={artist.id}>
                  <td>
                    <div className="relative h-12 w-12 overflow-hidden rounded">
                      <Image
                        src={artist.imagePath || '/images/placeholder.jpg'}
                        alt={artist.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td>
                    <span className="font-medium">{artist.name}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {artist.category.slice(0, 3).map(cat => (
                        <span key={cat} className="badge badge-sm">{cat}</span>
                      ))}
                      {artist.category.length > 3 && (
                        <span className="badge badge-sm">+{artist.category.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline btn-primary" 
                      onClick={() => copyPrompt(artist)}
                      title="Copy prompt"
                      disabled={copyingArtistId === artist.id || copiedArtistId === artist.id}
                    >
                      {copyingArtistId === artist.id && (
                        <span className="loading loading-spinner loading-xs"></span>
                      )}
                      {copiedArtistId === artist.id && (
                        <CheckCircle size={16} className="text-success" />
                      )}
                      {copyingArtistId !== artist.id && copiedArtistId !== artist.id && (
                        <Copy size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
