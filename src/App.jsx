import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import DashboardSection from './DashboardSection';
import AdminSystem from './AdminSystem';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard', 'admin'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user session:", e);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('app_user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_user');
    setCurrentView('landing');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {currentView === 'landing' && (
        <LandingPage 
          onLoginSuccess={handleLogin} 
          onOpenAdmin={() => setCurrentView('admin')} 
        />
      )}

      {currentView === 'dashboard' && (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>مرحباً بك، {currentUser?.full_name || 'المستخدم'}</h2>
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              تسجيل الخروج
            </button>
          </header>
          
          <DashboardSection onBack={() => setCurrentView('landing')} currentUser={currentUser} />
        </div>
      )}

      {currentView === 'admin' && (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <AdminSystem onBack={() => setCurrentView('landing')} />
        </div>
      )}
    </div>
  );
}
