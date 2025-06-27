"use client";

import { useState, Suspense } from "react";
import { Settings, Info, Users } from "lucide-react";
import Navbar from "@/app/common/components/Navbar";
import Footer from "@/app/common/components/Footer";
import { useSearchParams } from "next/navigation";
import AboutContent from "./components/AboutContent";
import ManageArtistsContent from "./components/ManageArtistsContent";

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam === 'artists' ? 'artists' : 'about');

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

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
