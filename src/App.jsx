import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import AdminSystem from './AdminSystem';
import { supabase } from './supabaseClient';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'admin'

  // التحقق من الجلسة عند تحميل التطبيق
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // جلب بيانات المستخدم وإذن الصلاحيات من جدول الملفات الشخصية
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser(profile);
        }
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentView('landing');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // تسجيل الدخول
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentView('admin');
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="app-container">
      {currentView === 'landing' ? (
        <LandingPage 
          onLoginSuccess={handleLogin} 
          goToAdmin={() => setCurrentView('admin')}
          currentUser={currentUser}
        />
      ) : (
        <AdminSystem 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          goToLanding={() => setCurrentView('landing')} 
        />
      )}
    </div>
  );
}
