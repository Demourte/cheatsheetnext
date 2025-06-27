"use client";

import { useState, useEffect, useRef } from "react";
import { Artist } from "@/app/lib/data/artistTypes";

interface ArtistFormProps {
  artist: Partial<Artist>;
  onSubmit: (artist: Partial<Artist>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing?: boolean;
}

// Extended artist interface with first and last name
interface ExtendedArtistForm extends Partial<Artist> {
  firstName?: string;
  lastName?: string;
}

export default function ArtistForm({
  artist,
  onSubmit,
  isSubmitting,
  onCancel,
  isEditing = false
}: ArtistFormProps) {
  // Split the name into first and last name when initializing
  const initializeNameFields = (artistData: Partial<Artist>): ExtendedArtistForm => {
    const extendedData: ExtendedArtistForm = { ...artistData };
    
    if (artistData.name) {
      // Handle comma format (Last, First) or space format (First Last)
      if (artistData.name.includes(',')) {
        const [lastName, firstName] = artistData.name.split(',').map(part => part.trim());
        extendedData.firstName = firstName;
        extendedData.lastName = lastName;
      } else {
        const nameParts = artistData.name.trim().split(' ');
        if (nameParts.length > 1) {
          extendedData.firstName = nameParts.slice(0, -1).join(' ');
          extendedData.lastName = nameParts[nameParts.length - 1];
        } else {
          extendedData.firstName = artistData.name;
          extendedData.lastName = '';
        }
      }
    } else {
      extendedData.firstName = '';
      extendedData.lastName = '';
    }
    
    return extendedData;
  };
  
  const [formData, setFormData] = useState<ExtendedArtistForm>(initializeNameFields(artist));
  const [categoryInput, setCategoryInput] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Update form data when artist prop changes
  useEffect(() => {
    setFormData(initializeNameFields(artist));
  }, [artist]);
  
  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setAvailableCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    // If first name or last name changes, update the full name and ID
    if (name === "firstName" || name === "lastName") {
      // Update the full name
      const firstName = name === "firstName" ? value : formData.firstName || '';
      const lastName = name === "lastName" ? value : formData.lastName || '';
      
      // Format the name as "Last, First"
      if (firstName && lastName) {
        newFormData.name = `${lastName}, ${firstName}`;
      } else if (lastName) {
        newFormData.name = lastName;
      } else if (firstName) {
        newFormData.name = firstName;
      } else {
        newFormData.name = '';
      }
      
      // Auto-generate ID if not editing
      if (!isEditing) {
        newFormData.id = generateIdFromName(firstName, lastName);
      }
    }
    
    setFormData(newFormData);
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };
  
  // Handle category input changes and filter suggestions
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoryInput(value);
    
