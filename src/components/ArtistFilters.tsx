"use client";

import { Filter, X, Search, Grid, List } from "lucide-react";
import { useState } from "react";

interface ArtistFiltersProps {
  categories: string[];
  selectedCategories: string[];
  searchTerm: string;
  onCategoryChange: (categories: string[]) => void;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
  totalArtists: number;
  filteredCount: number;
  viewMode: string;
  onViewModeChange: (mode: string) => void;
}

export default function ArtistFilters({
  categories,
  selectedCategories,
  searchTerm,
  onCategoryChange,
  onSearchChange,
  onClearFilters,
  totalArtists,
  filteredCount,
  viewMode,
  onViewModeChange
}: ArtistFiltersProps) {
  // State for category filter search
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onCategoryChange(newCategories);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Artist Inspired Styles</h1>
        
        {selectedCategories.length > 0 && (
          <button 
            onClick={onClearFilters}
            className="btn btn-sm btn-ghost rounded-full"
          >
            <X size={16} />
            <span className="ml-1">Clear filters</span>
          </button>
        )}
      </div>
      
      <div className="flex gap-2 items-center">
        {/* Main search input */}
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search artists, styles, or keywords..."
            className="input input-bordered w-full pl-10 pr-4 rounded-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          {searchTerm && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-xs btn-ghost btn-circle"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* View toggle button */}
        <button 
          className="btn btn-circle" 
          onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")}
          aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
        >
          {viewMode === "grid" ? <List size={18} /> : <Grid size={18} />}
        </button>
        
        {/* Category filter dropdown */}
        <div className="dropdown dropdown-end">
          <label 
            tabIndex={0} 
            className="btn btn-circle relative cursor-pointer"
          >
            <Filter size={18} />
            {selectedCategories.length > 0 && (
              <span className="badge badge-sm badge-primary absolute -top-1 -right-1">{selectedCategories.length}</span>
            )}
          </label>
          <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64 mt-2 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Categories</h3>
              {selectedCategories.length > 0 && (
                <button 
                  onClick={() => onCategoryChange([])} 
                  className="btn btn-xs btn-ghost"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="relative mb-3">
              <input 
                type="text" 
                placeholder="Search categories..."
                className="input input-bordered input-sm w-full pl-8"
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              {categorySearchTerm && (
                <button 
                  onClick={() => setCategorySearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-xs btn-ghost btn-circle"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto max-h-64">
              <div className="space-y-1">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-xs" 
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-sm text-center py-2 text-base-content/70">
                    No matching categories
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
