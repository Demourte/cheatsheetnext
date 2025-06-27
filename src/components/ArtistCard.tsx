"use client";

import Image from "next/image";
import { Copy, ExternalLink, Edit } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ArtistCardProps {
  id: string;
  name: string;
  imagePath: string;
  prompt: string;
  category: string[];
  viewMode?: 'grid' | 'list';
}

export default function ArtistCard({
  id,
  name,
  imagePath,
  prompt,
  category,
  viewMode = 'grid',
}: ArtistCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const searchArtist = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(name)}`, "_blank");
  };
  
  const router = useRouter();
  
  const editArtist = () => {
    router.push(`/admin/artists/edit/${id}`);
  };

  // Render grid view (card style)
  if (viewMode === 'grid') {
    return (
      <div className="card w-full bg-base-100 shadow-xl overflow-hidden">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-base-300">
          {/* Use a placeholder div with artist initials if image is missing */}
          {imagePath ? (
            <img
              src={imagePath}
              alt={`${name} style example`}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
              onError={(e) => {
                // Replace with placeholder on error
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                const placeholder = document.createElement('div');
                placeholder.className = 'text-4xl font-bold text-base-content opacity-30';
                placeholder.textContent = name.split(' ').map(n => n[0]).join('');
                e.currentTarget.parentElement?.appendChild(placeholder);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-base-content opacity-30">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <div className="card-body p-4">
          <h2 className="card-title text-lg">{name}</h2>
          <div className="flex flex-wrap gap-1 my-1">
            {category.map((cat) => (
              <span key={cat} className="badge badge-sm badge-outline">{cat}</span>
            ))}
          </div>
          <div className="relative bg-base-200 p-2 rounded-md mt-2">
            <p className="text-sm font-mono pr-8">{prompt}</p>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 btn btn-xs btn-ghost"
              aria-label="Copy prompt"
            >
              <Copy size={16} />
            </button>
            {copied && (
              <div className="toast toast-end">
                <div className="alert alert-success">
                  <span>Copied to clipboard!</span>
                </div>
              </div>
            )}
          </div>

          <div className="card-actions justify-end mt-2">
            <button onClick={editArtist} className="btn btn-xs btn-outline">
              <Edit size={14} />
              <span className="ml-1">Edit</span>
            </button>
            <button onClick={searchArtist} className="btn btn-xs btn-outline">
              <ExternalLink size={14} />
              <span className="ml-1">Search</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render list view (horizontal layout)
  return (
    <div className="card card-side bg-base-100 shadow-xl overflow-hidden">
      <div className="relative h-full w-32 sm:w-48 overflow-hidden bg-base-300">
        {/* Use a placeholder div with artist initials if image is missing */}
        {imagePath ? (
          <img
            src={imagePath}
            alt={`${name} style example`}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              // Replace with placeholder on error
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              const placeholder = document.createElement('div');
              placeholder.className = 'text-2xl font-bold text-base-content opacity-30';
              placeholder.textContent = name.split(' ').map(n => n[0]).join('');
              e.currentTarget.parentElement?.appendChild(placeholder);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-base-content opacity-30">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
      </div>
      <div className="card-body p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
          <h2 className="card-title text-lg">{name}</h2>
          <div className="flex flex-wrap gap-1">
            {category.map((cat) => (
              <span key={cat} className="badge badge-sm badge-outline">{cat}</span>
            ))}
          </div>
        </div>
        
        <div className="relative bg-base-200 p-2 rounded-md mt-2">
          <p className="text-sm font-mono pr-8">{prompt}</p>
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 btn btn-xs btn-ghost"
            aria-label="Copy prompt"
          >
            <Copy size={16} />
          </button>
          {copied && (
            <div className="toast toast-end">
              <div className="alert alert-success">
                <span>Copied to clipboard!</span>
              </div>
            </div>
          )}
        </div>
        <div className="card-actions justify-end mt-2">
          <button onClick={editArtist} className="btn btn-xs btn-outline">
            <Edit size={14} />
            <span className="ml-1">Edit</span>
          </button>
          <button onClick={searchArtist} className="btn btn-xs btn-outline">
            <ExternalLink size={14} />
            <span className="ml-1">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