    // Filter categories based on input
    if (value.trim()) {
      const filtered = availableCategories.filter(category =>
        category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCategories([]);
      setShowSuggestions(false);
    }
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (category: string) => {
    setCategoryInput(category);
    setShowSuggestions(false);
  };
  
  // Handle click outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Add a category
  const addCategory = () => {
    if (!categoryInput.trim()) return;
    
    const newCategory = categoryInput.trim();
    if (!formData.category?.includes(newCategory)) {
      setFormData({
        ...formData,
        category: [...(formData.category || []), newCategory]
      });
    }
    
    setCategoryInput("");
  };
  
  // Remove a category
  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      category: formData.category?.filter(c => c !== category) || []
    });
  };
  
  // Generate an ID from first and last name
  const generateIdFromName = (firstName: string, lastName: string): string => {
    if (!firstName && !lastName) return '';
    
    // Format as LastName-FirstName
    let id = '';
    
    if (lastName) {
      id = lastName.replace(/[^\w\s]/gi, ''); // Remove special characters
    }
    
    if (firstName) {
      if (id) id += '-';
      id += firstName.replace(/[^\w\s]/gi, ''); // Remove special characters
    }
    
    // Convert to lowercase and replace spaces with hyphens
    return id.toLowerCase().replace(/\s+/g, '-');
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Check required fields
    if (!formData.name) {
      errors.firstName = "First or last name is required";
      errors.lastName = "First or last name is required";
    }
    
    if (!formData.id) {
      errors.id = "ID is required";
    }
    
    if (!formData.prompt) {
      errors.prompt = "Prompt is required";
    }
    
    // Check if categories exist
    if (!formData.category || formData.category.length === 0) {
      errors.category = "At least one category is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Remove firstName and lastName from the submitted data
    const { firstName: _firstName, lastName: _lastName, ...submissionData } = formData;
    
    onSubmit(submissionData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            name="firstName"
            className={`input input-bordered w-full ${formErrors.firstName ? 'input-error' : ''}`}
            value={formData.firstName || ''}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {formErrors.firstName && (
            <label className="label">
              <span className="label-text-alt text-error">{formErrors.firstName}</span>
            </label>
          )}
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            name="lastName"
            className={`input input-bordered w-full ${formErrors.lastName ? 'input-error' : ''}`}
            value={formData.lastName || ''}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {formErrors.lastName && (
            <label className="label">
              <span className="label-text-alt text-error">{formErrors.lastName}</span>
            </label>
          )}
        </div>
      </div>
      
      {/* Full Name (Generated) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full bg-base-200"
          value={formData.name || ''}
          readOnly
          disabled
        />
        <label className="label">
          <span className="label-text-alt">Automatically formatted as "Last, First"</span>
        </label>
      </div>
      
      {/* ID */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">ID</span>
        </label>
        <input
          type="text"
          name="id"
          className={`input input-bordered w-full ${formErrors.id ? 'input-error' : ''} ${isEditing ? 'bg-base-200' : ''}`}
          value={formData.id || ''}
          onChange={handleChange}
          disabled={isEditing || isSubmitting}
        />
        {formErrors.id && (
          <label className="label">
            <span className="label-text-alt text-error">{formErrors.id}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt">Used for URLs and references</span>
        </label>
      </div>
      
      {/* Image Path */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Image Path</span>
        </label>
        <input
          type="text"
          name="imagePath"
          className="input input-bordered w-full"
          value={formData.imagePath || ''}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="/artists/artist-name.webp"
        />
        <label className="label">
          <span className="label-text-alt">Path to the artist's image</span>
        </label>
      </div>
      
      {/* Prompt */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Prompt</span>
        </label>
        <textarea
          name="prompt"
          className={`textarea textarea-bordered w-full h-24 ${formErrors.prompt ? 'textarea-error' : ''}`}
          value={formData.prompt || ''}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {formErrors.prompt && (
          <label className="label">
            <span className="label-text-alt text-error">{formErrors.prompt}</span>
          </label>
        )}
      </div>
      
      {/* Categories */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Categories</span>
        </label>
        <div className="flex gap-2 relative">
          <input
            type="text"
            className="input input-bordered flex-1"
            value={categoryInput}
            onChange={handleCategoryInputChange}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
            onFocus={() => categoryInput.trim() && setShowSuggestions(true)}
            disabled={isSubmitting}
            placeholder="Add a category..."
          />
          
          {/* Category suggestions dropdown */}
          {showSuggestions && filteredCategories.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 mt-1 w-full bg-base-200 shadow-lg rounded-md z-10 max-h-60 overflow-y-auto"
            >
              {filteredCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 hover:bg-base-300 cursor-pointer"
                  onClick={() => handleSelectSuggestion(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={addCategory}
            disabled={isSubmitting || !categoryInput.trim()}
          >
            Add
          </button>
        </div>
        {formErrors.category && (
          <label className="label">
            <span className="label-text-alt text-error">{formErrors.category}</span>
          </label>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.category?.map(category => (
            <div key={category} className="badge badge-lg gap-2">
              {category}
              <button
                type="button"
                className="btn btn-xs btn-ghost btn-circle"
                onClick={() => removeCategory(category)}
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : isEditing ? 'Update Artist' : 'Create Artist'}
        </button>
      </div>
    </form>
  );
}
