import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AdminSystem from './components/AdminSystem';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  if (currentView === 'landing') {
    return (
      <LandingPage 
        currentUser={currentUser} 
        onLoginSuccess={handleLoginSuccess}
        onOpenAdmin={() => setCurrentView('admin')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'admin' && currentUser) {
    return (
      <AdminSystem 
        currentUser={currentUser} 
        onLogout={handleLogout}
        goToLanding={() => setCurrentView('landing')}
      />
    );
  }

  return (
    <LandingPage 
      currentUser={currentUser} 
      onLoginSuccess={handleLoginSuccess}
      onOpenAdmin={() => setCurrentView('admin')}
      onLogout={handleLogout}
    />
  );
}
