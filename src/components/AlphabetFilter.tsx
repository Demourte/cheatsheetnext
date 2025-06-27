import React from 'react';

interface AlphabetFilterProps {
  letters: string[];
  onLetterChange: (letter: string | null) => void;
  selectedLetter: string | null;
  letterCounts: Record<string, number>;
}

export default function AlphabetFilter({ letters, onLetterChange, selectedLetter, letterCounts }: AlphabetFilterProps) {
  // Calculate total count
  const totalCount = Object.values(letterCounts).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="grid grid-cols-9 sm:grid-cols-14 md:grid-cols-27 gap-1 w-full">
      <button
        className={`px-3 py-2 rounded text-center relative h-9 ${selectedLetter === null ? 'bg-primary text-primary-content' : 'bg-base-200'}`}
        onClick={() => onLetterChange(null)}
      >
        <span>All</span>
        <span className="badge badge-sm badge-secondary absolute top-1 right-1">{totalCount}</span>
      </button>
      {letters.map((letter: string) => (
        <button
          key={letter}
          className={`px-3 py-2 rounded text-center relative h-9 ${selectedLetter === letter ? 'bg-primary text-primary-content' : 'bg-base-200'}`}
          onClick={() => onLetterChange(letter)}
          disabled={letterCounts[letter] === 0}
        >
          <span>{letter}</span>
          {letterCounts[letter] > 0 && (
            <span className="badge badge-sm badge-secondary absolute top-1 right-1">{letterCounts[letter]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
