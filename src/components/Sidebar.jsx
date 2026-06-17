// Import React to build the navigation panel UI
import React from 'react';
// Import NavLink from react-router-dom to manage navigation and detect active states
import { NavLink } from 'react-router-dom';
// Import icons from lucide-react to render beautiful visual labels for pages
import { LayoutDashboard, Users, BarChart3, Rocket } from 'lucide-react';

// Define the Sidebar component
export default function Sidebar() {
  // Define navigation configuration matching the required paths and icons
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Lead Management', path: '/leads', icon: Users },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 }
  ];

  // Return the JSX representation of the sidebar panel
  return (
    // Outer navigation container: fixed height, border separator, styled background
    <aside className="w-64 bg-card border-r border-slate-200/60 h-screen flex flex-col justify-between shrink-0">
      
      {/* Upper section containing logo and menu items */}
      <div className="flex flex-col py-6 space-y-8">
        
        {/* Brand header logo container */}
        <div className="flex items-center space-x-3 px-6">
          <div className="p-2 bg-primary text-white rounded-xl shadow-md shadow-primary/20">
            <Rocket className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-text-dark tracking-tight leading-none">CRM Lite</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-gray mt-1">Startup Edition</span>
          </div>
        </div>

        {/* Navigation list items */}
        <nav className="flex flex-col space-y-1.5 px-4">
          {navItems.map((item) => {
            // Reference the icon component dynamically
            const IconComponent = item.icon;

            return (
              // Use NavLink from react-router-dom. It receives a function that passes isActive state
              <NavLink
                key={item.path}
                to={item.path}
                // Custom function to dynamic apply active vs inactive class styles
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold scale-[1.02]' 
                      : 'text-text-gray hover:bg-slate-100/80 hover:text-text-dark font-medium'
                  }`
                }
              >
                {/* Highlight/render active icon color dynamically by inheriting parent text class */}
                <IconComponent className="w-5 h-5 shrink-0" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account overview slot block inside sidebar bottom */}
      <div className="p-4 border-t border-slate-100 flex items-center space-x-3">
        {/* Mock user initial badge */}
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
          JD
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-text-dark truncate">John Doe</span>
          <span className="text-[10px] text-text-gray truncate">admin@crmlite.co</span>
        </div>
      </div>

    </aside>
  );
}
