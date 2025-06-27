import { Artist } from "@/app/lib/data/artistTypes";
import ArtistCard from "./ArtistCard";
import Image from "next/image";
import { List, AlertCircle, Copy } from "lucide-react";
import { useToast } from "@/app/common/components/Toast";

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
  const { showToast, ToastContainer } = useToast();
  
  const copyPrompt = (artist: Artist) => {
    navigator.clipboard.writeText(artist.prompt);
    showToast(`Copied ${artist.name}'s prompt to clipboard`, 'success');
  };
  // If no artists match the filters
  if (artists.length === 0) {
    return (
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
    );
  }
  
  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {artists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    );
  }
  
  // List view
  return (
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
                >
                  <Copy size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  return (
    <>
      {viewMode === 'list' && <ToastContainer />}
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
                    >
                      <Copy size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
