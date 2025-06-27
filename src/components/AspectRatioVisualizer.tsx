"use client";

import { useState } from "react";
import { LayoutGrid } from "lucide-react";

interface AspectRatioProps {
  name: string;
  ratio: string;
  width: number;
  height: number;
}

export default function AspectRatioVisualizer() {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioProps | null>(null);
  
  const aspectRatios: AspectRatioProps[] = [
    { name: "Square (1:1)", ratio: "1:1", width: 1, height: 1 },
    { name: "Portrait (2:3)", ratio: "2:3", width: 2, height: 3 },
    { name: "Portrait (3:4)", ratio: "3:4", width: 3, height: 4 },
    { name: "Portrait (4:5)", ratio: "4:5", width: 4, height: 5 },
    { name: "Landscape (3:2)", ratio: "3:2", width: 3, height: 2 },
    { name: "Landscape (4:3)", ratio: "4:3", width: 4, height: 3 },
    { name: "Widescreen (16:9)", ratio: "16:9", width: 16, height: 9 },
    { name: "Ultrawide (21:9)", ratio: "21:9", width: 21, height: 9 },
  ];
  
  const handleRatioSelect = (ratio: AspectRatioProps) => {
    setSelectedRatio(ratio);
  };
  
  // Calculate the display size while maintaining aspect ratio
  const calculateDisplaySize = (ratio: AspectRatioProps) => {
    const maxSize = 300;
    let width, height;
    
    if (ratio.width > ratio.height) {
      width = maxSize;
      height = (maxSize * ratio.height) / ratio.width;
    } else {
      height = maxSize;
      width = (maxSize * ratio.width) / ratio.height;
    }
    
    return { width, height };
  };
  
  return (
    <div className="card-body">
      <h2 className="card-title flex items-center">
        <LayoutGrid size={20} className="mr-2" />
        Aspect Ratio Visualizer
      </h2>
      
      <p className="text-sm mb-4">
        Visualize different aspect ratios to help choose the right dimensions for your images.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.ratio}
            className={`btn btn-sm ${selectedRatio?.ratio === ratio.ratio ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleRatioSelect(ratio)}
          >
            {ratio.name}
          </button>
        ))}
      </div>
      
      {selectedRatio && (
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="font-semibold">{selectedRatio.name}</span>
            <p className="text-sm opacity-70">
              Width : Height = {selectedRatio.width} : {selectedRatio.height}
            </p>
          </div>
          
          <div 
            className="border-2 border-primary bg-base-200 flex items-center justify-center"
            style={{
              width: `${calculateDisplaySize(selectedRatio).width}px`,
              height: `${calculateDisplaySize(selectedRatio).height}px`,
            }}
          >
            <div className="text-xs opacity-70">
              {selectedRatio.width}:{selectedRatio.height}
            </div>
          </div>
          
          <div className="mt-4 text-sm">
            <p>Common resolutions for {selectedRatio.name}:</p>
            <ul className="list-disc list-inside mt-2">
              {[512, 768, 1024, 1152, 1536].map(baseSize => {
                let width, height;
                if (selectedRatio.width > selectedRatio.height) {
                  height = baseSize;
                  width = Math.round((baseSize * selectedRatio.width) / selectedRatio.height);
                } else {
                  width = baseSize;
                  height = Math.round((baseSize * selectedRatio.height) / selectedRatio.width);
                }
                return (
                  <li key={baseSize}>
                    {width} × {height} pixels
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
