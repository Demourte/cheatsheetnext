import { Github } from "lucide-react";

export default function AboutContent() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">About CheatsheetNext</h2>
        <p className="mb-4">
          Welcome to <span className="font-bold">CheatsheetNext</span>! We've taken the beloved Stable Diffusion Cheatsheet and given it a fresh, modern makeover. 
          Our goal? To make your AI art creation process smoother and more enjoyable than ever.
        </p>
        <p className="mb-4">
          We've rebuilt everything from the ground up with Next.js and TypeScript, creating a faster, more responsive experience that works beautifully on any device. 
          The new interface is cleaner, more intuitive, and designed with both beginners and power users in mind.
        </p>
        <p className="mb-4">
          Behind the scenes, we're still using simple JSON files to store all your data - no complicated databases required. 
          This keeps things lightweight and makes the app super easy to deploy and maintain.
        </p>
        <a 
          href="https://github.com/Demourte/cheatsheetnext" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
        >
          <Github size={16} className="mr-2" />
          <span className="ml-1">GitHub</span>
        </a>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-3">What's New</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>🎨 <span className="font-medium">Vertical Navigation</span> - Easier access to settings and utilities with our new sidebar design</li>
          <li>🔍 <span className="font-medium">Enhanced Search</span> - Find exactly what you need with multi-category filtering and instant results</li>
          <li>📊 <span className="font-medium">Utility Suite</span> - New tools for calculating dimensions, visualizing aspect ratios, and generating prompts</li>
          <li>⚙️ <span className="font-medium">Centralized Management</span> - All artist administration now in one convenient location</li>
          <li>📱 <span className="font-medium">Responsive Design</span> - A beautiful experience on everything from phones to desktop monitors</li>
          <li>🌓 <span className="font-medium">Dark/Light Themes</span> - Easy on the eyes, day or night</li>
          <li>♿ <span className="font-medium">Accessibility</span> - Improved keyboard navigation and screen reader support</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-3">Credits</h3>
        <p className="mb-4">
          A huge thank you to SupaGruen for creating the original Stable Diffusion Cheatsheet that inspired this project! 
          Their work has been an incredible resource for the AI art community, and we're honored to build upon that foundation 
          with our modern interface and expanded features.
        </p>
        
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Technologies Used</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h5 className="font-medium">Frontend</h5>
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
                <h5 className="font-medium">Original Credits</h5>
                <ul className="list-disc list-inside space-y-1">
                  <li><a href="https://github.com/verlok/vanilla-lazyload" target="new">Vanilla LazyLoad (MIT)</a></li>
                  <li><a href="https://github.com/mattiasw/ExifReader" target="new">ExifReader (MPL-2.0)</a></li>
                  <li><a href="https://github.com/himuro-majika/Stable_Diffusion_image_metadata_viewer" target="new">Stable Diffusion Image Metadata Viewer (MIT)</a></li>
                  <li><a href="https://fonts.google.com/specimen/Roboto" target="new">Google Font Roboto (Apache-2.0)</a></li>
                  <li><a href="https://github.com/ionic-team/ionicons" target="new">SVG Icons from Ionicons (MIT)</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <a 
          href="https://github.com/SupaGruen/StableDiffusion-CheatSheet" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
        >
          <Github size={16} className="mr-2" />
          <span className="ml-1">Original Project</span>
        </a>
      </div>
    </div>
  );
}
