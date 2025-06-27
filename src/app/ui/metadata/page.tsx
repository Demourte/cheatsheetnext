import Navbar from "@/app/common/components/Navbar";
import MetadataViewer from "./components/MetadataViewer";
import Footer from "@/app/common/components/Footer";
import { FileSearch } from "lucide-react";

export default function MetadataPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FileSearch size={28} className="text-primary" />
          <h1 className="text-2xl font-bold">Image Metadata</h1>
        </div>
        
        <div className="space-y-6">
          
          <p className="mb-6">
            This will check an image for embedded Stable Diffusion data. 
            Drop an image or upload one to view its metadata.
          </p>
          
          <MetadataViewer />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
