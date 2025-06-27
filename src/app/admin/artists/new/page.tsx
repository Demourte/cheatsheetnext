"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ArtistForm from "@/components/ArtistForm";
import { Artist } from "@/data/artistTypes";

export default function NewArtistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Initial empty artist
  const emptyArtist: Partial<Artist> = {
    firstName: "",
    lastName: "",
    name: "",
    id: "",
    imagePath: "",
    prompt: "",
    category: [],
  };
  
  // Handle form submission
  const handleSubmit = async (artistData: Partial<Artist>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Remove firstName/lastName before sending to API
      const { firstName, lastName, ...submitData } = artistData;
      
      const response = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create artist");
      }
      
      // Navigate back to settings page with artists tab active
      router.push("/settings?tab=artists");
      router.refresh();
    } catch (err) {
      setError("Error creating artist: " + (err instanceof Error ? err.message : String(err)));
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push("/settings?tab=artists");
  };
  
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add New Artist</h1>
        </div>
        
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}
        
        <div className="bg-base-100 p-6 rounded-lg shadow-md">
          <ArtistForm
            artist={emptyArtist}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            isEditing={false}
          />
        </div>
      </main>
    </div>
  );
}
