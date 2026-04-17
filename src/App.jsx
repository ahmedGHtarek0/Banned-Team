import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import CalendarPage from './pages/CalendarPage';
import BookingsPage from './pages/BookingsPage';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useApp();
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/calendar" element={
        <ProtectedRoute roles={['ADMIN', 'BRANCH_MANAGER']}>
          <CalendarPage />
        </ProtectedRoute>
      } />

      <Route path="/bookings" element={
        <ProtectedRoute>
          <BookingsPage />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute roles={['ADMIN', 'BRANCH_MANAGER']}>
          <Settings />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
