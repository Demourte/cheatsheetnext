import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Github, ExternalLink, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">About Stable Diffusion Cheatsheet</h1>
        
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title">Project Information</h2>
            <p className="mb-4">
              This modern reimplementation of the Stable Diffusion Cheatsheet provides a dynamic, responsive interface for AI artists and creators. 
              Built with Next.js and TypeScript, it offers a more intuitive experience with improved filters and real-time updates.
            </p>
            <p className="mb-4">
              The application now features enhanced metadata extraction capabilities, supporting various formats including ComfyUI workflows, 
              and a completely redesigned UI with dark mode support and accessibility improvements.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Over 700 manually tested artist styles with modern filtering interface</li>
              <li>One-click prompt copying with visual feedback</li>
              <li>Advanced search with multi-category filtering</li>
              <li>Alphabetical navigation and responsive grid/list views</li>
              <li>Enhanced metadata extraction for SD and ComfyUI images</li>
              <li>Art style references with visual examples</li>
              <li>Responsive design with dark mode support</li>
              <li>Accessible UI with keyboard navigation</li>
            </ul>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="/" className="btn btn-primary btn-sm">
                <BookOpen size={16} />
                <span className="ml-1">Browse Styles</span>
              </Link>
              <a 
                href="https://github.com/SupaGruen/StableDiffusion-CheatSheet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <Github size={16} />
                <span className="ml-1">Original Project</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Credits</h2>
            <p className="mb-4">
              This project is based on the original Stable Diffusion Cheatsheet by SupaGruen.
              It has been reimplemented using Next.js, DaisyUI, and Lucide icons.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Technologies Used</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-medium">Frontend</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Next.js</li>
                    <li>TypeScript</li>
                    <li>Tailwind CSS</li>
                    <li>DaisyUI</li>
                    <li>Lucide Icons</li>
                  </ul>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-medium">Original Credits</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vanilla LazyLoad (MIT)</li>
                    <li>ExifReader (MPL-2.0)</li>
                    <li>Stable Diffusion Image Metadata Viewer (MIT)</li>
                    <li>Google Font Roboto (Apache-2.0)</li>
                    <li>SVG Icons from Ionicons (MIT)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-8">
        <div>
          <p>Stable Diffusion Cheatsheet - A comprehensive reference for AI image generation</p>
        </div>
      </footer>
    </div>
  );
}
