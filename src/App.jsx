import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import DashboardSection from './components/DashboardSection';
import AdminSystem from './components/AdminSystem';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard', 'admin'
  const [currentUser, setCurrentUser] = useState(null);

  // استرجاع جلسة الدخول المسجلة
  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("خطأ في قراءة بيانات المستخدم:", e);
      }
    }
  }, []);

  // عند نجاح تسجيل الدخول
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('app_user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  // عند تسجيل الخروج
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_user');
    setCurrentView('landing');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
      
      {/* 1. الصفحة الرئيسية (تظهر للجميع وبها إمكانية التعديل والربط) */}
      {currentView === 'landing' && (
        <LandingPage 
          currentUser={currentUser}
          onLoginSuccess={handleLogin} 
          onOpenAdmin={() => setCurrentView('admin')} 
          onOpenDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {/* 2. لوحة التحكم العامة للنظام */}
      {currentView === 'dashboard' && (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div>
              <h3 style={{ margin: 0, color: '#0f172a' }}>مرحباً بك، {currentUser?.full_name || 'المستخدم'}</h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>الرتبة: {currentUser?.role || 'زائر'}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* زر إعدادات الإدارة: يظهر لعثمان أو من يملك صلاحية الأدمن */}
              {(currentUser?.username === 'osman' || currentUser?.role === 'أدمن' || currentUser?.can_manage_admin) && (
                <button 
                  onClick={() => setCurrentView('admin')} 
                  style={{ background: '#047857', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ⚙️ لوحة التحكم والصلاحيات
                </button>
              )}

              <button 
                onClick={() => setCurrentView('landing')} 
                style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🏠 الرئيسية
              </button>

              <button 
                onClick={handleLogout} 
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                تسجيل الخروج
              </button>
            </div>
          </header>
          
          <DashboardSection onBack={() => setCurrentView('landing')} currentUser={currentUser} />
        </div>
      )}

      {/* 3. صفحة التحكم الخاصة بالإدارة (عثمان) */}
      {currentView === 'admin' && (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {(currentUser?.username === 'osman' || currentUser?.role === 'أدمن' || currentUser?.can_manage_admin) ? (
            <AdminSystem onBack={() => setCurrentView('dashboard')} currentUser={currentUser} />
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '12px' }}>
              <h3 style={{ color: '#dc2626' }}>⛔ غير مصرح لك بالوصول لصفحة التحكم الإدارية</h3>
              <button onClick={() => setCurrentView('landing')} style={{ marginTop: '15px', padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>العودة للرئيسية</button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
