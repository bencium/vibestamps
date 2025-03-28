import React from 'react';

interface GhibliBackgroundProps {
  className?: string;
}

const GhibliBackground: React.FC<GhibliBackgroundProps> = ({ className }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden z-0 ${className}`}>
      {/* Sky gradient background */}
      <div style={{pointerEvents: 'none'}} className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 dark:from-sky-900 dark:via-sky-800 dark:to-emerald-900 transition-colors duration-500">
        {/* Twinkling stars (only visible in dark mode) */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-0 dark:opacity-30 transition-opacity duration-500" />
      
        {/* Sun/Moon */}
        <div className="absolute top-12 right-20 w-24 h-24 rounded-full bg-amber-200 dark:bg-slate-200 shadow-[0_0_40px_20px_rgba(251,191,36,0.3)] dark:shadow-[0_0_40px_20px_rgba(226,232,240,0.2)] transition-all duration-500" />
        
        {/* Floating clouds */}
        <div className="absolute top-20 left-5 w-64 h-32 bg-white dark:bg-slate-300 rounded-full blur-xl opacity-60 dark:opacity-20 animate-cloud1" />
        <div className="absolute top-40 right-10 w-48 h-24 bg-white dark:bg-slate-300 rounded-full blur-xl opacity-40 dark:opacity-15 animate-cloud2" />
        <div className="absolute bottom-80 left-36 w-56 h-28 bg-white dark:bg-slate-300 rounded-full blur-xl opacity-50 dark:opacity-15 animate-cloud3" />
        <div className="absolute top-60 left-[50%] w-72 h-36 bg-white dark:bg-slate-300 rounded-full blur-xl opacity-30 dark:opacity-10 animate-cloud4" />

        {/* Distant hills */}
        <div className="absolute bottom-20 w-full h-72">
          <div className="absolute bottom-0 left-0 right-0 h-56 bg-green-600/30 dark:bg-emerald-900/30 rounded-[100%] blur-sm -ml-20 -mr-20 transform scale-x-[1.2] translate-y-16" />
          <div className="absolute bottom-0 left-10 right-10 h-48 bg-green-700/40 dark:bg-emerald-800/40 rounded-[100%] blur-sm -ml-20 -mr-20 transform scale-x-[1.3] translate-y-10" />
          <div className="absolute bottom-0 left-20 right-20 h-40 bg-green-800/50 dark:bg-emerald-700/40 rounded-[100%] blur-sm -ml-10 -mr-10 transform scale-x-[1.4]" />
        </div>

        {/* Grass at the bottom */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-500 to-green-500/0 dark:from-green-700 dark:to-green-700/0 backdrop-blur-sm" />
      </div>
    </div>
  );
};

export default GhibliBackground;
