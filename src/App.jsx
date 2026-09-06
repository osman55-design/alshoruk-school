import React, { useState } from 'react';
import LandingPage from './LandingPage';
import AdminSystem from './AdminSystem';
import { supabase } from './supabaseClient'; // أو حسب مسار ملف supabase لديكِ

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState('landing');

  // حالات نموذج الدخول
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // دالة تسجيل الدخول عبر Supabase
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // البحث عن المستخدم في جدول users
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.trim())
        .eq('password', password.trim())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة!');
        setLoading(false);
        return;
      }

      // تجهيز بيانات المستخدم الصريحة
      const userObj = {
        id: data.id,
        name: data.name || data.username,
        username: data.username,
        role: data.role || 'admin',
        permissions: typeof data.permissions === 'string' 
          ? JSON.parse(data.permissions) 
          : (data.permissions || { admin: true })
      };

      setCurrentUser(userObj);
      setShowLoginModal(false);
      setCurrentView('admin');
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء الاتصال بقاعدة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  return (
    <div>
      {/* 1. عرض لوحة التحكم أو الواجهة الرئيسية */}
      {currentView === 'admin' && currentUser ? (
        <AdminSystem 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          goToLanding={() => setCurrentView('landing')} 
        />
      ) : (
        <LandingPage 
          currentUser={currentUser} 
          onOpenLogin={() => setShowLoginModal(true)} 
          onOpenAdmin={() => setCurrentView('admin')}
          onLogout={handleLogout} 
        />
      )}

      {/* 2. نافذة تسجيل الدخول المدمجة (تفتح عند الضغط على بوابة النظام) */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          direction: 'rtl',
          fontFamily: "'Segoe UI', Roboto, sans-serif"
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '25px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '380px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#047857', fontSize: '17px', fontWeight: 'bold' }}>🔐 تسجيل الدخول للنظام</h3>
              <button 
                onClick={() => setShowLoginModal(false)} 
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px', border: '1px solid #fee2e2' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>اسم المستخدم:</label>
                <input 
                  type="text" 
                  required
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>كلمة المرور:</label>
                <input 
                  type="password" 
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  backgroundColor: '#047857',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  fontSize: '13px'
                }}
              >
                {loading ? 'جاري التحقق...' : 'دخول للنظام 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
