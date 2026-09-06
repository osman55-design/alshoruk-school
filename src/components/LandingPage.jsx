import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function LandingPage({ onLoginSuccess, onOpenAdmin, onOpenDashboard, currentUser }) {
  const [content, setContent] = useState({ about_us: '', our_goals: '', latest_news: '' });
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await supabase.from('site_content').select('*').single();
      if (data) setContent(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('users_list')
      .select('*')
      .eq('username', username.trim())
      .eq('password_code', password.trim())
      .single();

    if (data && !error) {
      onLoginSuccess(data);
      setShowLogin(false);
    } else {
      alert('خطأ في اسم المستخدم أو رمز الدخول!');
    }
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <header style={{ background: '#0f172a', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#38bdf8' }}>مدارس الشروق السودانية - أسوان</h2>
        <div>
          {currentUser ? (
            <button onClick={onOpenDashboard} style={{ background: '#047857', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🖥️ لوحة التحكم</button>
          ) : (
            <button onClick={() => setShowLogin(!showLogin)} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔑 دخول البوابة</button>
          )}
        </div>
      </header>

      {content.latest_news && (
        <div style={{ background: '#fef3c7', color: '#92400e', padding: '10px 20px', fontWeight: 'bold', borderBottom: '1px solid #fde68a' }}>
          📢 أخبار عاجلة: {content.latest_news}
        </div>
      )}

      {showLogin && !currentUser && (
        <div style={{ background: '#fff', maxWidth: '350px', margin: '20px auto', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h4 style={{ marginTop: 0 }}>تسجيل الدخول للنظام</h4>
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="اسم الدخول" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="كلمة المرور / الرمز" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ background: '#047857', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>دخول</button>
          </form>
        </div>
      )}

      <main style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#047857' }}>🏫 من نحن</h3>
          <p style={{ lineHeight: '1.7', color: '#334155' }}>{content.about_us || 'أهلاً بكم في مدارس الشروق السودانية بأسوان.'}</p>
        </section>

        <section style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#0284c7' }}>🎯 رؤيتنا وأهدافنا</h3>
          <p style={{ lineHeight: '1.7', color: '#334155' }}>{content.our_goals || 'تقديم أفضل بيئة تعليمية وتربوية لأبنائنا الطلاب.'}</p>
        </section>
      </main>
    </div>
  );
}
