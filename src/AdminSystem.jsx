import React, { useState } from 'react';
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';
import ResultsSection from './components/ResultsSection';
import TransportSection from './components/TransportSection';
import SupervisorsSection from './components/ClassSupervisorsSection';

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
    backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.18)',
    color: isActive ? '#047857' : '#ffffff',
    transition: 'all 0.2s ease',
    boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* هيدر شريط الإدارة العلوي */}
      <header style={{ padding: '14px 4%', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', boxShadow: '0 4px 15px rgba(4,120,87,0.15)', borderBottom: '3px solid #f59e0b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="logo" onError={(e) => { e.target.src = "https://placehold.co/100?text=Logo"; }} style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #f59e0b', backgroundColor: '#fff' }} />
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '17px', fontWeight: '900' }}>لوحة التحكم والإدارة</h3>
              <span style={{ color: '#fef08a', fontSize: '12px', fontWeight: 'bold' }}>
                المستخدم: {currentUser?.full_name || currentUser?.username || 'مستخدم'} ({currentUser?.role || 'إداري'})
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={goToLanding} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>🏠 الواجهة الرئيسية</button>
            <button onClick={onLogout} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '7px 14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>خروج 🚪</button>
          </div>
        </div>

        {/* أزرار التنقل بين الأقسام */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {/* زر إدارة المستخدمين والصلاحيات يظهر لكِ أنتِ فقط */}
          {isAdmin && (
            <button style={navBtnStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>إدارة المستخدمين والصلاحيات ⚙️</button>
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
            <button style={navBtnStyle(activeTab === 'transport')}>التراحيل 🚌</button>
          )}
          
          {hasPermission('supervisors', 'can_manage_supervisors') && (
            <button style={navBtnStyle(activeTab === 'supervisors')} onClick={() => setActiveTab('supervisors')}>المشرفات 👩‍💼</button>
          )}
        </div>
      </header>

      {/* محتوى القسم النشط */}
      <main style={{ padding: '20px 4%', flex: '1', boxSizing: 'border-box' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', width: '100%', overflowX: 'auto' }}>
          {activeTab === 'students' && <StudentsSection currentUser={currentUser} />}
          {activeTab === 'classes' && <ClassesSection currentUser={currentUser} />}
          {activeTab === 'teachers' && <TeachersSection currentUser={currentUser} />}
          {activeTab === 'accounts' && <AccountsSection currentUser={currentUser} />}
          {activeTab === 'results' && <ResultsSection currentUser={currentUser} />}
          {activeTab === 'transport' && <TransportSection currentUser={currentUser} />}
          {activeTab === 'supervisors' && <SupervisorsSection currentUser={currentUser} />}
          {activeTab === 'dashboard' && <DashboardSection onBack={() => setActiveTab('students')} />}
        </div>
      </main>

    </div>
  );
}
