// Import React to declare layout components
import React from 'react';
// Import Outlet from react-router-dom to display the matched nested route elements
import { Outlet } from 'react-router-dom';
// Import our newly created Sidebar component
import Sidebar from './Sidebar';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Define the Layout component wrapping dashboard structures
export default function Layout() {
  const { isDarkMode, toggleTheme } = useTheme();

  // Return the JSX structure containing Sidebar navigation and Outlet child content
  return (
    // Top container grid: fills entire screen height, uses background system tokens
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      
      {/* Sidebar navigation component fixed on the left hand side */}
      <Sidebar />

      {/* Main content body container layout aligned to the right of the sidebar */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Upper application bar slot to handle header actions, alerts, or notifications */}
        <header className="h-16 border-b border-slate-200/60 bg-card px-6 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs font-semibold text-text-gray">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-text-dark font-bold">Startup CRM Lite</span>
          </div>
          {/* Right Header Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-1.5 text-text-gray hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping"></span>
              <span className="text-xs font-bold text-success uppercase tracking-wider">System Live</span>
            </div>
          </div>
        </header>

        {/* Dynamic page container. Setting up overflow-y-auto enables page scrolling while keeping Sidebar/Header fixed */}
        <div className="flex-1 overflow-y-auto">
          {/* React Router's Outlet component will dynamically render the active page (Dashboard, Leads, Analytics) */}
          <Outlet />
        </div>

      </main>

    </div>
  );
}
