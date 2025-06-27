# Stable Diffusion Cheatsheet

A comprehensive reference application for Stable Diffusion users, rebuilt with Next.js, TypeScript, Tailwind CSS, and DaisyUI.

## About

This project is a modern reimplementation of the [original Stable Diffusion Cheatsheet](https://github.com/SupaGruen/StableDiffusion-CheatSheet) using Next.js. It provides a comprehensive reference for artists and creators working with AI image generation models.

### Features

- **Artist Styles**: Over 700 manually tested artist styles with example images
- **Enhanced Metadata Viewer**: Extract and view metadata from Stable Diffusion, ComfyUI, and SDXL images
- **Media Examples**: Reference examples for different art media types
- **Dimensions Calculator**: Calculate optimal image dimensions for different aspect ratios
- **Art History**: Reference for art history periods, artists, and mediums
- **Advanced Search & Filter**: Find specific styles or artists quickly with debounced search
- **Interactive UI**: Responsive design with toast notifications and visual feedback
- **Offline Capability**: Works offline as a reference tool

## Technologies

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
- [Lucide Icons](https://lucide.dev/) - Beautiful SVG icons
- [react-hot-toast](https://react-hot-toast.com/) - Toast notifications

## Getting Started

### Prerequisites
Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### Quick Start Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Demourte/cheatsheetnext.git
   cd cheatsheetnext
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production
To create an optimized production build:
```bash
npm run build
npm start
```

### First-Time Setup Notes
- If you are new to Node.js, download it from the [official website](https://nodejs.org/).
- The `npm install` command downloads all required packages (this may take a few minutes).
- Use `Ctrl+C` in the terminal to stop the development server at any time.
- The application will automatically reload when you make code changes.

### Troubleshooting
- **Node.js version issues:** Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions.
- **Dependency installation errors:** Try deleting the `node_modules` folder and `package-lock.json` file, then run `npm install` again.
- **Port conflicts:** Change the port by editing `package.json` scripts, e.g., `"dev": "next dev -p 3001"`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Open Source License

This project is licensed under the [MIT License](./LICENSE). You are free to use, modify, and distribute it for personal or commercial purposes. See the LICENSE file for details.

## Components

- **Navbar**: Navigation bar with links to main sections
- **ArtistCard**: Displays artist style information with interactive copy buttons and visual feedback
- **MetadataViewer**: Enhanced drag-and-drop interface for extracting image metadata from various SD engines
- **ToastProvider**: Global toast notification system with customizable styles
- **MediaExamples**: Displays categorized prompt examples
- **DimensionsCalculator**: Calculates image dimensions based on aspect ratios
- **ArtHistory**: Collapsible sections for art history periods
- **ManageArtistsContent**: Improved artist management with debounced search and alphabet filtering

## Roadmap

- ✅ Add full dataset of artist styles
- ✅ Implement metadata extraction for various SD engines
- ✅ Add SDXL-specific metadata extraction
- ✅ Add Flux-specific metadata extraction
- ✅ Improve UI with toast notifications and visual feedback
- 🔄 Enhance search and filtering capabilities
- 📋 Add more prompt generation tools
- 📋 Add user customization options

## Credits

Based on the original [Stable Diffusion Cheatsheet](https://github.com/SupaGruen/StableDiffusion-CheatSheet) by SupaGruen.
