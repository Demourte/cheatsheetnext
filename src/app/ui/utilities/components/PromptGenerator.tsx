"use client";

import { useState } from "react";
import { Sparkles, Copy, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/app/common/components/ToastProvider";

interface PromptElement {
  category: string;
  options: string[];
}

export default function PromptGenerator() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied'>('idle');
  const { showToast } = useToast();
  
  // Prompt building blocks for different models
  const promptElements: Record<string, PromptElement[]> = {
    sdxl: [
      {
        category: "Subject",
        options: [
          "a bizarre clockwork creature with multiple limbs",
          "an astronaut riding a seahorse in space",
          "a sentient library where books fly and read themselves",
          "a city built inside a massive geode crystal",
          "a garden where musical instruments grow like plants",
          "a steampunk octopus operating a vintage submarine",
          "a floating market in the clouds with airship vendors",
          "a dragon made entirely of stained glass",
          "an ancient tree with doorways to other dimensions",
          "a mechanical heart powering a miniature ecosystem",
          "a witch's kitchen where the ingredients are alive",
          "a celestial cartographer mapping constellations",
          "a time-traveler's collection of artifacts from different eras",
          "a festival of lights held by deep sea creatures",
          "a forgotten temple being reclaimed by exotic plants"
        ]
      },
      {
        category: "Style",
        options: [
          "surrealist painting",
          "analog film photography",
          "ukiyo-e woodblock print",
          "art nouveau illustration",
          "cyberpunk neon aesthetic",
          "impressionist brushwork",
          "gothic architecture",
          "retrofuturism",
          "biomechanical sculpture",
          "watercolor and ink",
          "abstract expressionism",
          "baroque oil painting",
          "vaporwave aesthetic",
          "technical blueprint",
          "papercraft diorama"
        ]
      },
      {
        category: "Lighting",
        options: [
          "bioluminescent glow",
          "rainbow prism reflections",
          "dramatic chiaroscuro",
          "ethereal moonlight",
          "neon signs in fog",
          "candlelight through stained glass",
          "lightning storm illumination",
          "underwater caustics",
          "northern lights in the sky",
          "sunlight through crystal",
          "laser light show",
          "warm lantern light",
          "cold blue twilight",
          "dappled forest light",
          "glowing magical runes"
        ]
      },
      {
        category: "Atmosphere",
        options: [
          "otherworldly",
          "nostalgic",
          "whimsical",
          "ominous",
          "serene",
          "chaotic",
          "mystical",
          "industrial",
          "dreamlike",
          "post-apocalyptic",
          "utopian",
          "fantastical",
          "melancholic",
          "jubilant",
          "uncanny"
        ]
      }
    ],
    flux: [
      {
        category: "Subject",
        options: [
          "a quantum physicist's dream visualized",
          "a living city where buildings breathe and move",
          "a council of animals debating human affairs",
          "a machine that captures and bottles emotions",
          "a cartographer drawing maps of imaginary planets",
          "a masquerade ball for mythological creatures",
          "a library where books change their stories each time they're read",
          "a being composed entirely of musical notes",
          "a chef cooking with ingredients from different dimensions",
          "a clockwork ecosystem where mechanical animals evolve",
          "a garden of sculptures that change pose when no one is looking",
          "a collector of forgotten dreams and memories",
          "a lighthouse that guides lost souls through the multiverse",
          "an architect designing buildings that defy physics",
          "a market where memories are traded like currency"
        ]
      },
      {
        category: "Style",
        options: [
          "hyperrealistic digital art",
          "mixed media collage",
          "fractal geometry",
          "generative adversarial network art",
          "holographic projection",
          "glitch art aesthetic",
          "neural network dreamscape",
          "quantum visualization",
          "4D perspective rendering",
          "recursive self-referential imagery",
          "non-euclidean geometry",
          "data mosaic visualization",
          "procedurally generated patterns",
          "dimensional transcendence",
          "reality distortion field"
        ]
      },
      {
        category: "Color Palette",
        options: [
          "iridescent color shifting",
          "impossible colors beyond human perception",
          "quantum chromatic superposition",
          "multispectral imaging beyond visible light",
          "synesthetic color-sound mapping",
          "higher dimensional color space",
          "probability density visualization",
          "consciousness-reactive pigments",
          "temporal color trails",
          "emotion-mapped chromatics",
          "paradoxical complementary hues",
          "phase-shifted light waves",
          "neural activity color translation",
          "quantum entangled color pairs",
          "memory-encoded spectral shifts"
        ]
      }
    ],
    hidream: [
      {
        category: "Subject",
        options: [
          "a photorealistic portrait of a person with heterochromia",
          "a detailed close-up of a butterfly wing",
          "a hyperrealistic still life with fruits and flowers",
          "an ultra-detailed landscape of mountains at sunset",
          "a photorealistic animal in its natural habitat",
          "a detailed architectural photograph of a famous building",
          "a macro photograph of morning dew on a spider web",
          "a photorealistic interior of a luxury apartment",
          "a detailed aerial view of a coastline",
          "a hyperrealistic food photography setup",
          "a photorealistic portrait of an elderly person",
          "a detailed photograph of a classic car",
          "a hyperrealistic image of hands creating art",
          "a photorealistic cityscape at night",
          "a detailed nature photograph of rare plants"
        ]
      },
      {
        category: "Photography Style",
        options: [
          "8K DSLR photography",
          "professional studio lighting",
          "award-winning photography",
          "National Geographic style",
          "magazine cover quality",
          "commercial advertising photography",
          "professional portrait photography",
          "fashion editorial photography",
          "documentary photography",
          "architectural photography",
          "product photography",
          "wildlife photography",
          "macro photography",
          "aerial photography",
          "tilt-shift photography"
        ]
      },
      {
        category: "Technical Details",
        options: [
          "shot with Canon EOS R5",
          "captured with Sony Alpha A1",
          "photographed with Hasselblad medium format",
          "shot with Leica Q2",
          "using 85mm f/1.2 lens",
          "with 24-70mm f/2.8 zoom lens",
          "using 100mm macro lens",
          "with polarizing filter",
          "using HDR technique",
          "with focus stacking",
          "using long exposure",
          "with shallow depth of field",
          "using ring light",
          "with softbox lighting",
          "using golden hour natural light"
        ]
      }
    ]
  };
  
  const generateRandomPrompt = () => {
    setIsLoading(true);
    
    // Add a small delay to show loading state
    setTimeout(() => {
      let prompt = "";
      const elements = promptElements["sdxl"];
      
      // Shuffle the elements array
      const shuffledElements = [...elements].sort(() => Math.random() - 0.5);
      
      // Randomly select 2-4 categories
      const categoriesToUse = shuffledElements.slice(0, Math.floor(Math.random() * (elements.length - 2 + 1)) + 2);
      
      // Sometimes add a random prefix
      const prefixes = [
        "",
        "",
        "",
        "imagine ",
        "concept of ",
        "visualization of ",
        "depiction of ",
        "artistic interpretation of ",
        "creative rendering of ",
      ];
      
      // Randomly decide if we want a prefix at all
      if (Math.random() > 0.7) {
        prompt += prefixes[Math.floor(Math.random() * prefixes.length)];
      }
      
      // Get one random option from each selected category
      categoriesToUse.forEach((element, index) => {
        const randomOption = element.options[Math.floor(Math.random() * element.options.length)];
        prompt += randomOption;
        
        // Add comma, "with", "and", or "featuring" if not the last element
        if (index < categoriesToUse.length - 1) {
          const connectors = [", ", ", with ", ", featuring ", " and "];
          prompt += connectors[Math.floor(Math.random() * connectors.length)];
        }
      });
      
      // Sometimes add quality boosters, but not always
      if (Math.random() > 0.3) {
        const qualityBoosts = [
          ", highly detailed",
          ", intricate",
          ", masterfully crafted",
          ", vivid",
          ", stunning",
          ", award-winning",
          ", breathtaking",
          ", extraordinary",
          ", remarkable",
        ];
        
        // Add 0-2 quality boosters
        const numBoosts = Math.floor(Math.random() * 3);
        const selectedBoosts = [...qualityBoosts]
          .sort(() => Math.random() - 0.5)
          .slice(0, numBoosts);
        
        selectedBoosts.forEach(boost => {
          prompt += boost;
        });
      }
      
      setGeneratedPrompt(prompt);
      setIsLoading(false);
    }, 500);
  };
  
  const copyToClipboard = () => {
    if (!generatedPrompt) return;
    
    // Set to copying state (spinner)
    setCopyState('copying');
    
    // Simulate a small delay for the copy operation
    setTimeout(() => {
      navigator.clipboard.writeText(generatedPrompt)
        .then(() => {
          // Set to copied state (check mark)
          setCopyState('copied');
          showToast("Prompt copied to clipboard", "success");
          
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
    }, 400);
  };
  
  return (
    <div className="card-body">
      <h2 className="card-title flex items-center">
        <Sparkles size={20} className="mr-2" />
        Prompt Generator
      </h2>
      
      <p className="text-sm mb-4">
        Used as a basic test for different models / capabilities. Might transform this to something more useful in the future.
      </p>
      
      <button 
        className={`btn btn-primary mb-6 ${isLoading ? 'loading' : ''}`}
        onClick={generateRandomPrompt}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <RefreshCw size={16} className="mr-2" />
        )}
        Generate Random Prompt
      </button>
      
      {generatedPrompt && (
        <div className="bg-base-200 p-4 rounded-lg relative">
          <p className="whitespace-pre-wrap font-mono text-sm">{generatedPrompt}</p>
          <button 
            className="btn btn-sm btn-circle absolute top-2 right-2"
            onClick={copyToClipboard}
            aria-label="Copy to clipboard"
            disabled={copyState !== 'idle'}
          >
            {copyState === 'idle' && <Copy size={16} />}
            {copyState === 'copying' && <span className="loading loading-spinner loading-xs"></span>}
            {copyState === 'copied' && <CheckCircle size={16} className="text-success" />}
          </button>
        </div>
      )}
    </div>
  );
}
