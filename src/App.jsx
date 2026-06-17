// Import React core library to support JSX tags
import React from 'react';
// Import BrowserRouter wrapper from react-router-dom to maintain navigation history states
import { BrowserRouter } from 'react-router-dom';
// Import our centralized routes component holding route definitions
import AppRoutes from './routes';

// Define the root App component
function App() {
  return (
    // Wrap entire routing system in BrowserRouter to coordinate path updates and browser address bar states
    <BrowserRouter>
      {/* Render the application routing maps containing page definitions and Layout frame */}
      <AppRoutes />
    </BrowserRouter>
  );
}

// Export the App component as standard default to be bootstrap-mounted by main.jsx
export default App;
