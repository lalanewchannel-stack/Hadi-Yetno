
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 mb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 shrink-0">
            <i className="fa-solid fa-music text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none mb-1">
              Generator Musik <span className="text-purple-400">R&B</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">By Wong Jowo</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Lyrics</a>
          <a href="#" className="hover:text-white transition-colors">Suno Prompts</a>
          <a href="#" className="hover:text-white transition-colors">Studio</a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[10px] text-slate-600 font-mono italic">Creative Engine v2.5</span>
          <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors border border-slate-700">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;