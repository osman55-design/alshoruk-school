import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import AdminSystem from './AdminSystem';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' أو 'admin'

  // استرجاع حالة تسجيل الدخول من التخزين المحلي عند فتح التطبيق
  useEffect(() => {
    const savedUser = localStorage.getItem('shurooq_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("خطأ في قراءة بيانات الجلسة المخزنة", e);
        localStorage.removeItem('shurooq_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('shurooq_user', JSON.stringify(user));
    setCurrentView('admin'); // الانتقال التلقائي لنظام الإدارة بعد الدخول
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('shurooq_user');
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

  // في حال حاول الانتقال للإدارة وهو غير مسجّل، نرجعه للرئيسية
  return (
    <LandingPage 
      currentUser={currentUser} 
      onLoginSuccess={handleLoginSuccess}
      onOpenAdmin={() => setCurrentView('admin')}
      onLogout={handleLogout}
    />
  );
}
