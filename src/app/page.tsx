"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ArtistFilters from "@/components/ArtistFilters";
import ArtistGrid from "@/components/ArtistGrid";
import AlphabetFilter from "@/components/AlphabetFilter";
import Pagination from "@/components/Pagination";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import { artists } from "@/data/artists";
import { filterArtists, getAllCategories } from "@/utils/artistUtils";
import { Palette } from "lucide-react";

export default function Home() {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<string>("grid");
  
  // Get all categories from artists data
  const allCategories = getAllCategories(artists);
  
  // Filter artists based on current filters
  const filteredArtists = filterArtists(artists, searchTerm, selectedCategories, selectedLetter);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredArtists.length / pageSize);
  const paginatedArtists = filteredArtists.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedLetter, pageSize]);
  
  // Handler to clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedLetter(null);
    setCurrentPage(1);
  };
  
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <BackToTop />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={28} className="text-primary" />
          <h1 className="text-2xl font-bold">Artist Styles</h1>
        </div>
        
        <div className="space-y-6">
          {/* Filters and search */}
          <ArtistFilters 
            categories={allCategories}
            selectedCategories={selectedCategories}
            searchTerm={searchTerm}
            onCategoryChange={setSelectedCategories}
            onSearchChange={setSearchTerm}
            onClearFilters={clearFilters}
            totalArtists={artists.length}
            filteredCount={filteredArtists.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {/* Alphabet filter */}
          <div className="bg-base-100 p-4 rounded-lg shadow-md">
            <AlphabetFilter 
              letters={"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')}
              selectedLetter={selectedLetter}
              onLetterChange={setSelectedLetter}
              letterCounts={Object.fromEntries(
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(letter => [
                  letter,
                  artists.filter(artist => artist.name.charAt(0).toUpperCase() === letter).length
                ])
              )}
            />
          </div>
          
          {/* Artist grid/list */}
          <ArtistGrid 
            artists={paginatedArtists}
            onClearFilters={clearFilters}
            totalArtists={artists.length}
            viewMode={viewMode}
          />
          
          {/* Pagination */}
          {filteredArtists.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={filteredArtists.length}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
