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
  const [activeTab, setActiveTab] = useState('students');

  // التأكد التام أنكِ الأدمن الرئيسي ومديرة النظام
  const isAdmin = 
    currentUser?.role === 'admin' || 
    currentUser?.role === 'مدير' || 
    currentUser?.role === 'أدمن' || 
    currentUser?.can_manage_admin === true || 
    currentUser?.permissions?.admin === true;

  // فحص الصلاحيات للموظفين العاديين
  const hasPermission = (key, canManageKey) => {
    if (isAdmin) return true; // الأدمن يرى كل الأقسام دائماً
    if (currentUser?.permissions && currentUser.permissions[key]) return true;
    if (currentUser && currentUser[canManageKey] === true) return true;
    return false;
  };

  const navBtnStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.15)',
    color: isActive ? '#065f46' : '#ffffff',
    transition: 'all 0.2s ease',
    boxShadow: isActive ? '0 3px 10px rgba(0,0,0,0.12)' : 'none'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* هيدر شريط الإدارة العلوي بتصميم عصري نظيف */}
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

          {/* أزرار الإجراءات العليا (الواجهة والخروج) */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={goToLanding} 
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}
            >
              🏠 الواجهة الرئيسية
            </button>
            <button 
              onClick={onLogout} 
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              خروج 🚪
            </button>
          </div>
        </div>

        {/* أزرار التنقل بين الأقسام */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {isAdmin && (
            <button style={navBtnStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>إدارة المستخدمين والصلاحيات ⚙️</button>
          )}

          {isAdmin && (
            <button style={navBtnStyle(activeTab === 'home_settings')} onClick={() => setActiveTab('home_settings')}>إدارة الصفحة الرئيسية 🌐</button>
          )}
          
          {hasPermission('students', 'can_manage_students') && (
            <button style={navBtnStyle(activeTab === 'students')} onClick={() => setActiveTab('students')}>شؤون الطلاب 📚</button>
          )}
          
          {hasPermission('classes', 'can_manage_classes') && (
            <button style={navBtnStyle(activeTab === 'classes')} onClick={() => setActiveTab('classes')}>الفصول 🏛️</button>
          )}
          
          {hasPermission('teachers', 'can_manage_teachers') && (
            <button style={navBtnStyle(activeTab === 'teachers')} onClick={() => setActiveTab('teachers')}>المعلمين 👨‍🏫</button>
          )}
          
          {hasPermission('finance', 'can_manage_finance') && (
            <button style={navBtnStyle(activeTab === 'accounts')} onClick={() => setActiveTab('accounts')}>الحسابات والمالية 💰</button>
          )}
          
          {hasPermission('results', 'can_manage_results') && (
            <button style={navBtnStyle(activeTab === 'results')} onClick={() => setActiveTab('results')}>النتائج والشهادات 📋</button>
          )}
          
          {hasPermission('transport', 'can_manage_transport') && (
            <button style={navBtnStyle(activeTab === 'transport')} onClick={() => setActiveTab('transport')}>التراحيل 🚌</button>
          )}
          
          {hasPermission('supervisors', 'can_manage_supervisors') && (
            <button style={navBtnStyle(activeTab === 'supervisors')} onClick={() => setActiveTab('supervisors')}>المشرفات 👩‍💼</button>
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
