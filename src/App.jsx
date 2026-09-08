import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Login from './Login';
import AdminSystem from './AdminSystem';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  return (
    <div>
      {currentView === 'landing' && (
        <LandingPage onGoToPortal={() => setCurrentView('login')} />
      )}

      {currentView === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          goToLanding={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'admin' && (
        <AdminSystem
          currentUser={currentUser}
          onLogout={handleLogout}
          goToLanding={() => setCurrentView('landing')}
        />
      )}
    </div>
  );
}
