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

  // تصميم المربع الزجاجي الفاخر
  const navCardStyle = (isActive) => ({
    padding: '12px 16px',
    borderRadius: '12px',
    border: isActive ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.25)',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#ffffff',
    transition: 'all 0.25s ease',
    boxShadow: isActive ? '0 6px 20px rgba(0, 0, 0, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* هيدر شريط الإدارة العلوي */}
      <header style={{ padding: '16px 4%', background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)', boxShadow: '0 4px 20px rgba(4,120,87,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          
          {/* الشعار واسم النظام */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)' }}>
              <img src="/logo.png" alt="logo" onError={(e) => { e.target.src = "https://placehold.co/100?text=Logo"; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>لوحة التحكم والإدارة</h3>
              <span style={{ color: '#a7f3d0', fontSize: '12px', fontWeight: '600' }}>
                المستخدم: {currentUser?.full_name || currentUser?.username || 'مستخدم'} ({currentUser?.role || 'إداري'})
              </span>
            </div>
          </div>

          {/* زر الخروج */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={onLogout} 
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              خروج 🚪
            </button>
          </div>
        </div>

        {/* شبكة المربعات الزجاجية للأقسام */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', 
          gap: '10px', 
          paddingTop: '8px', 
          borderTop: '1px solid rgba(255,255,255,0.15)' 
        }}>
          {isAdmin && (
            <button style={navCardStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>إدارة المستخدمين والصلاحيات ⚙️</button>
          )}

          {isAdmin && (
            <button style={navCardStyle(activeTab === 'home_settings')} onClick={() => setActiveTab('home_settings')}>إدارة الصفحة الرئيسية 🌐</button>
          )}
          
          {hasPermission('students', 'can_manage_students') && (
            <button style={navCardStyle(activeTab === 'students')} onClick={() => setActiveTab('students')}>شؤون الطلاب 📚</button>
          )}
          
          {hasPermission('classes', 'can_manage_classes') && (
            <button style={navCardStyle(activeTab === 'classes')} onClick={() => setActiveTab('classes')}>الفصول 🏛️</button>
          )}
          
          {hasPermission('teachers', 'can_manage_teachers') && (
            <button style={navCardStyle(activeTab === 'teachers')} onClick={() => setActiveTab('teachers')}>المعلمين 👨‍🏫</button>
          )}
          
          {hasPermission('finance', 'can_manage_finance') && (
            <button style={navCardStyle(activeTab === 'accounts')} onClick={() => setActiveTab('accounts')}>الحسابات والمالية 💰</button>
          )}
          
          {hasPermission('results', 'can_manage_results') && (
            <button style={navCardStyle(activeTab === 'results')} onClick={() => setActiveTab('results')}>النتائج والشهادات 📋</button>
          )}
          
          {hasPermission('transport', 'can_manage_transport') && (
            <button style={navCardStyle(activeTab === 'transport')} onClick={() => setActiveTab('transport')}>التراحيل 🚌</button>
          )}
          
          {hasPermission('supervisors', 'can_manage_supervisors') && (
            <button style={navCardStyle(activeTab === 'supervisors')} onClick={() => setActiveTab('supervisors')}>المشرفات 👩‍💼</button>
          )}
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
