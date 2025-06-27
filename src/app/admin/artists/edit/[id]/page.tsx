"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ArtistForm from "@/components/ArtistForm";
import { Artist } from "@/data/artistTypes";

export default function EditArtistPage({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<Partial<Artist> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Fetch artist data
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`/api/artists/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch artist: ${response.statusText}`);
        }
        
        const data = await response.json();
        setArtist(data);
        setError(null);
      } catch (err) {
        setError("Error loading artist: " + (err instanceof Error ? err.message : String(err)));
        setArtist(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtist();
  }, [params.id]);
  
  // Handle form submission
  const handleSubmit = async (updatedArtist: Partial<Artist>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Make sure we're not sending firstName/lastName to the API
      const { firstName, lastName, ...artistData } = updatedArtist;
      
      const response = await fetch(`/api/artists/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artistData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update artist: ${response.statusText}`);
      }
      
      // Navigate back to settings page with artists tab active
      router.push("/settings?tab=artists");
      router.refresh();
    } catch (err) {
      setError("Error updating artist: " + (err instanceof Error ? err.message : String(err)));
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push("/settings?tab=artists");
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Edit Artist</h1>
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }
  
  if (error || !artist) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Edit Artist</h1>
        <div className="alert alert-error">
          <span>{error || "Artist not found"}</span>
        </div>
        <div className="mt-4">
          <button 
            className="btn btn-primary" 
            onClick={() => router.push("/settings?tab=artists")}
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Artist</h1>
        </div>
        
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}
        
        <div className="bg-base-100 p-6 rounded-lg shadow-md">
          <ArtistForm
            artist={artist}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            isEditing={true}
          />
        </div>
      </main>
    </div>
  );
}
