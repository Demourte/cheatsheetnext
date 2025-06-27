"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DimensionsCalculator from "@/components/DimensionsCalculator";
import PromptGenerator from "@/components/PromptGenerator";
import AspectRatioVisualizer from "@/components/AspectRatioVisualizer";
import Footer from "@/components/Footer";
import { Calculator, Sparkles, LayoutGrid } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function UtilitiesPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam || "dimensions");
  
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <LayoutGrid size={28} className="text-primary" />
          <h1 className="text-2xl font-bold">Utilities</h1>
        </div>
        
        <div className="space-y-6 md:space-y-0 md:flex md:flex-row md:gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-base-100 rounded-lg shadow-md p-4">
            <ul className="menu menu-vertical w-full p-0">
              <li>
                <button 
                  className={activeTab === 'dimensions' ? 'active' : ''}
                  onClick={() => setActiveTab('dimensions')}
                >
                  <Calculator size={18} />
                  <span>Dimensions Calculator</span>
                </button>
              </li>
              <li>
                <button 
                  className={activeTab === 'aspect' ? 'active' : ''}
                  onClick={() => setActiveTab('aspect')}
                >
                  <LayoutGrid size={18} />
                  <span>Aspect Ratio Visualizer</span>
                </button>
              </li>
              <li>
                <button 
                  className={activeTab === 'prompt' ? 'active' : ''}
                  onClick={() => setActiveTab('prompt')}
                >
                  <Sparkles size={18} />
                  <span>Prompt Generator</span>
                </button>
              </li>
            </ul>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 bg-base-100 rounded-lg shadow-lg">
            {activeTab === 'dimensions' && <DimensionsCalculator />}
            {activeTab === 'aspect' && <AspectRatioVisualizer />}
            {activeTab === 'prompt' && <PromptGenerator />}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
