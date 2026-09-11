import React, { useState } from 'react';
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';
import ResultsSection from './components/ResultsSection';
import TransportSection from './components/TransportSection';
import SupervisorsSection from './components/ClassSupervisorsSection';
import HomeSettingsSection from './components/HomeSettingsSection';

export default function AdminSystem({ currentUser, onLogout, goToLanding }) {
  const [activeTab, setActiveTab] = useState('home_settings');

  const isAdmin = 
    currentUser?.role === 'admin' || 
    currentUser?.role === 'مدير' || 
    currentUser?.role === 'أدمن' || 
    currentUser?.can_manage_admin === true || 
    currentUser?.permissions?.admin === true;

  const hasPermission = (key, canManageKey) => {
    if (isAdmin) return true;
    if (currentUser?.permissions && currentUser.permissions[key]) return true;
    if (currentUser && currentUser[canManageKey] === true) return true;
    return false;
  };

  // قائمة الأقسام مع تخصيص لون مميز وعصري لكل زر
  const tabsList = [
    { id: 'home_settings', label: 'إدارة الصفحة الرئيسية 🌐', color: 'linear-gradient(135deg, #059669, #10b981)', show: isAdmin },
    { id: 'dashboard', label: 'المستخدمين والصلاحيات ⚙️', color: 'linear-gradient(135deg, #4f46e5, #6366f1)', show: isAdmin },
    { id: 'students', label: 'شؤون الطلاب 📚', color: 'linear-gradient(135deg, #0284c7, #38bdf8)', show: hasPermission('students', 'can_manage_students') },
    { id: 'classes', label: 'الفصول 🏛️', color: 'linear-gradient(135deg, #7c3aed, #a855f7)', show: hasPermission('classes', 'can_manage_classes') },
    { id: 'teachers', label: 'المعلمين 👨‍🏫', color: 'linear-gradient(135deg, #ea580c, #fb923c)', show: hasPermission('teachers', 'can_manage_teachers') },
    { id: 'accounts', label: 'الحسابات والمالية 💰', color: 'linear-gradient(135deg, #16a34a, #4ade80)', show: hasPermission('finance', 'can_manage_finance') },
    { id: 'results', label: 'النتائج والشهادات 📋', color: 'linear-gradient(135deg, #9333ea, #c084fc)', show: hasPermission('results', 'can_manage_results') },
    { id: 'transport', label: 'التراحيل 🚌', color: 'linear-gradient(135deg, #0d9488, #2dd4bf)', show: hasPermission('transport', 'can_manage_transport') },
    { id: 'supervisors', label: 'المشرفات 👩‍💼', color: 'linear-gradient(135deg, #db2777, #f472b6)', show: hasPermission('supervisors', 'can_manage_supervisors') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* هيدر شريط الإدارة العلوي */}
      <header style={{ padding: '16px 4%', background: 'linear-gradient(135deg, #0f172a 1e-3%, #1e293b 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* الجزء العلوي: الشعار، بيانات المستخدم، وزر الخروج العصري */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* الشعار واسم النظام */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
              <img src="/logo.png" alt="logo" onError={(e) => { e.target.src = "https://placehold.co/100?text=Logo"; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>لوحة التحكم والإدارة</h3>
              <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>
                المستخدم: <strong style={{ color: '#e2e8f0' }}>{currentUser?.full_name || currentUser?.username || 'مستخدم'}</strong> ({currentUser?.role || 'إداري'})
              </span>
            </div>
          </div>

          {/* 🚪 زر خروج عصري وجذاب بتصميم تفاعلي */}
          <button 
            onClick={onLogout} 
            style={{ 
              background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              fontSize: '13px', 
              display: 'flex', 
              alignItem: 'center', 
              gap: '8px', 
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>خروج آمن</span>
            <span style={{ fontSize: '15px' }}>🚪</span>
          </button>
        </div>

        {/* أزرار الأقسام الأفقية الملونة والعصرية (بنفس نمط الأزرار المجاورة وبحجم مدمج ومرتب) */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px', 
          alignItems: 'center', 
          paddingTop: '12px', 
          borderTop: '1px solid rgba(255,255,255,0.1)' 
        }}>
          {tabsList.map((tab) => {
            if (!tab.show) return null;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: tab.color,
                  color: '#ffffff',
                  border: isActive ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 6px 20px rgba(0,0,0,0.3)' : '0 3px 10px rgba(0,0,0,0.15)',
                  transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* محتوى القسم النشط */}
      <main style={{ padding: '24px 4%', flex: '1', boxSizing: 'border-box' }}>
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', width: '100%', overflowX: 'auto' }}>
          {activeTab === 'students' && <StudentsSection currentUser={currentUser} />}
          {activeTab === 'classes' && <ClassesSection currentUser={currentUser} />}
          {activeTab === 'teachers' && <TeachersSection currentUser={currentUser} />}
          {activeTab === 'accounts' && <AccountsSection currentUser={currentUser} />}
          {activeTab === 'results' && <ResultsSection currentUser={currentUser} />}
          {activeTab === 'transport' && <TransportSection currentUser={currentUser} />}
          {activeTab === 'supervisors' && <SupervisorsSection currentUser={currentUser} />}
          {activeTab === 'dashboard' && <DashboardSection onBack={() => setActiveTab('students')} />}
          {activeTab === 'home_settings' && <HomeSettingsSection />}
        </div>
      </main>

    </div>
  );
}
