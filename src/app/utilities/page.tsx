"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import DimensionsCalculator from "@/components/DimensionsCalculator";
import PromptGenerator from "@/components/PromptGenerator";
import AspectRatioVisualizer from "@/components/AspectRatioVisualizer";
import { Calculator, Sparkles, LayoutGrid } from "lucide-react";

export default function UtilitiesPage() {
  const [activeTab, setActiveTab] = useState<string>("dimensions");
  
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Stable Diffusion Utilities</h1>
        
        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab tab-lg ${activeTab === 'dimensions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('dimensions')}
          >
            <Calculator size={18} className="mr-2" />
            Dimensions Calculator
          </button>
          <button 
            className={`tab tab-lg ${activeTab === 'prompt' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('prompt')}
          >
            <Sparkles size={18} className="mr-2" />
            Prompt Generator
          </button>
          <button 
            className={`tab tab-lg ${activeTab === 'aspect' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('aspect')}
          >
            <LayoutGrid size={18} className="mr-2" />
            Aspect Ratio Visualizer
          </button>
        </div>
        
        <div className="card bg-base-100 shadow-lg">
          {activeTab === 'dimensions' && <DimensionsCalculator />}
          {activeTab === 'prompt' && <PromptGenerator />}
          {activeTab === 'aspect' && <AspectRatioVisualizer />}
        </div>
      </main>
      
      <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-8">
        <div>
          <p>Stable Diffusion Cheatsheet - A comprehensive reference for AI image generation</p>
        </div>
      </footer>
    </div>
  );
}
