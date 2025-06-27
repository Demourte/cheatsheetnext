"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Trash2, Edit, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Artist } from "@/app/lib/data/artistTypes";
import ConfirmationModal from "@/app/common/components/ConfirmationModal";
import { useToast } from "@/app/common/components/ToastProvider";

export default function ManageArtistsContent() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showToast } = useToast();
  
  // Debounce search term to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load artists on component mount
  useEffect(() => {
    fetchArtists();
  }, []);

  // Fetch artists from API
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
  
  // Show delete confirmation modal
  const confirmDelete = (id: string) => {
    setArtistToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  // Delete an artist
  const deleteArtist = async () => {
    if (!artistToDelete) return;
    
    try {
      const response = await fetch(`/api/artists/${artistToDelete}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete artist");
      }
      
      // Remove from local state
      setArtists(artists.filter(artist => artist.id !== artistToDelete));
      
      // Show success toast
      showToast("Artist deleted successfully", "success");
    } catch (err) {
      setError("Error deleting artist: " + (err instanceof Error ? err.message : String(err)));
      showToast("Failed to delete artist", "error");
    } finally {
      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setArtistToDelete(null);
    }
  };

  // Get unique first letters for the alphabet filter
  const getUniqueFirstLetters = useCallback(() => {
    const letters = new Set<string>();
    artists.forEach(artist => {
      if (artist.name && artist.name.length > 0) {
        letters.add(artist.name.charAt(0).toUpperCase());
      }
    });
    return Array.from(letters).sort();
  }, [artists]);
  
  // Filter artists based on debounced search term and selected letter
  const filteredArtists = artists
    .filter(artist => {
      // Search term filter (case insensitive)
      const matchesSearch = debouncedSearchTerm === "" || 
        artist.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      // Letter filter
      const matchesLetter = selectedLetter === null || 
        artist.name.charAt(0).toUpperCase() === selectedLetter;
        
      return matchesSearch && matchesLetter;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
    
  // Clear search input
  const clearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Artists</h2>
        <Link href="/admin/artists/new" className="btn btn-primary btn-sm">
          <Plus size={16} className="mr-1" />
          Add New Artist
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      
      {/* Search and filter */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Enhanced search bar */}
        <div className="form-control w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search artists by name..." 
              className="input input-bordered w-full pl-10 pr-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X size={18} className="text-gray-500 hover:text-gray-700" />
              </button>
            )}
          </div>
        </div>
        
        {/* Alphabet filter - only show letters that have artists */}
        <div className="flex flex-wrap gap-1 justify-center">
          <button 
            className={`btn btn-sm ${selectedLetter === null ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedLetter(null)}
          >
            All
          </button>
          {getUniqueFirstLetters().map(letter => (
            <button 
              key={letter}
              className={`btn btn-sm ${selectedLetter === letter ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Artists table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Categories</th>
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
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-xs btn-outline"
                            onClick={() => router.push(`/admin/artists/edit/${artist.id}`)}
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </button>
                          <button 
                            className="btn btn-xs btn-error btn-outline"
                            onClick={() => confirmDelete(artist.id)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
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
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Artist"
        message="Are you sure you want to delete this artist? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteArtist}
        onCancel={() => setIsDeleteModalOpen(false)}
        variant="danger"
      />
    </div>
  );
}
