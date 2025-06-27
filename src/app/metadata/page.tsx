import Navbar from "@/components/Navbar";
import MetadataViewer from "@/components/MetadataViewer";

export default function MetadataPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section>
          <h1 className="text-2xl font-bold mb-4">Image Metadata</h1>
          
          <p className="mb-6">
            This will check an image for embedded Stable Diffusion data. 
            Drop an image or upload one to view its metadata.
          </p>
          
          <MetadataViewer />
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
