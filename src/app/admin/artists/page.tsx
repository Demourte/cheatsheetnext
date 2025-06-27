"use client";

import { useState, useEffect } from "react";
import { Artist } from "@/data/artistTypes";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function ArtistAdmin() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Load all artists
  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/artists");
        
        if (!response.ok) {
          throw new Error("Failed to fetch artists");
        }
        
        const data = await response.json();
        setArtists(data);
        setError(null);
      } catch (err) {
        setError("Error loading artists: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtists();
  }, []);

  // Filter artists by search term and selected letter
  const filteredArtists = artists.filter(artist => {
    // Filter by search term
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected letter
    const matchesLetter = selectedLetter 
      ? artist.name.charAt(0).toUpperCase() === selectedLetter.toUpperCase()
      : true;
    
    return matchesSearch && matchesLetter;
  });

  // Delete an artist
  const deleteArtist = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this artist?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/artists/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete artist");
      }
      
      // Remove from local state
      setArtists(artists.filter(artist => artist.id !== id));
    } catch (err) {
      setError("Error deleting artist: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Artist Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => router.push("/admin/artists/new")}
          >
            Add New Artist
          </button>
        </div>
        
        {/* Search and filter */}
        <div className="bg-base-100 p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search artists..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select 
                className="select select-bordered w-full"
                value={selectedLetter || ""}
                onChange={(e) => setSelectedLetter(e.target.value || null)}
              >
                <option value="">All Letters</option>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => (
                  <option key={letter} value={letter.toLowerCase()}>
                    {letter}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* Artist table */}
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-md">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Categories</th>
                    <th>Years</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArtists.length > 0 ? (
                    filteredArtists.map(artist => (
                      <tr key={artist.id}>
                        <td>{artist.name}</td>
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
                          {artist.birthYear && artist.birthYear}
                          {artist.deathYear && ` - ${artist.deathYear}`}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              className="btn btn-xs btn-outline"
                              onClick={() => router.push(`/admin/artists/edit/${artist.id}`)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-xs btn-error btn-outline"
                              onClick={() => deleteArtist(artist.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No artists found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Artist count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredArtists.length} of {artists.length} artists
            </div>
          </>
        )}
      </main>
    </div>
  );
}
