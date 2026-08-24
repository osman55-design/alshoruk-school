import React, { useState } from 'react';
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';
import ResultsSection from './components/ResultsSection';
import TransportSection from './components/TransportsSection';
import SupervisorsSection from './components/ClassSupervisorsSection';

export default function AdminSystem({ currentUser, onLogout, goToLanding }) {
  const [activeTab, setActiveTab] = useState('students');

  const navBtnStyle = (isActive) => ({
    padding: '7px 14px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
    backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.15)',
    color: isActive ? '#047857' : '#ffffff',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* هيدر النظام الداخلي */}
      <header style={{ padding: '12px 4%', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', boxShadow: '0 4px 15px rgba(4,120,87,0.15)', borderBottom: '3px solid #f59e0b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="logo.png" alt="logo" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #f59e0b' }} />
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '900' }}>لوحة التحكم والإدارة الإدارية</h3>
              <span style={{ color: '#fef08a', fontSize: '11px', fontWeight: 'bold' }}>المستخدم: {currentUser?.name} ({currentUser?.role})</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={goToLanding} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>🏠 الواجهة الرئيسية</button>
            <button onClick={onLogout} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '6px 12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>خروج 🚪</button>
          </div>
        </div>

        {/* أزرار التنقل السريع */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          {currentUser?.permissions?.admin && (
            <button style={navBtnStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>إدارة المستخدمين والصلاحيات ⚙️</button>
          )}
          {(currentUser?.permissions?.students || currentUser?.permissions?.admin) && (
            <button style={navBtnStyle(activeTab === 'students')} onClick={() => setActiveTab('students')}>شؤون الطلاب 📚</button>
          )}
          {(currentUser?.permissions?.classes || currentUser?.permissions?.admin) && (
            <button style={navBtnStyle(activeTab === 'classes')} onClick={() => setActiveTab('classes')}>الفصول 🏛️</button>
          )}
          {(currentUser?.permissions?.teachers || currentUser?.permissions?.admin) && (
            <button style={navBtnStyle(activeTab === 'teachers')} onClick={() => setActiveTab('teachers')}>المعلمين 👨‍🏫</button>
          )}
          {(currentUser?.permissions?.finance || currentUser?.permissions?.admin) && (
            <button style={navBtnStyle(activeTab === 'accounts')} onClick={() => setActiveTab('accounts')}>الحسابات والمالية 💰</button>
          )}
          {(currentUser?.permissions?.results || currentUser?.permissions?.admin) && (
            <button style={navBtnStyle(activeTab === 'results')} onClick={() => setActiveTab('results')}>النتائج والشهادات 📋</button>
          )}
          {(currentUser?.permissions?.transport || currentUser?.permissions?.admin) && (
            <button style={navBtnStyle(activeTab === 'transport')} onClick={() => setActiveTab('transport')}>التراحيل 🚌</button>
          )}
          {(currentUser?.permissions?.supervisors || currentUser?.permissions?.admin) && (
            <button style={navBtnStyle(activeTab === 'supervisors')} onClick={() => setActiveTab('supervisors')}>المشرفات 👩‍💼</button>
          )}
        </div>
      </header>

      {/* عرض القسم المختار */}
      <main style={{ padding: '20px 4%', flex: '1', boxSizing: 'border-box' }}>
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', width: '100%', overflowX: 'auto' }}>
          {activeTab === 'students' && <StudentsSection currentUser={currentUser} />}
          {activeTab === 'classes' && <ClassesSection currentUser={currentUser} />}
          {activeTab === 'teachers' && <TeachersSection />}
          {activeTab === 'accounts' && <AccountsSection />}
          {activeTab === 'results' && <ResultsSection />}
          {activeTab === 'transport' && <TransportSection />}
          {activeTab === 'supervisors' && <SupervisorsSection />}
          {activeTab === 'dashboard' && <DashboardSection onBack={() => setActiveTab('students')} />}
        </div>
      </main>
    </div>
  );
}
