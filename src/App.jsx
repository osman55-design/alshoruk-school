import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Login from './Login';
import AdminSystem from './AdminSystem';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'admin'
  const [currentUser, setCurrentUser] = useState(null);

  // عند نجاح عملية تسجيل الدخول من ملف Login.jsx
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('admin');
  };

  // عند تسجيل الخروج
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  return (
    <div>
      {/* 1. الواجهة الرئيسية */}
      {currentView === 'landing' && (
        <LandingPage onGoToPortal={() => setCurrentView('login')} />
      )}

      {/* 2. شاشة تسجيل الدخول */}
      {currentView === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          goToLanding={() => setCurrentView('landing')}
        />
      )}

      {/* 3. لوحة التحكم والإدارة */}
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
