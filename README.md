# Stable Diffusion Cheatsheet

A comprehensive reference application for Stable Diffusion users, rebuilt with Next.js, TypeScript, Tailwind CSS, and DaisyUI.

## About

This project is a modern reimplementation of the [original Stable Diffusion Cheatsheet](https://github.com/SupaGruen/StableDiffusion-CheatSheet) using Next.js. It provides a comprehensive reference for artists and creators working with AI image generation models.

### Features

- **Artist Styles**: Over 700 manually tested artist styles with example images
- **Metadata Viewer**: Extract and view Stable Diffusion metadata from images
- **Media Examples**: Reference examples for different art media types
- **Dimensions Calculator**: Calculate optimal image dimensions for different aspect ratios
- **Art History**: Reference for art history periods, artists, and mediums
- **Search & Filter**: Find specific styles or artists quickly
- **Offline Capability**: Works offline as a reference tool

## Technologies

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
- [Lucide Icons](https://lucide.dev/) - Beautiful SVG icons

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js App Router
│   │   ├── about/   # About page
│   │   ├── metadata/# Metadata viewer page
│   │   └── notes/   # Notes and examples page
│   ├── components/  # React components
│   └── styles/      # Global styles
└── package.json     # Project dependencies
```

## Components

- **Navbar**: Navigation bar with links to main sections
- **ArtistCard**: Displays artist style information with copyable prompts
- **MetadataViewer**: Drag-and-drop interface for extracting image metadata
- **MediaExamples**: Displays categorized prompt examples
- **DimensionsCalculator**: Calculates image dimensions based on aspect ratios
- **ArtHistory**: Collapsible sections for art history periods

## Roadmap

- Add full dataset of artist styles
- Implement actual metadata extraction using ExifReader
- Add SDXL-specific features
- Add Flux-specific features
- Implement offline storage capabilities

## Credits

Based on the original [Stable Diffusion Cheatsheet](https://github.com/SupaGruen/StableDiffusion-CheatSheet) by SupaGruen.
