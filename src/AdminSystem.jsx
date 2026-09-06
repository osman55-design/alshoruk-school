import React, { useState, useEffect } from 'react';
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';
import ResultsSection from './components/ResultsSection';
import TransportSection from './components/TransportsSection';
import SupervisorsSection from './components/ClassSupervisorsSection';

export default function AdminSystem({ currentUser, onLogout, goToLanding }) {
  // التحديد التلقائي لشرط التبويب الأولي حسب صلاحيات المستخدم
  const getInitialTab = () => {
    const p = currentUser?.permissions;
    if (p?.admin || currentUser?.role === 'admin') return 'dashboard';
    if (p?.students) return 'students';
    if (p?.classes) return 'classes';
    if (p?.teachers) return 'teachers';
    if (p?.finance) return 'accounts';
    if (p?.results) return 'results';
    if (p?.transport) return 'transport';
    if (p?.supervisors) return 'supervisors';
    return 'students';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [currentUser]);

  const navBtnStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '12.5px',
    backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
    color: isActive ? '#047857' : '#ffffff',
    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    transition: 'all 0.25s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap'
  });

  const glassMainContainer = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '22px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    width: '100%',
    boxSizing: 'border-box',
    overflowX: 'auto'
  };

  const isAdmin = currentUser?.permissions?.admin || currentUser?.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f1f5f9', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* هيدر النظام الداخلي الزجاجي */}
      <header style={{ padding: '14px 5%', background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)', boxShadow: '0 8px 25px rgba(4, 120, 87, 0.15)', borderBottom: '3px solid #f59e0b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="logo.png" alt="logo" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #f59e0b', objectFit: 'cover' }} />
            <div>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '17px', fontWeight: '900', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>لوحة التحكم والإدارة المركزية</h3>
              <span style={{ color: '#fef08a', fontSize: '11.5px', fontWeight: 'bold' }}>👤 المستخدم: {currentUser?.name || currentUser?.username || 'زائر'} ({currentUser?.role || 'غير محدد'})</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={goToLanding} style={{ backgroundColor: '#f59e0b', color: '#ffffff', border: 'none', padding: '7px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', boxShadow: '0 3px 10px rgba(245, 158, 11, 0.3)', transition: 'transform 0.2s' }}>🏠 الواجهة الرئيسية</button>
            <button onClick={onLogout} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '7px 14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>خروج 🚪</button>
          </div>

        </div>

        {/* أزرار التنقل السريع */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
          {isAdmin && (
            <button style={navBtnStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>⚙️ إدارة المستخدمين والصلاحيات</button>
          )}
          {(currentUser?.permissions?.students || isAdmin) && (
            <button style={navBtnStyle(activeTab === 'students')} onClick={() => setActiveTab('students')}>📚 شؤون الطلاب</button>
          )}
          {(currentUser?.permissions?.classes || isAdmin) && (
            <button style={navBtnStyle(activeTab === 'classes')} onClick={() => setActiveTab('classes')}>🏛️ الفصول الدراسية</button>
          )}
          {(currentUser?.permissions?.teachers || isAdmin) && (
            <button style={navBtnStyle(activeTab === 'teachers')} onClick={() => setActiveTab('teachers')}>👨‍🏫 هيئة التدريس</button>
          )}
          {(currentUser?.permissions?.finance || isAdmin) && (
            <button style={navBtnStyle(activeTab === 'accounts')} onClick={() => setActiveTab('accounts')}>💰 الحسابات والمالية</button>
          )}
          {(currentUser?.permissions?.results || isAdmin) && (
            <button style={navBtnStyle(activeTab === 'results')} onClick={() => setActiveTab('results')}>📋 النتائج والشهادات</button>
          )}
          {(currentUser?.permissions?.transport || isAdmin) && (
            <button style={navBtnStyle(activeTab === 'transport')} onClick={() => setActiveTab('transport')}>🚌 خدمة التراحيل</button>
          )}
          {(currentUser?.permissions?.supervisors || isAdmin) && (
            <button style={navBtnStyle(activeTab === 'supervisors')} onClick={() => setActiveTab('supervisors')}>👩‍💼 مشرفات الفصول</button>
          )}
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={{ padding: '24px 4%', flex: '1', boxSizing: 'border-box', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={glassMainContainer}>
          {activeTab === 'students' && <StudentsSection currentUser={currentUser} />}
          {activeTab === 'classes' && <ClassesSection currentUser={currentUser} />}
          {activeTab === 'teachers' && <TeachersSection currentUser={currentUser} />}
          {activeTab === 'accounts' && <AccountsSection currentUser={currentUser} />}
          {activeTab === 'results' && <ResultsSection currentUser={currentUser} />}
          {activeTab === 'transport' && <TransportSection currentUser={currentUser} />}
          {activeTab === 'supervisors' && <SupervisorsSection currentUser={currentUser} />}
          {activeTab === 'dashboard' && <DashboardSection currentUser={currentUser} onBack={() => setActiveTab('students')} />}
        </div>
      </main>

      {/* التذييل */}
      <footer style={{ textAlign: 'center', padding: '14px', color: '#64748b', fontSize: '11.5px', fontWeight: 'bold', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        نظام إدارة مدرسة الشروق السودانية © {new Date().getFullYear()}
      </footer>

    </div>
  );
}
