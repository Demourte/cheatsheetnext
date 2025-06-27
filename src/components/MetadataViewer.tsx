"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import ExifReader from "exifreader";

// Define types for ExifReader tags
type ExifTag = {
  id?: number;
  description: string;
  value?: any;
};

type ExifTags = {
  [key: string]: ExifTag | undefined;
};

type TagsResult = {
  exif?: ExifTags;
  iptc?: Record<string, ExifTag>;
  xmp?: Record<string, any>;
  pngText?: Record<string, ExifTag>;
};

export default function MetadataViewer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-primary");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary");
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setImageFile(file);
    setError(null);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
        extractMetadata(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const extractMetadata = async (file: File) => {
    try {
      // Get the array buffer from the file
      const arrayBuffer = await file.arrayBuffer();
      
      // Use ExifReader to extract metadata
      const tags = ExifReader.load(arrayBuffer, { expanded: true }) as TagsResult;
      
      // Get image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise(resolve => {
        img.onload = resolve;
      });
      
      // Initialize metadata object
      let extractedMetadata: Record<string, any> = {
        "Size": `${img.width}x${img.height}`,
        "Date": new Date().toISOString().split('T')[0]
      };
      
      // Track if we found any Stable Diffusion metadata
      let foundSDMetadata = false;
      
      // Look for Stable Diffusion metadata in different locations
      // 1. Check in EXIF description
      if (tags.exif && 'ImageDescription' in tags.exif && tags.exif.ImageDescription?.description) {
        foundSDMetadata = extractStableDiffusionParams(tags.exif.ImageDescription.description, extractedMetadata) || foundSDMetadata;
      }
      
      // 2. Check in XMP metadata (multiple possible locations)
      if (tags.xmp) {
        // Check common XMP fields where SD might store data
        const xmpFields = ['parameters', 'comment', 'description', 'title', 'subject', 'userComment'];
        
        for (const field of xmpFields) {
          const xmpField = tags.xmp[field];
          if (typeof xmpField === 'string') {
            foundSDMetadata = extractStableDiffusionParams(xmpField, extractedMetadata) || foundSDMetadata;
          } else if (xmpField && typeof xmpField === 'object' && 'description' in xmpField) {
            foundSDMetadata = extractStableDiffusionParams(xmpField.description as string, extractedMetadata) || foundSDMetadata;
          }
        }
      }
      
      // 3. Check in PNG text chunks (common in Stable Diffusion)
      if (tags.pngText) {
        for (const key in tags.pngText) {
          const pngField = tags.pngText[key];
          if (pngField && pngField.description) {
            foundSDMetadata = extractStableDiffusionParams(pngField.description, extractedMetadata) || foundSDMetadata;
          }
        }
      }
      
      // 4. Check in IPTC metadata
      if (tags.iptc) {
        const iptcFields = ['Caption/Abstract', 'ObjectName', 'Keywords', 'SpecialInstructions'];
        
        for (const field of iptcFields) {
          const iptcField = tags.iptc[field];
          if (iptcField && iptcField.description) {
            foundSDMetadata = extractStableDiffusionParams(iptcField.description, extractedMetadata) || foundSDMetadata;
          }
        }
      }
      
      // 5. Check in EXIF UserComment and other fields
      if (tags.exif && 'UserComment' in tags.exif && tags.exif.UserComment?.description) {
        foundSDMetadata = extractStableDiffusionParams(tags.exif.UserComment.description, extractedMetadata) || foundSDMetadata;
      }
      
      // Add basic file info regardless
      extractedMetadata["Filename"] = file.name;
      extractedMetadata["File type"] = file.type;
      extractedMetadata["File size"] = formatFileSize(file.size);
      
      // Add a note if no SD metadata was found
      if (!foundSDMetadata) {
        extractedMetadata["Note"] = "No Stable Diffusion prompt data found in this image. The metadata may have been stripped when the image was saved or edited.";
        
        // Add any available basic image info
        const exif = tags.exif;
        if (exif) {
          // Safely check for EXIF fields
          const exifFields = ['Make', 'Model', 'Software'];
          exifFields.forEach(field => {
            if (field in exif && exif[field]?.description) {
              extractedMetadata[field] = exif[field]!.description;
            }
          });
        }
      }
      
      setMetadata(extractedMetadata);
    } catch (err) {
      console.error("Error extracting metadata:", err);
      setError("Could not extract metadata from this image");
      setMetadata(null);
    }
  };
  
  // Helper function to extract Stable Diffusion parameters from text
  // Returns true if any SD parameters were found
  const extractStableDiffusionParams = (text: string, metadata: Record<string, any>): boolean => {
    if (!text) return false;
    
    // Check if this is ComfyUI metadata (JSON format)
    if (text.includes('"properties"') && text.includes('"widgets_values"')) {
      return extractComfyUIMetadata(text, metadata);
    }
    
    // Common patterns in Stable Diffusion metadata
    const patterns = {
      "Prompt": /(?:^|\n)(?!Negative prompt:)([\s\S]+?)(?=\nNegative prompt:|\nSteps:|$)/,
      "Negative prompt": /Negative prompt:([\s\S]+?)(?=\nSteps:|$)/,
      "Steps": /Steps: (\d+)/,
      "Sampler": /Sampler: ([\w\s+]+)/,
      "CFG scale": /CFG scale: ([\d\.]+)/,
      "Seed": /Seed: (\d+)/,
      "Model": /Model: ([\w\s\d\.\-_]+)/
    };
    
    let foundAny = false;
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        metadata[key] = match[1].trim();
        foundAny = true;
      }
    }
    
    // Try to extract size if not already present
    if (!metadata["Size"]) {
      const sizeMatch = text.match(/Size: (\d+x\d+)/i) || text.match(/(\d+x\d+)/i);
      if (sizeMatch && sizeMatch[1]) {
        metadata["Size"] = sizeMatch[1];
      }
    }
    
    return foundAny;
  };
  
  // Helper function to extract metadata from ComfyUI JSON format
  const extractComfyUIMetadata = (text: string, metadata: Record<string, any>): boolean => {
    try {
      // Try to find and parse JSON data
      let jsonText = text;
      
      // Sometimes the JSON is embedded within other text
      const jsonStartMatch = text.match(/\{\s*"[^"]+"\s*:/); 
      if (jsonStartMatch) {
        const startIndex = jsonStartMatch.index;
        if (startIndex !== undefined) {
          // Find the matching closing brace
          let braceCount = 0;
          let endIndex = startIndex;
          
          for (let i = startIndex; i < text.length; i++) {
            if (text[i] === '{') braceCount++;
            if (text[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                endIndex = i + 1;
                break;
              }
            }
          }
          
          jsonText = text.substring(startIndex, endIndex);
        }
      }
      
      // Parse the JSON data
      const comfyData = JSON.parse(jsonText);
      
      // Add ComfyUI identifier
      metadata["Generator"] = "ComfyUI";
      
      // First look for prompt in widgets_values (most common location)
      if (comfyData.widgets_values && Array.isArray(comfyData.widgets_values)) {
        // Extract all string values that could be prompts
        const stringValues = comfyData.widgets_values
          .filter((item: any) => typeof item === 'string' && item.length > 10)
          .map((item: string) => item.trim());
        
        // The first long string is usually the positive prompt
        if (stringValues.length > 0) {
          metadata["Prompt"] = stringValues[0];
          
          // If there's a second long string, it's often the negative prompt
          if (stringValues.length > 1) {
            metadata["Negative prompt"] = stringValues[1];
          }
        }
      }
      
      // Look for prompt in specific locations if not found yet
      if (!metadata["Prompt"] && comfyData.prompt) {
        metadata["Prompt"] = typeof comfyData.prompt === 'string' ? 
          comfyData.prompt : JSON.stringify(comfyData.prompt);
      }
      
      // Extract metadata from properties
      if (comfyData.properties) {
        // Version info
        if (comfyData.properties.ver) {
          metadata["ComfyUI Version"] = comfyData.properties.ver;
        }
        
        // Node name often contains model info
        if (comfyData.properties["Node name for S&R"]) {
          metadata["Model"] = comfyData.properties["Node name for S&R"];
        }
      }
      
      // Extract parameters from the actual workflow if available
      if (comfyData.workflow) {
        try {
          const workflow = typeof comfyData.workflow === 'string' ? 
            JSON.parse(comfyData.workflow) : comfyData.workflow;
          
          // Extract nodes that might contain parameters
          if (workflow.nodes) {
            // Look for KSampler nodes (contain steps, cfg, sampler)
            const samplerNode = workflow.nodes.find((node: any) => 
              node.type && (node.type.includes('KSampler') || node.type.includes('Sampler')));
            
            if (samplerNode && samplerNode.inputs) {
              if (samplerNode.inputs.steps) metadata["Steps"] = samplerNode.inputs.steps;
              if (samplerNode.inputs.cfg) metadata["CFG scale"] = samplerNode.inputs.cfg;
              if (samplerNode.inputs.sampler_name) metadata["Sampler"] = samplerNode.inputs.sampler_name;
              if (samplerNode.inputs.seed) metadata["Seed"] = samplerNode.inputs.seed;
            }
            
            // Look for checkpoint loader nodes (contain model info)
            const checkpointNode = workflow.nodes.find((node: any) => 
              node.type && node.type.includes('CheckpointLoader'));
            
            if (checkpointNode && checkpointNode.inputs && checkpointNode.inputs.ckpt_name) {
              metadata["Model"] = checkpointNode.inputs.ckpt_name;
            }
          }
        } catch (e) {
          console.error("Error parsing workflow data:", e);
        }
      }
      
      // Extract seed if available and not already found
      if (!metadata["Seed"] && comfyData.inputs && Array.isArray(comfyData.inputs)) {
        const seedInput = comfyData.inputs.find((input: any) => 
          input && typeof input === 'object' && 'seed' in input);
        
        if (seedInput && seedInput.seed) {
          metadata["Seed"] = seedInput.seed;
        }
      }
      
      // Look for model information if not already found
      if (!metadata["Model"]) {
        if (comfyData.model) {
          metadata["Model"] = comfyData.model;
        } else if (comfyData.outputs && Array.isArray(comfyData.outputs)) {
          const modelOutput = comfyData.outputs.find((output: any) => 
            output && typeof output === 'object' && 'model' in output);
          
          if (modelOutput && modelOutput.model) {
            metadata["Model"] = modelOutput.model;
          }
        }
      }
      
      // Clean up any overly complex values
      Object.keys(metadata).forEach(key => {
        if (typeof metadata[key] === 'object') {
          try {
            metadata[key] = JSON.stringify(metadata[key]).substring(0, 100);
          } catch (e) {
            metadata[key] = "[Complex object]";
          }
        }
      });
      
      return Object.keys(metadata).length > 3; // More than just Size, Date, and Generator
    } catch (err) {
      console.error("Error parsing ComfyUI metadata:", err);
      return false;
    }
  };
  
  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setMetadata(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload/Preview Area */}
        <div 
          ref={dropAreaRef}
          className="border-2 border-dashed border-base-300 rounded-xl p-8 flex flex-col items-center justify-center relative min-h-[400px]"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <div className="relative w-full h-full min-h-[350px]">
              <button 
                onClick={clearImage}
                className="btn btn-sm btn-circle absolute right-2 top-2 z-10 bg-base-100 bg-opacity-70 hover:bg-opacity-100"
              >
                <X size={18} />
              </button>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <>
              <Upload size={64} className="text-base-content opacity-50 mb-6" />
              <p className="text-center text-lg mb-6">Drop Image Here</p>
              <input
                ref={fileInputRef}
                type="file"
                id="fileInput"
                accept="image/*"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              {error && <p className="text-error mt-6">{error}</p>}
            </>
          )}
        </div>

        {/* Metadata Display Area */}
        <div className="bg-base-200 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <ImageIcon size={24} className="mr-3" />
            Image Metadata
          </h3>
          
          {metadata ? (
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="mb-3 pb-3 border-b border-base-300 last:border-0">
                  <div className="font-medium text-base mb-1">{key}:</div>
                  <div className="font-mono text-sm break-all bg-base-100 p-2 rounded">{value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-base-content opacity-70">
              {imageFile ? (
                <div className="flex flex-col items-center">
                  <div className="loading loading-spinner loading-lg mb-4"></div>
                  <p>Extracting metadata...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon size={48} className="mb-4 opacity-40" />
                  <p className="text-lg">No metadata to display</p>
                  <p className="text-sm opacity-70 mt-2">Upload an image to view its metadata</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
