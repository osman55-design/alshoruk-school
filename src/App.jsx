import React, { useState } from 'react';
import LandingPage from './LandingPage';
import AdminSystem from './AdminSystem';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' أو 'admin'

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('admin'); // الانتقال التلقائي لنظام الإدارة بعد الدخول
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // إذا كنا في صفحة الواجهة الرئيسية
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

  // إذا انتقلنا لنظام الإدارة وكان المستخدم مسجلاً
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
