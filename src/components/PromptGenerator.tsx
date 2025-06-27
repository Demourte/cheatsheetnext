"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw } from "lucide-react";

interface PromptElement {
  category: string;
  options: string[];
}

export default function PromptGenerator() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("sdxl");
  const [isLoading, setIsLoading] = useState(false);
  
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
          "an architect designing impossible structures",
          "a market where people trade parts of their personalities",
          "a theater where the audience becomes part of the performance"
        ]
      },
      {
        category: "Style",
        options: [
          "mixed media collage",
          "etching and engraving",
          "psychedelic art",
          "art deco illustration",
          "pop art comic",
          "stained glass mosaic",
          "geometric minimalism",
          "folk art tapestry",
          "digital glitch art",
          "charcoal and chalk",
          "cel shaded animation",
          "risograph print",
          "graffiti mural",
          "linocut print",
          "fractal digital art"
        ]
      },
      {
        category: "Mood",
        options: [
          "contemplative",
          "euphoric",
          "unsettling",
          "transcendent",
          "bittersweet",
          "mysterious",
          "playful",
          "solemn",
          "chaotic",
          "tranquil",
          "surreal",
          "whimsical",
          "foreboding",
          "nostalgic",
          "ethereal"
        ]
      },
      {
        category: "Element",
        options: [
          "swirling mist",
          "fractured mirrors",
          "floating islands",
          "geometric patterns",
          "twisted clockwork",
          "living shadows",
          "crystalline structures",
          "flowing liquid metal",
          "cosmic nebulae",
          "ancient symbols",
          "bioluminescent organisms",
          "dancing flames",
          "quantum particles",
          "tangled roots",
          "prismatic light beams"
        ]
      }
    ],
    hidream: [
      {
        category: "Subject",
        options: [
          "a macro photograph of dew drops on a spider web at dawn",
          "an abandoned amusement park reclaimed by nature",
          "a bustling night market in a futuristic Asian metropolis",
          "a solitary lighthouse during a dramatic thunderstorm",
          "a hidden cenote in an unexplored cave system",
          "a traditional artisan workshop with tools and materials",
          "a wildlife encounter in a misty rainforest",
          "an elaborate ice sculpture melting in time-lapse",
          "a remote mountain monastery at sunrise",
          "a vintage car rally through scenic countryside",
          "a bioluminescent beach under a starry sky",
          "a street performer captivating a diverse crowd",
          "a traditional cultural celebration with elaborate costumes",
          "a dramatic volcanic eruption viewed from a safe distance",
          "a tranquil Japanese garden during cherry blossom season"
        ]
      },
      {
        category: "Technique",
        options: [
          "tilt-shift photography",
          "infrared photography",
          "long exposure light trails",
          "aerial drone perspective",
          "underwater photography",
          "high-speed photography capturing motion",
          "panoramic stitching",
          "HDR bracketing",
          "double exposure technique",
          "selective color in black and white scene",
          "light painting in darkness",
          "macro focus stacking",
          "silhouette against dramatic sky",
          "lens flare effect",
          "fisheye distortion"
        ]
      },
      {
        category: "Lighting",
        options: [
          "golden hour sunlight filtering through trees",
          "dramatic storm clouds with crepuscular rays",
          "soft diffused light through morning mist",
          "harsh midday shadows creating geometric patterns",
          "blue hour twilight over water",
          "candlelit ambiance in a historical setting",
          "neon reflections on wet city streets",
          "backlit subject creating a dramatic silhouette",
          "dappled light through a forest canopy",
          "rim lighting defining the edges of a subject",
          "volumetric light beams in a dusty interior",
          "starlight and moonlight in a clear night sky",
          "dramatic side lighting revealing texture",
          "soft box studio lighting with perfect shadows",
          "light painting with colorful LED sources"
        ]
      },
      {
        category: "Detail",
        options: [
          "intricate textures visible in 8K resolution",
          "microscopic details revealing hidden patterns",
          "razor-sharp focus across multiple planes",
          "subtle color gradients showing perfect transitions",
          "complex reflections in multiple glossy surfaces",
          "fine fabric details with visible weave patterns",
          "water droplets with perfect surface tension",
          "crystalline structures with prismatic light effects",
          "organic patterns forming mathematical sequences",
          "atmospheric particles catching light beams",
          "perfect motion freeze of fast action",
          "delicate transparency and translucency effects",
          "complex shadow patterns creating secondary interest",
          "subtle atmospheric perspective showing depth",
          "precise depth of field transitions"
        ]
      }
    ]
  };
  
  const generateRandomPrompt = () => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      const elements = promptElements[selectedModel];
      let prompt = "";
      
      // Randomize how many categories to include (at least 2, up to all)
      const shuffledElements = [...elements].sort(() => Math.random() - 0.5);
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
    
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="card-body">
      <h2 className="card-title flex items-center">
        <Sparkles size={20} className="mr-2" />
        Prompt Generator
      </h2>
      
      <p className="text-sm mb-4">
        Generate random prompts optimized for different Stable Diffusion models.
        Click the button to create a new prompt, then copy it to your clipboard.
      </p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className={`btn ${selectedModel === 'sdxl' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedModel('sdxl')}
        >
          SDXL
        </button>
        <button 
          className={`btn ${selectedModel === 'flux' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedModel('flux')}
        >
          Flux
        </button>
        <button 
          className={`btn ${selectedModel === 'hidream' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedModel('hidream')}
        >
          HiDream
        </button>
      </div>
      
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
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
