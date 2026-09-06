import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function LandingPage({ currentUser, onLoginSuccess, onOpenAdmin, onLogout }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // حالة لتخزين بيانات الصفحة القادمة من قاعدة البيانات
  const [siteContent, setSiteContent] = useState({
    about_us: '',
    our_goals: '',
    latest_news: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .single();

      if (data && !error) {
        setSiteContent(data);
      }
    } catch (err) {
      console.error("خطأ في جلب بيانات الصفحة:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoadingLogin(true);

    try {
      const { data, error } = await supabase
        .from('users_list')
        .select('*')
        .eq('username', usernameInput.trim())
        .eq('password_code', passwordInput.trim())
        .single();

      if (error || !data) {
        setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
      } else {
        onLoginSuccess(data);
        setShowLoginModal(false);
        setUsernameInput('');
        setPasswordInput('');
      }
    } catch (err) {
      setLoginError('حدث خطأ أثناء الاتصال بالقاعدة');
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
      
      {/* الهيدر العلوي */}
      <header style={{ backgroundColor: '#0f172a', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>
          🏫 مدارس الشروق السودانية - أسوان
        </h2>

        <div>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#e2e8f0' }}>مرحباً، <b>{currentUser.full_name || currentUser.username}</b></span>
              <button 
                onClick={onOpenAdmin} 
                style={{ backgroundColor: '#047857', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                ⚙️ لوحة الإدارة
              </button>
              <button 
                onClick={onLogout} 
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)} 
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
            >
              🔑 دخول البوابة
            </button>
          )}
        </div>
      </header>

      {/* شريط الأخبار العاجلة */}
      {siteContent.latest_news && (
        <div style={{ backgroundColor: '#fef3c7', color: '#92400e', borderBottom: '1px solid #fde68a', padding: '10px 30px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📢 أخبار عاجلة:</span>
          <span>{siteContent.latest_news}</span>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* قسم من نحن */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏫 من نحن
          </h3>
          <p style={{ margin: 0, color: '#334155', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>
            {siteContent.about_us || 'أهلاً بكم في مدارس الشروق السودانية بأسباب.'}
          </p>
        </div>

        {/* قسم الأهداف */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#0284c7', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 رؤيتنا وأهدافنا
          </h3>
          <p style={{ margin: 0, color: '#334155', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>
            {siteContent.our_goals || 'تقديم أفضل بيئة تعليمية وتربوية لأبنائنا الطلاب.'}
          </p>
        </div>

      </main>

      {/* نافذة تسجيل الدخول (Modal) */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '380px', padding: '25px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>🔑 تسجيل دخول النظام</h4>
              <button onClick={() => setShowLoginModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            {loginError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>اسم المستخدم:</label>
                <input 
                  type="text" 
                  value={usernameInput} 
                  onChange={(e) => setUsernameInput(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>رمز الدخول / كلمة المرور:</label>
                <input 
                  type="password" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loadingLogin}
                style={{ marginTop: '8px', backgroundColor: '#047857', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              >
                {loadingLogin ? 'جاري الدخول...' : 'دخول'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
