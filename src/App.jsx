import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// استدعاء كافة المكونات والشاشات
import StudentsSection from './components/StudentsSection';
import ResultsSection from './components/ResultsSection';
import SchedulesSection from './components/SchedulesSection';
import ClassSupervisorsSection from './components/ClassSupervisorsSection';
import AccountsSection from './components/AccountsSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('students');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // جلب بيانات الجلسة الحالية للمستخدم
    const session = supabase.auth.getSession();
    if (session) {
      setCurrentUser({ name: 'المسؤول', permissions: { admin: true } });
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* 1️⃣ شريط التنقل العلوي (Navbar) */}
      <header style={{ backgroundColor: '#0f172a', padding: '15px 24px', color: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap', gap: '12px' }}>
          
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏫 نظام إدارة المدرسة الشامل
          </h1>

          {/* أزرار التنقل الرئيسية */}
          <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button style={navBtnStyle(activeTab === 'students')} onClick={() => setActiveTab('students')}>
              👨‍🎓 الطلاب والعام الدراسي
            </button>

            <button style={navBtnStyle(activeTab === 'results')} onClick={() => setActiveTab('results')}>
              📋 الدرجات والنتائج
            </button>

            <button style={navBtnStyle(activeTab === 'schedules')} onClick={() => setActiveTab('schedules')}>
              🗓️ الحصص والامتحانات
            </button>

            <button style={navBtnStyle(activeTab === 'accounts')} onClick={() => setActiveTab('accounts')}>
              💰 الحسابات والمالية
            </button>

            <button style={navBtnStyle(activeTab === 'supervisors')} onClick={() => setActiveTab('supervisors')}>
              👩‍🏫 مشرفو الفصول
            </button>
          </nav>

        </div>
      </header>

      {/* 2️⃣ منطقة عرض الشاشة الحالية */}
      <main style={{ maxWidth: '1400px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* شاشة الطلاب والعام الدراسي */}
        {activeTab === 'students' && (
          <StudentsSection onBack={() => setActiveTab('students')} />
        )}

        {/* شاشة الدرجات والنتائج */}
        {activeTab === 'results' && (
          <ResultsSection onBack={() => setActiveTab('students')} />
        )}

        {/* شاشة الحصص والامتحانات */}
        {activeTab === 'schedules' && (
          <SchedulesSection onBack={() => setActiveTab('students')} />
        )}

        {/* شاشة الحسابات والمالية */}
        {activeTab === 'accounts' && (
          <AccountsSection onBack={() => setActiveTab('students')} />
        )}

        {/* شاشة مشرفي الفصول */}
        {activeTab === 'supervisors' && (
          <ClassSupervisorsSection onBack={() => setActiveTab('students')} />
        )}

      </main>

    </div>
  );
}

// تنسيق أزرار التنقل Navbar
const navBtnStyle = (active) => ({
  padding: '9px 16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: active ? '#10b981' : '#1e293b',
  color: active ? '#ffffff' : '#cbd5e1',
  fontWeight: 'bold',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: active ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
});
