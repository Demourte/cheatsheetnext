"use client";

import { useState, useEffect } from "react";
import { Settings, Info, Users, Plus, Trash2, Edit, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Artist } from "@/data/artistTypes";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam === 'artists' ? 'artists' : 'about');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  
  // Load all artists when on the artists tab
  useEffect(() => {
    if (activeTab === "artists") {
      fetchArtists();
    }
  }, [activeTab]);
  
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

  // Content components for each tab
  const AboutContent = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">About CheatsheetNext</h2>
        <p className="mb-4">
          Welcome to <span className="font-bold">CheatsheetNext</span>! We've taken the beloved Stable Diffusion Cheatsheet and given it a fresh, modern makeover. 
          Our goal? To make your AI art creation process smoother and more enjoyable than ever.
        </p>
        <p className="mb-4">
          We've rebuilt everything from the ground up with Next.js and TypeScript, creating a faster, more responsive experience that works beautifully on any device. 
          The new interface is cleaner, more intuitive, and designed with both beginners and power users in mind.
        </p>
        <p className="mb-4">
          Behind the scenes, we're still using simple JSON files to store all your data - no complicated databases required. 
          This keeps things lightweight and makes the app super easy to deploy and maintain.
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-3">What's New</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>🎨 <span className="font-medium">Vertical Navigation</span> - Easier access to settings and utilities with our new sidebar design</li>
          <li>🔍 <span className="font-medium">Enhanced Search</span> - Find exactly what you need with multi-category filtering and instant results</li>
          <li>📊 <span className="font-medium">Utility Suite</span> - New tools for calculating dimensions, visualizing aspect ratios, and generating prompts</li>
          <li>⚙️ <span className="font-medium">Centralized Management</span> - All artist administration now in one convenient location</li>
          <li>📱 <span className="font-medium">Responsive Design</span> - A beautiful experience on everything from phones to desktop monitors</li>
          <li>🌓 <span className="font-medium">Dark/Light Themes</span> - Easy on the eyes, day or night</li>
          <li>♿ <span className="font-medium">Accessibility</span> - Improved keyboard navigation and screen reader support</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-3">Credits</h3>
        <p className="mb-4">
          A huge thank you to SupaGruen for creating the original Stable Diffusion Cheatsheet that inspired this project! 
          Their work has been an incredible resource for the AI art community, and we're honored to build upon that foundation 
          with our modern interface and expanded features.
        </p>
        
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Technologies Used</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h5 className="font-medium">Frontend</h5>
                <ul className="list-disc list-inside space-y-1">
                  <li>Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>DaisyUI</li>
                  <li>Lucide Icons</li>
                </ul>
              </div>
            </div>
            
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h5 className="font-medium">Original Credits</h5>
                <ul className="list-disc list-inside space-y-1">
                  <li><a href="https://github.com/verlok/vanilla-lazyload" target="new">Vanilla LazyLoad (MIT)</a></li>
                  <li><a href="https://github.com/mattiasw/ExifReader" target="new">ExifReader (MPL-2.0)</a></li>
                  <li><a href="https://github.com/himuro-majika/Stable_Diffusion_image_metadata_viewer" target="new">Stable Diffusion Image Metadata Viewer (MIT)</a></li>
                  <li><a href="https://fonts.google.com/specimen/Roboto" target="new">Google Font Roboto (Apache-2.0)</a></li>
                  <li><a href="https://github.com/ionic-team/ionicons" target="new">SVG Icons from Ionicons (MIT)</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <a 
          href="https://github.com/SupaGruen/StableDiffusion-CheatSheet" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
        >
          <Github size={16} className="mr-2" />
          <span className="ml-1">Original Project</span>
        </a>
      </div>
    </div>
  );

  const ManageArtistsContent = () => {
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
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Artists</h2>
          <Link href="/admin/artists/new" className="btn btn-primary">
            <Plus size={16} className="mr-2" />
            Add New Artist
          </Link>
        </div>
        
        {/* Search and filter */}
        <div className="bg-base-200 p-4 rounded-lg mb-6">
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
                              onClick={() => deleteArtist(artist.id)}
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
      </div>
    );
  };


  // Render the active tab content
  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutContent />;
      case "artists":
        return <ManageArtistsContent />;
      default:
        return <AboutContent />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings size={28} className="text-primary" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="space-y-6 md:space-y-0 md:flex md:flex-row md:gap-6">
          {/* Vertical Tab Navigation */}
          <div className="w-full md:w-64 bg-base-100 rounded-lg shadow-md p-4">
            <ul className="menu menu-vertical w-full p-0">
              <li>
                <button 
                  className={activeTab === "about" ? "active" : ""}
                  onClick={() => setActiveTab("about")}
                >
                  <Info size={18} />
                  About
                </button>
              </li>
              <li>
                <button 
                  className={activeTab === "artists" ? "active" : ""}
                  onClick={() => setActiveTab("artists")}
                >
                  <Users size={18} />
                  Manage Artists
                </button>
              </li>
            </ul>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 bg-base-100 rounded-lg shadow-md">
            {renderContent()}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
