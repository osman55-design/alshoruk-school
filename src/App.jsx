import React, { useState } from 'react';
import LandingPage from './LandingPage';
import AdminSystem from './AdminSystem';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' أو 'admin'

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    // إذا كان للمستخدم صلاحية دخول نظام الإدارة يتم توجيهه تلقائياً
    if (user?.permissions?.admin || user?.role === 'admin') {
      setCurrentView('admin');
    } else {
      // إذا كان مستخدماً للواجهة فقط (مثل محرر المحتوى) يبدأ في الواجهة الرئيسية
      setCurrentView('landing');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // التحقق هل يحق للمستخدم فتح نظام الإدارة والتحكم
  const canAccessAdminSystem = currentUser && (currentUser?.permissions?.admin || currentUser?.role === 'admin');

  // إذا كنا في نظام الإدارة والمستخدم يملك الصلاحية
  if (currentView === 'admin' && canAccessAdminSystem) {
    return (
      <AdminSystem 
        currentUser={currentUser} 
        onLogout={handleLogout}
        goToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // في جميع الحالات الأخرى نعرض الواجهة الرئيسية مع تمرير الصلاحيات والمستخدم
  return (
    <LandingPage 
      currentUser={currentUser} 
      onLoginSuccess={handleLoginSuccess}
      onOpenAdmin={() => setCurrentView('admin')}
      onLogout={handleLogout}
    />
  );
}
