import Navbar from "@/components/Navbar";
import MediaExamples from "@/components/MediaExamples";
import DimensionsCalculator from "@/components/DimensionsCalculator";
import ArtHistory from "@/components/ArtHistory";

// Mock data for media examples
const mediaCategories = [
  {
    title: "Photo",
    examples: [
      { id: "photo-1", title: "Photo, DSLR", imagePath: "", prompt: "Photo, DSLR" },
      { id: "photo-2", title: "Analog Photo", imagePath: "", prompt: "Analog Photo" },
      { id: "photo-3", title: "Lomography Photo", imagePath: "", prompt: "Lomography Photo" },
      { id: "photo-4", title: "BW Photo", imagePath: "", prompt: "BW Photo" },
      { id: "photo-5", title: "Wet-Plate Photo", imagePath: "", prompt: "Wet-Plate Photo" },
    ]
  },
  {
    title: "Drawing, Painting, Print",
    examples: [
      { id: "drawing-1", title: "Pencil Drawing", imagePath: "", prompt: "Pencil Drawing" },
      { id: "drawing-2", title: "Pen and Ink Drawing", imagePath: "", prompt: "Pen and Ink Drawing" },
      { id: "painting-1", title: "Watercolor Painting", imagePath: "", prompt: "Watercolor Painting" },
      { id: "painting-2", title: "Oil Painting", imagePath: "", prompt: "Oil Painting" },
      { id: "painting-3", title: "Acrylic Painting", imagePath: "", prompt: "Acrylic Painting" },
    ]
  },
  {
    title: "Digital, Other",
    examples: [
      { id: "digital-1", title: "Comic Character", imagePath: "", prompt: "Comic Character" },
      { id: "digital-2", title: "Pixel Art", imagePath: "", prompt: "Pixel Art" },
      { id: "digital-3", title: "Vector Graphic", imagePath: "", prompt: "Vector Graphic" },
      { id: "digital-4", title: "3D Render", imagePath: "", prompt: "3D Render" },
      { id: "digital-5", title: "Low Poly Render", imagePath: "", prompt: "Low Poly Render" },
    ]
  }
];

// Mock data for art history periods
const artPeriods = [
  {
    name: "Renaissance",
    years: "14th-16th Centuries",
    artists: [
      { name: "Leonardo da Vinci", id: "Da-Vinci-Leonardo" },
      { name: "Michelangelo Buonarroti", id: "" },
      { name: "Raffaello Sanzio da Urbino", id: "Raphael-Raffaello-Sanzio-da-Urbino" },
      { name: "Sandro Botticelli", id: "Botticelli-Sandro" }
    ],
    medium: "Oil on wood or canvas"
  },
  {
    name: "Impressionism",
    years: "late 19th Century",
    artists: [
      { name: "Claude Monet", id: "Monet-Claude" },
      { name: "Pierre-Auguste Renoir", id: "Renoir-Pierre-Auguste" },
      { name: "Edgar Degas", id: "Degas-Edgar" },
      { name: "Mary Cassatt", id: "" }
    ],
    medium: "Oil on canvas"
  },
  {
    name: "Cubism",
    years: "early 20th Century",
    artists: [
      { name: "Pablo Picasso", id: "Picasso-Pablo" },
      { name: "Georges Braque", id: "" },
      { name: "Juan Gris", id: "" }
    ],
    medium: "Oil on canvas or collage"
  },
  {
    name: "Pop Art",
    years: "1950s-60s",
    artists: [
      { name: "Andy Warhol", id: "Warhol-Andy" },
      { name: "Roy Lichtenstein", id: "Lichtenstein-Roy" },
      { name: "Richard Hamilton", id: "Hamilton-Richard" }
    ],
    medium: "Acrylic or oil on canvas or mixed media"
  }
];

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Prompt Examples & Notes</h1>
        
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Prompt Examples - Art Media</h2>
          <MediaExamples categories={mediaCategories} />
        </section>
        
        <section className="mb-12">
          <DimensionsCalculator />
        </section>
        
        <section className="mb-12">
          <ArtHistory periods={artPeriods} />
        </section>
      </main>
      
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Stable Diffusion Cheatsheet - A comprehensive reference for AI image generation</p>
        </div>
      </footer>
    </div>
  );
}
