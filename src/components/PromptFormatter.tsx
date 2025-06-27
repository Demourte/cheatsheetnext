"use client";

import { useState } from "react";
import { FileText, Copy, Check } from "lucide-react";

export default function PromptFormatter() {
  const [prompt, setPrompt] = useState("");
  const [weight, setWeight] = useState(1.1);
  const [copied, setCopied] = useState(false);
  const [formattedPrompt, setFormattedPrompt] = useState("");
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setWeight(value);
    }
  };
  
  const formatPrompt = () => {
    if (!prompt.trim()) {
      setFormattedPrompt("");
      return;
    }
    
    // Split by commas and format each term
    const terms = prompt.split(",").map(term => term.trim());
    
    // Format based on common patterns
    const formattedTerms = terms.map(term => {
      // Skip empty terms
      if (!term) return "";
      
      // Check if term already has weights
      if (term.includes("(") && term.includes(")")) return term;
      if (term.includes("[") && term.includes("]")) return term;
      if (term.includes("{") && term.includes("}")) return term;
      
      // Apply weight formatting
      if (weight > 1) {
        return `(${term}:${weight.toFixed(1)})`;
      } else if (weight < 1) {
        return `[${term}:${weight.toFixed(1)}]`;
      }
      return term;
    });
    
    setFormattedPrompt(formattedTerms.filter(Boolean).join(", "));
  };
  
  const copyToClipboard = () => {
    if (!formattedPrompt) return;
    
    navigator.clipboard.writeText(formattedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title flex items-center">
          <FileText size={20} className="mr-2" />
          Prompt Formatter
        </h2>
        
        <p className="text-sm mb-4">
          Format your prompt with proper emphasis weights. Enter comma-separated terms and apply weights.
          Use values greater than 1.0 for emphasis and less than 1.0 for de-emphasis.
        </p>
        
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Enter your prompt (comma separated)</span>
          </label>
          <textarea 
            className="textarea textarea-bordered h-24 font-mono text-sm"
            placeholder="masterpiece, detailed, 8k, high quality"
            value={prompt}
            onChange={handlePromptChange}
          ></textarea>
        </div>
        
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Weight ({weight.toFixed(1)})</span>
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="2.0" 
            step="0.1"
            className="range range-primary" 
            value={weight}
            onChange={handleWeightChange}
          />
          <div className="w-full flex justify-between text-xs px-2 mt-1">
            <span>0.1</span>
            <span>1.0</span>
            <span>2.0</span>
          </div>
        </div>
        
        <button 
          className="btn btn-primary mb-4"
          onClick={formatPrompt}
        >
          Format Prompt
        </button>
        
        {formattedPrompt && (
          <div className="bg-base-200 p-4 rounded-lg relative">
            <pre className="whitespace-pre-wrap font-mono text-sm">{formattedPrompt}</pre>
            <button 
              className="btn btn-sm btn-circle absolute top-2 right-2"
              onClick={copyToClipboard}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
