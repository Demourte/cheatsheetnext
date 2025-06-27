import { Artist } from "@/app/lib/data/artistTypes";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/app/common/components/Toast";

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(artist.imagePath || '/images/placeholder.jpg');
  const { showToast, ToastContainer } = useToast();
  
  // Use Intersection Observer to detect when card is visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px' }); // Load images 200px before they come into view
    
    const currentElement = document.getElementById(`artist-card-${artist.id}`);
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [artist.id]);
  
  // Handle image error
  const handleImageError = () => {
    setImgSrc('/images/placeholder.jpg');
  };
  
  return (
    <div id={`artist-card-${artist.id}`} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <figure className="relative h-48 w-full bg-base-300">
        {isVisible && (
          <Image
            src={imgSrc}
            alt={artist.name}
            fill
            loading="lazy"
            quality={70}
            onLoad={() => setIsLoaded(true)}
            onError={handleImageError}
            className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
      </figure>
      <div className="card-body p-4">
        <h3 className="card-title text-lg">{artist.name}</h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {artist.category.slice(0, 3).map(cat => (
            <span key={cat} className="badge badge-sm">{cat}</span>
          ))}
          {artist.category.length > 3 && (
            <span className="badge badge-sm">+{artist.category.length - 3}</span>
          )}
        </div>
        <div className="card-actions mt-3">
          <button 
            className="btn btn-sm btn-primary btn-outline w-full"
            onClick={() => {
              navigator.clipboard.writeText(artist.prompt);
              showToast(`Copied ${artist.name}'s prompt to clipboard`, 'success');
            }}
          >
            Copy Prompt
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
