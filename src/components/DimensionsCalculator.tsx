"use client";

import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

interface AspectRatio {
  name: string;
  ratio: string;
  width: number;
  height: number;
}

export default function DimensionsCalculator() {
  const [baseSize, setBaseSize] = useState<number>(768);
  const [aspectRatios, setAspectRatios] = useState<AspectRatio[]>([
    { name: "Square", ratio: "1:1", width: 768, height: 768 },
    { name: "Portrait", ratio: "2:3", width: 768, height: 1152 },
    { name: "Portrait", ratio: "3:4", width: 768, height: 1024 },
    { name: "Social Media", ratio: "4:5", width: 768, height: 960 },
    { name: "Landscape", ratio: "3:2", width: 1152, height: 768 },
    { name: "Landscape", ratio: "4:3", width: 1024, height: 768 },
    { name: "Widescreen", ratio: "16:9", width: 1365, height: 768 },
    { name: "Ultrawide", ratio: "21:9", width: 1792, height: 768 },
  ]);

  useEffect(() => {
    // Recalculate dimensions when baseSize changes
    const newAspectRatios = aspectRatios.map(ratio => {
      const [w, h] = ratio.ratio.split(':').map(Number);
      
      // Keep the smaller dimension at baseSize
      if (w > h) {
        return {
          ...ratio,
          width: Math.round((w / h) * baseSize),
          height: baseSize
        };
      } else {
        return {
          ...ratio,
          width: baseSize,
          height: Math.round((h / w) * baseSize)
        };
      }
    });
    
    setAspectRatios(newAspectRatios);
  }, [baseSize]);

  const handleBaseSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setBaseSize(value);
    }
  };

  return (
    <div className="card-body">
      <h2 className="card-title flex items-center">
        <Calculator size={20} className="mr-2" />
        Image Dimensions Calculator
      </h2>
      
      <p className="text-sm mb-4">
        SDXL was trained with a base resolution of 1024×1024 pixels, but works well with 768 pixels as the minimum dimension.
        Modern GPUs can handle much higher resolutions, with multiples of 64 or 128 being optimal for best results.
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4 text-center">
        {[512, 768, 1024, 1152, 1536, 2048, 3072, 4096].map(size => (
          <span 
            key={size} 
            className={`px-3 py-1 rounded-md cursor-pointer hover:bg-primary hover:text-primary-content transition-colors ${size === baseSize ? 
              'bg-primary text-primary-content' : 'bg-base-200'}`}
            onClick={() => setBaseSize(size)}
          >
            {size}
          </span>
        ))}
      </div>
      
      <div className="form-control w-full max-w-xs mb-4">
        <label className="label">
          <span className="label-text">Base size</span>
        </label>
        <input 
          type="number" 
          placeholder="Base Size" 
          className="input input-bordered w-full max-w-xs" 
          value={baseSize}
          onChange={handleBaseSizeChange}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Type</th>
              <th>Ratio</th>
              <th>Dimensions</th>
            </tr>
          </thead>
          <tbody>
            {aspectRatios.map((ratio, index) => (
              <tr key={index}>
                <td>{ratio.name}</td>
                <td>{ratio.ratio}</td>
                <td>{ratio.width} × {ratio.height}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
