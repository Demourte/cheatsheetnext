import { Artist } from "@/app/lib/data/artistTypes";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/app/common/components/ToastProvider";

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(artist.imagePath || '/images/placeholder.jpg');
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied'>('idle');
  const { showToast } = useToast();
  
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
              // Set to copying state (spinner)
              setCopyState('copying');
              
              // Simulate a small delay for the copy operation
              setTimeout(() => {
                navigator.clipboard.writeText(artist.prompt)
                  .then(() => {
                    // Set to copied state (check mark)
                    setCopyState('copied');
                    showToast(`Copied ${artist.name}'s prompt to clipboard`, 'success');
                    
                    // Reset back to idle state after 1.5 seconds
                    setTimeout(() => {
                      setCopyState('idle');
                    }, 1500);
                  })
                  .catch(err => {
                    console.error('Failed to copy text: ', err);
                    showToast("Failed to copy to clipboard", "error");
                    setCopyState('idle');
                  });
              }, 400); // Small delay to show the spinner
            }}
            disabled={copyState !== 'idle'}
          >
            {copyState === 'idle' && (
              <>
                <Copy size={16} className="mr-2" />
                Copy Prompt
              </>
            )}
            {copyState === 'copying' && (
              <>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Copying...
              </>
            )}
            {copyState === 'copied' && (
              <>
                <CheckCircle size={16} className="mr-2 text-success" />
                Copied!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
