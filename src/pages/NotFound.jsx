// Import React to define the 404 component
import React from 'react';
// Import Link and useNavigate from react-router-dom for navigation
import { Link, useNavigate } from 'react-router-dom';
// Import Lucide icons for modern visuals
import { Home, ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    // Full screen wrapper with overflow hidden for the background effects
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden p-6">
      
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-[10%] left-[15%] w-72 md:w-96 h-72 md:h-96 bg-primary/20 rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-[10%] right-[15%] w-72 md:w-96 h-72 md:h-96 bg-purple-500/15 rounded-full blur-3xl opacity-60" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[30%] w-64 h-64 bg-success/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-xl bg-card/80 dark:bg-card/60 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-[2rem] p-8 md:p-14 text-center shadow-2xl shadow-primary/5">
        
        {/* Animated Icon Wrapper */}
        <div className="relative inline-flex items-center justify-center w-28 h-28 mb-8">
          {/* Pulsing ring behind the icon */}
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75" />
          {/* Inner circle with icon */}
          <div className="relative bg-card dark:bg-slate-800 border-[3px] border-primary/30 p-6 rounded-full shadow-xl shadow-primary/20">
            <SearchX className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* 404 Hero Error Code with Gradient */}
        <h1 className="text-8xl md:text-9xl font-black font-roboto tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-500 to-purple-600 mb-2 drop-shadow-sm">
          404
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-3xl md:text-4xl font-bold text-text-dark tracking-tight mb-4">
          Page Not Found
        </h2>
        
        {/* Helper description text */}
        <p className="text-text-gray mb-10 text-base md:text-lg leading-relaxed max-w-md mx-auto">
          The page you are looking for might have been moved, deleted, or perhaps never existed. Let's get you back on track.
        </p>

        {/* Action Buttons Grid/Flex */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-text-dark hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50 rounded-xl font-bold transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          <Link 
            to="/" 
            className="group flex items-center justify-center space-x-2 px-6 py-3.5 w-full sm:w-auto bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
