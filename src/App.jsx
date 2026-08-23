import React, { useState, useEffect } from 'react';

// كود التطبيق الأساسي بتصميم عصري زجاجي وبدون الاعتماد على ملفات خارجية مفقودة
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('landing');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('school_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = {
      name: username || 'المسؤول',
      role: 'admin',
      permissions: { admin: true }
    };
    setCurrentUser(userData);
    localStorage.setItem('school_user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('school_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('landing');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f766e 100%)', fontFamily: "'Segoe UI', Roboto, sans-serif", direction: 'rtl', color: '#ffffff' }}>
      
      {/* 🟢 الشريط العلوي الزجاجي الفاخر */}
      <header style={{
        background: 'rgba(6, 78, 59, 0.65)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '14px 4%',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
          <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '3px', borderRadius: '50%', display: 'flex', boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)' }}>
            <span style={{ fontSize: '24px', padding: '4px' }}>🏫</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '19px', fontWeight: '900', background: 'linear-gradient(90deg, #ffffff, #fef08a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>مدرسة الشروق الخاصة</h1>
            <span style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: '600' }}>منظومة الإدارة الذكية المتكاملة</span>
          </div>
        </div>

        {!isLoggedIn ? (
          <button style={loginBtnStyle} onClick={() => setShowLoginModal(true)}>
            🔐 دخول النظام
          </button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            
            <div style={{ color: '#fef08a', fontWeight: 'bold', fontSize: '12.5px', background: 'rgba(255, 255, 255, 0.08)', padding: '7px 15px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👤</span> {currentUser?.name}
            </div>

            <NavPill active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="⚙️" label="لوحة الإدارة" />
            <NavPill active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon="📚" label="الطلاب" />
            <NavPill active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} icon="🏛️" label="الفصول" />
            <NavPill active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} icon="👨‍🏫" label="المعلمين" />
            <NavPill active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} icon="📖" label="المواد" />
            <NavPill active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} icon="💰" label="الحسابات" />
            <NavPill active={activeTab === 'results'} onClick={() => setActiveTab('results')} icon="📋" label="النتيجة" />
            <NavPill active={activeTab === 'transport'} onClick={() => setActiveTab('transport')} icon="🚌" label="التراحيل" />
            <NavPill active={activeTab === 'supervisors'} onClick={() => setActiveTab('supervisors')} icon="👩‍💼" label="المشرفات" />

            <button onClick={handleLogout} style={logoutBtnStyle}>
              🚪 خروج
            </button>
          </div>
        )}
      </header>

      {/* 📄 المحتوى الرئيسي */}
      <main style={{ padding: '30px 4%', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'landing' ? (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '45px 30px', borderRadius: '28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', margin: '10px 0', color: '#ffffff' }}>مرحباً بكم في مدرسة الشروق الخاصة</h2>
            <p style={{ color: '#a7f3d0' }}>الرجاء تسجيل الدخول للوصول إلى لوحة التحكم والبيانات.</p>
          </div>
        ) : (
          <div style={{ background: 'rgba(255, 255, 255, 0.96)', color: '#0f172a', padding: '25px', borderRadius: '24px', minHeight: '400px' }}>
            <h2 style={{ color: '#047857', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              قسم: {activeTab}
            </h2>
            <p style={{ color: '#475569' }}>تم تحميل الواجهة بنجاح وبشكل متوافق مع كافة الأجهزة.</p>
          </div>
        )}
      </main>

      {/* 🔐 نافذة تسجيل الدخول */}
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 44, 34, 0.75)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <form onSubmit={handleLogin} style={{ background: 'rgba(6, 78, 59, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '35px', borderRadius: '24px', width: '300px', textAlign: 'right' }}>
            <h3 style={{ color: '#fef08a', margin: '0 0 15px 0', textAlign: 'center' }}>تسجيل الدخول</h3>
            <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} style={modalInputStyle} required />
            <input type="password" placeholder="رمز الدخول" value={password} onChange={e => setPassword(e.target.value)} style={modalInputStyle} required />
            <button type="submit" style={loginBtnSubmitStyle}>دخول 🔓</button>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ width: '100%', marginTop: '10px', background: 'transparent', color: '#cbd5e1', border: 'none', cursor: 'pointer' }}>إلغاء</button>
          </form>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '20px', color: '#6ee7b7', fontSize: '14px', marginTop: '40px' }}>
        ✨ تنفيذ وإشراف: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>الأستاذ عثمان صديق (أبو حلا)</span>
      </footer>

    </div>
  );
}

function NavPill({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.07)',
        color: active ? '#ffffff' : '#e2e8f0',
        border: active ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.15)',
        padding: '7px 16px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const loginBtnStyle = { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', border: 'none', padding: '9px 22px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' };
const logoutBtnStyle = { background: 'rgba(239, 68, 68, 0.25)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '7px 16px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' };
const modalInputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box', textAlign: 'right' };
const loginBtnSubmitStyle = { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
