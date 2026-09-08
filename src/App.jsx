import React, { useState } from 'react';
import LandingPage from './LandingPage';
import AdminSystem from './AdminSystem';

export default function App() {
  // حالة التحكم بالشاشة المعروضة: 'landing' | 'login' | 'admin'
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  // حالات تسجيل الدخول
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // دالة التعامل مع تسجيل الدخول
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (email && password) {
      // إسناد صلاحية الآدمن والمستخدم
      setCurrentUser({ email, role: 'admin' });
      setCurrentPage('admin');
    } else {
      setLoginError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
    }
  };

  // 1. عرض لوحة تحكم النظام (AdminSystem) عند تسجيل الدخول
  if (currentPage === 'admin' && currentUser) {
    return (
      <AdminSystem 
        user={currentUser} 
        onLogout={() => {
          setCurrentUser(null);
          setCurrentPage('landing');
        }} 
      />
    );
  }

  // 2. عرض صفحة تسجيل الدخول المستقلة تماماً
  if (currentPage === 'login') {
    return (
      <div style={loginStyles.pageContainer}>
        <div style={loginStyles.card}>
          <div style={loginStyles.header}>
            <span style={{ fontSize: '42px' }}>🏫</span>
            <h2 style={loginStyles.title}>بوابة دخول النظام</h2>
            <p style={loginStyles.subtitle}>مدرسة الشروق السودانية المتكاملة</p>
          </div>

          {loginError && <div style={loginStyles.errorAlert}>{loginError}</div>}

          <form onSubmit={handleLoginSubmit} style={loginStyles.form}>
            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={loginStyles.input}
                placeholder="admin@school.com"
              />
            </div>

            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={loginStyles.input}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" style={loginStyles.loginBtn}>
              دخول لوحة التحكم 🚀
            </button>
          </form>

          <button 
            type="button" 
            onClick={() => setCurrentPage('landing')} 
            style={loginStyles.backBtn}
          >
            ← العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // 3. عرض الصفحة الرئيسية (LandingPage)
  return <LandingPage goToLogin={() => setCurrentPage('login')} />;
}

// تنسيقات صفحة تسجيل الدخول المستقلة
const loginStyles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#065f46',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    direction: 'rtl',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
    textAlign: 'center',
  },
  header: {
    marginBottom: '25px',
  },
  title: {
    color: '#065f46',
    margin: '10px 0 5px 0',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#d97706',
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '15px',
    border: '1px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    textAlign: 'right',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    outline: 'none',
  },
  loginBtn: {
    backgroundColor: '#065f46',
    color: '#ffffff',
    border: '2px solid #d97706',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '25px',
    textDecoration: 'underline',
  },
};
