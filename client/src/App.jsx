import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { SettingsProvider } from './context/SettingsContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CyberGridBackground from './components/CyberGridBackground';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!currentUser) return <Navigate to="/login" />;
  
  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      <CyberGridBackground />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};



function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <SocketProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#fff',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                backdropFilter: 'blur(8px)',
              },
            }}
          />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </SocketProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
