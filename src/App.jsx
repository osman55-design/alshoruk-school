import React, { useState } from 'react';
import LandingPage from './LandingPage';
import AdminSystem from './AdminSystem';

export default function App() {
  // حالة التحكم بالشاشة المعروضة: 'landing' | 'login' | 'admin'
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  // حالات تسجيل الدخول باسم المستخدم وكلمة المرور
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // دالة التعامل مع تسجيل الدخول
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (username.trim() && password.trim()) {
      // إسناد صلاحية الآدمن والمستخدم
      setCurrentUser({ username, role: 'admin' });
      setCurrentPage('admin');
    } else {
      setLoginError('الرجاء إدخال اسم المستخدم وكلمة المرور');
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
            <div style={loginStyles.iconCircle}>🔑</div>
            <h2 style={loginStyles.title}>بوابة دخول النظام</h2>
            <p style={loginStyles.subtitle}>مدرسة الشروق السودانية المتكاملة</p>
          </div>

          {loginError && <div style={loginStyles.errorAlert}>{loginError}</div>}

          <form onSubmit={handleLoginSubmit} style={loginStyles.form}>
            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>اسم المستخدم</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={loginStyles.input}
                placeholder="أدخل اسم المستخدم"
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

// تنسيقات صفحة تسجيل الدخول
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
    maxWidth: '400px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  header: {
    marginBottom: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconCircle: {
    width: '70px',
    height: '70px',
    backgroundColor: '#ecfdf5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    marginBottom: '10px',
  },
  title: {
    color: '#065f46',
    margin: '5px 0',
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
    boxSizing: 'border-box',
    width: '100%',
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
