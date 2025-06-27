"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

interface MediaExample {
  id: string;
  title: string;
  imagePath: string;
  prompt: string;
}

interface MediaCategoryProps {
  title: string;
  examples: MediaExample[];
}

export default function MediaExamples({ categories }: { categories: MediaCategoryProps[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.title} className="mb-8">
          <h3 className="text-xl font-bold mb-4">{category.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {category.examples.map((example) => (
              <div key={example.id} className="card bg-base-100 shadow-sm">
                <div className="relative h-32 bg-base-300 flex items-center justify-center">
                  {example.imagePath ? (
                    <img
                      src={example.imagePath}
                      alt={example.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Replace with placeholder on error
                        e.currentTarget.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'text-lg font-medium text-base-content opacity-30';
                        placeholder.textContent = example.title;
                        e.currentTarget.parentElement?.appendChild(placeholder);
                      }}
                    />
                  ) : (
                    <span className="text-lg font-medium text-base-content opacity-30">
                      {example.title}
                    </span>
                  )}
                </div>
                <div className="card-body p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{example.title}</p>
                    <button
                      className="btn btn-xs btn-ghost"
                      onClick={() => copyToClipboard(example.prompt, example.id)}
                      aria-label={`Copy ${example.title} prompt`}
                    >
                      {copiedId === example.id ? (
                        <Check size={14} className="text-success" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
