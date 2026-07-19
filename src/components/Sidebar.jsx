import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Rocket, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './profile/ProfileModal';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Lead Management', path: '/leads', icon: Users },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  // Helper to compute initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <aside className="w-64 bg-card border-r border-slate-200/60 dark:border-border/60 h-screen flex flex-col justify-between shrink-0">
        {/* Upper section containing logo and menu items */}
        <div className="flex flex-col py-6 space-y-8">
          {/* Brand header logo container */}
          <div className="flex items-center space-x-3 px-6">
            <div className="p-2 bg-primary text-white rounded-xl shadow-md shadow-primary/20">
              <Rocket className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-text-dark tracking-tight leading-none">
                CRM Lite
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-gray mt-1">
                Startup Edition
              </span>
            </div>
          </div>

          {/* Navigation list items */}
          <nav className="flex flex-col space-y-1.5 px-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold scale-[1.02]'
                        : 'text-text-gray hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-text-dark font-medium'
                    }`
                  }
                >
                  <IconComponent className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout button footer */}
        <div className="p-4 border-t border-slate-100 dark:border-border/60 flex items-center justify-between">
          {/* Profile Card Button - Fully Clickable */}
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center space-x-3 min-w-0 flex-1 p-1.5 -ml-1 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer text-left group"
            title="Click to view & edit Profile"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-text-dark truncate group-hover:text-primary transition-colors">
                {user?.name || 'User Profile'}
              </span>
              <span className="text-[10px] text-text-gray truncate">
                {user?.email || 'authenticated'}
              </span>
            </div>
          </button>

          {/* Direct Logout Button */}
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer shrink-0 ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Modern Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
