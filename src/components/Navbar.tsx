"use client";

import { Menu, X, Sun, Moon, Palette } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("cupcake");

  useEffect(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("theme") || "cupcake";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === "cupcake" ? "dracula" : "cupcake";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/" className="font-medium">Styles</Link></li>
            <li><Link href="/metadata" className="font-medium">Metadata</Link></li>
            <li><Link href="/utilities" className="font-medium">Utilities</Link></li>
            <li><Link href="/about" className="font-medium">About</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          <Palette size={20} className="mr-2" />
          <span className="hidden sm:inline">SD Cheatsheet</span>
          <span className="sm:hidden">SD</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/" className="font-medium hover:bg-base-200 rounded-lg">Styles</Link></li>
          <li><Link href="/metadata" className="font-medium hover:bg-base-200 rounded-lg">Metadata</Link></li>
          <li><Link href="/utilities" className="font-medium hover:bg-base-200 rounded-lg">Utilities</Link></li>
          <li><Link href="/about" className="font-medium hover:bg-base-200 rounded-lg">About</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        <button 
          className="btn btn-circle btn-ghost" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "cupcake" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </div>
  );
}
