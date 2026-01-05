
import React from 'react';

interface LyricCardProps {
  label: string;
  content: string;
}

const LyricCard: React.FC<LyricCardProps> = ({ label, content }) => {
  return (
    <div className="relative border-l-2 border-purple-500/20 pl-6 py-2 transition-all hover:border-purple-500/60 group">
      <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">{label}</div>
      <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg font-light tracking-wide italic">
        {content}
      </p>
    </div>
  );
};

export default LyricCard;
