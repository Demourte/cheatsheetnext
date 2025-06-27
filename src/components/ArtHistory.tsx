"use client";

import { History } from "lucide-react";
import Link from "next/link";

interface Artist {
  name: string;
  id: string;
}

interface ArtPeriod {
  name: string;
  years: string;
  artists: Artist[];
  medium: string;
}

export default function ArtHistory({ periods }: { periods: ArtPeriod[] }) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title flex items-center">
          <History size={20} className="mr-2" />
          Art History - Some Pointers
        </h2>
        
        <div className="space-y-6">
          {periods.map((period) => (
            <div key={period.name} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
              <input type="checkbox" /> 
              <div className="collapse-title text-lg font-medium">
                {period.name} <span className="text-sm opacity-70">({period.years})</span>
              </div>
              <div className="collapse-content"> 
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Famous Artists:</span>{" "}
                    {period.artists.map((artist, index) => (
                      <span key={artist.id}>
                        {index > 0 && ", "}
                        {artist.id ? (
                          <Link href={`/#${artist.id}`} className="link link-hover text-primary">
                            {artist.name}
                          </Link>
                        ) : (
                          artist.name
                        )}
                      </span>
                    ))}
                  </li>
                  <li>
                    <span className="font-medium">Medium:</span> {period.medium}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
