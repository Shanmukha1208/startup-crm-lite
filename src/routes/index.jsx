// Import React, lazy code loading helper, and Suspense fallback wrapper
import React, { lazy, Suspense } from 'react';
// Import routing components from react-router-dom to build path maps
import { Routes, Route } from 'react-router-dom';
// Import Layout layout structure component
import Layout from '../components/Layout';

// Define the lazy-loaded components to improve start performance by splitting modules
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Create a premium looking loading spinner fallback component while bundle chunks load
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    {/* Infinite spin ring helper */}
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary"></div>
    {/* Informative loading message */}
    <span className="text-xs font-bold text-text-gray uppercase tracking-wider animate-pulse">
      Loading workspace...
    </span>
  </div>
);

// Define and export the main AppRoutes routing component
export default function AppRoutes() {
  return (
    // Wrap entire routing block in Suspense, displaying our custom PageLoader fallback when lazy loading chunks
    <Suspense fallback={<PageLoader />}>
      {/* Container holding all separate route maps */}
      <Routes>
        
        {/* Parent route wrapping all pages utilizing our primary Sidebar layout */}
        <Route path="/" element={<Layout />}>
          
          {/* Index route at path "/" resolves to the Dashboard component */}
          <Route index element={<Dashboard />} />
          
          {/* Sub-route path "/leads" resolves to the Lead Management page component */}
          <Route path="leads" element={<Leads />} />
          
          {/* Sub-route path "/analytics" resolves to the Analytics charts page component */}
          <Route path="analytics" element={<Analytics />} />

        </Route>
        
        {/* Standalone catch-all path "*" mapping invalid paths to the NotFound 404 page component */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}
