import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

// Lazy load pages for performance optimization
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * Premium Page Loader Fallback
 */
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary"></div>
    <span className="text-xs font-bold text-text-gray uppercase tracking-wider animate-pulse">
      Loading workspace...
    </span>
  </div>
);

/**
 * ProtectedRoute Component
 * Guards private CRM routes, redirecting unauthenticated users to /login.
 */
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  const hasToken = token || localStorage.getItem('crm-token');
  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * Main AppRoutes Routing Configuration
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Application Workspace Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
