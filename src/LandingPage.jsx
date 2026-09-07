import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onLoginSuccess }) {
  const [logoUrl, setLogoUrl] = useState(null);
  const [news, setNews] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [primaryTopStudents, setPrimaryTopStudents] = useState([]);
  const [middleTopStudents, setMiddleTopStudents] = useState([]);

  // حالات النافذة المنبثقة لبوابة الدخول (Modal)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: logoData } = await supabase.from('school_settings').select('logo_url').single();
      if (logoData?.logo_url) setLogoUrl(logoData.logo_url);

      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNews(newsData);

      const { data: boardData } = await supabase.from('board_members').select('*').limit(10);
      if (boardData) setBoardMembers(boardData.filter(m => m.name && m.photo_url && m.name.trim() !== ''));

      const { data: primData } = await supabase.from('top_students').select('*').eq('stage', 'primary').limit(5);
      if (primData) setPrimaryTopStudents(primData.filter(s => s.name && s.photo_url && s.name.trim() !== ''));

      const { data: midData } = await supabase.from('top_students').select('*').eq('stage', 'middle').limit(5);
      if (midData) setMiddleTopStudents(midData.filter(s => s.name && s.photo_url && s.name.trim() !== ''));
    } catch (err) {
      console.log('Notice:', err.message);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `logo_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('school-assets').upload(fileName, file);

    if (!error) {
      const { data: urlData } = supabase.storage.from('school-assets').getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;
      setLogoUrl(publicUrl);
      await supabase.from('school_settings').upsert({ id: 1, logo_url: publicUrl });
    }
  };

  // دالة تسجيل الدخول عبر Supabase باستخدام العمود password_code
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', cleanUsername)
        .eq('password_code', cleanPassword)
        .maybeSingle();

      if (error) {
        console.error('Supabase Login Error:', error);
        setLoginError('خطأ في قاعدة البيانات: ' + error.message);
      } else if (!data) {
        setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
      } else {
        setShowLoginModal(false);
        if (onLoginSuccess) {
          onLoginSuccess(data);
        } else {
          alert(`أهلاً بك يا ${data.name || data.username}`);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoginError('حدث خطأ غير متوقع أثناء الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', direction: 'rtl', textAlign: 'right', margin: 0, padding: 0 }}>
      
      {/* 1. الهيدر: الشعار أولاً على اليمين + الاسم + زر بوابة الدخول */}
      <header style={{ backgroundColor: '#064e3b', color: '#ffffff', padding: '20px', borderBottom: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          
          {/* الشعار ثم الاسم */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', width: '80px', height: '80px', flexShrink: 0 }}>
              {logoUrl ? (
                <img src={logoUrl} alt="شعار المدرسة" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #fbbf24', backgroundColor: '#fff', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed #a7f3d0', backgroundColor: '#065f46', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', padding: '4px' }}>
                  رفع الشعار 📤
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} title="تغيير الشعار" />
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#ffffff' }}>مدرسة الشروق السودانية</h1>
              <p style={{ margin: '4px 0 0 0', color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}>أسوان - جمهورية مصر العربية 🇪🇬 🇸🇩</p>
            </div>
          </div>

          {/* زر بوابة الدخول */}
          <div>
            <button 
              onClick={() => setShowLoginModal(true)}
              style={{ backgroundColor: '#f59e0b', color: '#0f172a', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
            >
              🔐 بوابة الدخول
            </button>
          </div>

        </div>
      </header>

      {/* 2. شريط الأخبار */}
      <section style={{ backgroundColor: '#f59e0b', color: '#0f172a', height: '45px', display: 'flex', alignItems: 'center', overflow: 'hidden', borderBottom: '1px solid #d97706' }}>
        <div style={{ backgroundColor: '#78350f', color: '#ffffff', fontWeight: 'bold', padding: '0 18px', height: '100%', display: 'flex', alignItems: 'center', fontSize: '13px', whiteSpace: 'nowrap' }}>
          آخر الأخبار 📣
        </div>
        <div style={{ padding: '0 20px', fontSize: '14px', fontWeight: 'bold', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {news.length > 0 ? (
            news.map((item, idx) => <span key={idx} style={{ marginLeft: '30px' }}>🔸 {item.title || item.content}</span>)
          ) : (
            <span>مرحباً بكم في مدرسة الشروق السودانية بأسوان - يسعدنا استقبال استفساراتكم وتسجيل الطلاب للعام الدراسي الجديد.</span>
          )}
        </div>
      </section>

      {/* 3. من نحن */}
      <section style={{ padding: '35px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ backgroundColor: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
            عن المدرسة
          </span>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#0f172a' }}>من نحن</h2>
          <p style={{ margin: 0, color: '#475569', lineHeight: '1.8', fontSize: '15px' }}>
            مدرسة الشروق السودانية بأسوان هي صرح تعليمي وتربوي يهدف إلى تقديم أفضل المناهج التعليمية السودانية لأبنائنا الطلاب في جمهورية مصر العربية. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً، وتوفير بيئة تعليمية محفزة تدعم الإبداع والتفوق.
          </p>
        </div>
      </section>

      {/* 4. مجلس الإدارة */}
      {boardMembers.length > 0 && (
        <section style={{ padding: '0 20px 30px 20px', maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px', color: '#0f172a' }}>مجلس الإدارة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
            {boardMembers.slice(0, 10).map((member, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '15px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <img src={member.photo_url} alt={member.name} style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px auto', border: '2px solid #059669' }} />
                <h3 style={{ fontSize: '14px', margin: '2px 0', color: '#1e293b' }}>{member.name}</h3>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold' }}>{member.role || member.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. الفوتر: أرقام التواصل أولاً ثم موقعنا */}
      <section style={{ backgroundColor: '#022c22', color: '#ffffff', padding: '30px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0', color: '#fbbf24', fontSize: '16px' }}>📞 أرقام التواصل</h3>
            <p style={{ margin: 0, fontSize: '14px', direction: 'ltr' }}>+20 114 916 9346 / 01149169346</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px 0', color: '#fbbf24', fontSize: '16px' }}>📍 موقعنا</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>جمهورية مصر العربية - محافظة أسوان</p>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', textAlign: 'center', padding: '12px', fontSize: '12px', borderTop: '1px solid #1e293b' }}>
        تصميم وتطوير: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>أستاذ عثمان صديق</span> (01149169346)
      </footer>

      {/* 6. النافذة المنبثقة (Modal) لتسجيل الدخول */}
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '15px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '380px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' }}>
            
            <button 
              onClick={() => setShowLoginModal(false)}
              style={{ position: 'absolute', top: '15px', left: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
            >
              ✖
            </button>

            <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#064e3b', fontSize: '20px' }}>🔐 بوابة الدخول للنظام</h3>

            {loginError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', textAlign: 'center', border: '1px solid #fecaca' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>اسم المستخدم:</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  placeholder="أدخل اسم المستخدم"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>كلمة المرور:</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  placeholder="أدخل كلمة المرور"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', backgroundColor: '#064e3b', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
              >
                {loading ? 'جاري التحقق...' : 'دخول'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
