// Import React to define the 404 component
import React from 'react';
// Import Link from react-router-dom to navigate without reloading the page
import { Link } from 'react-router-dom';
// Import Lucide icons to add visuals to the 404 presentation
import { Home, AlertCircle } from 'lucide-react';

// Define and export the NotFound 404 component
export default function NotFound() {
  // Return the JSX representing the full-screen 404 error layout
  return (
    // Centered flex layout for full view height and width, matching the dashboard base styling
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      
      {/* Visual illustration containing an alert badge icon */}
      <div className="mb-6 p-5 bg-danger/10 text-danger rounded-full inline-block animate-bounce">
        <AlertCircle className="w-12 h-12" />
      </div>

      {/* Hero numeric error code */}
      <h1 className="text-8xl font-black font-roboto text-slate-800 tracking-tight">404</h1>
      
      {/* Subtitle status label */}
      <h2 className="text-2xl font-bold text-slate-700 mt-4 mb-2">Page Not Found</h2>
      
      {/* Helper text explaining the error */}
      <p className="text-text-gray max-w-md mb-8 text-sm md:text-base">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Button redirecting the user back home to "/" using React Router Link */}
      <Link 
        to="/" 
        className="flex items-center space-x-2 px-5 py-3 bg-primary text-white rounded-xl font-semibold shadow-md shadow-primary/20 hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 cursor-pointer text-sm"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>

    </div>
  );
}
