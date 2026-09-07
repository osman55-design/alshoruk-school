import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onOpenLogin, onBackToDashboard, currentUser }) {
  const [logoUrl, setLogoUrl] = useState(null);
  const [news, setNews] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [primaryTopStudents, setPrimaryTopStudents] = useState([]);
  const [middleTopStudents, setMiddleTopStudents] = useState([]);
  
  // حالة نافذة تسجيل الدخول (خانات فارغة لإدخال المستخدم)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
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

      const { data: boardData } = await supabase.from('board_members').select('*');
      if (boardData) setBoardMembers(boardData);

      const { data: primData } = await supabase.from('top_students').select('*').eq('stage', 'primary');
      if (primData) setPrimaryTopStudents(primData);

      const { data: midData } = await supabase.from('top_students').select('*').eq('stage', 'middle');
      if (midData) setMiddleTopStudents(midData);
    } catch (err) {
      console.log('Notice:', err.message);
    }
  };

  const handleLoginClick = () => {
    if (onOpenLogin) onOpenLogin();
    // تفريغ الخانات عند فتح النافذة
    setUsernameInput('');
    setPasswordInput('');
    setLoginError('');
    setShowLoginModal(true);
  };

  // التحقق من اسم المستخدم وكلمة المرور المدخلة من جدول users في Supabase
  const handleDirectLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      // الاستعلام من جدول users عن طريق username المدخل
      const { data: matchedUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', usernameInput.trim())
        .single();

      if (error || !matchedUser) {
        setLoginError('اسم المستخدم غير صحيح أو غير موجود.');
        setLoading(false);
        return;
      }

      // التحقق من كلمة المرور / password_code
      if (matchedUser.password_code && passwordInput !== String(matchedUser.password_code)) {
        setLoginError('كلمة المرور غير صحيحة.');
        setLoading(false);
        return;
      }

      // نجاح الدخول - حفظ البيانات والتوجيه
      localStorage.setItem('current_user', JSON.stringify(matchedUser));
      setShowLoginModal(false);

      if (onBackToDashboard) {
        onBackToDashboard();
      } else {
        window.location.reload();
      }
    } catch (err) {
      setLoginError('حدث خطأ أثناء الاتصال بالخادم: ' + err.message);
    } finally {
      setLoading(false);
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

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      fontFamily: "'Tajawal', 'Segoe UI', system-ui, sans-serif",
      direction: 'rtl',
      textAlign: 'right',
      margin: 0,
      padding: 0,
      color: '#065f46'
    }}>

      {/* الهيدر الأبيض الزجاجي */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(6, 95, 70, 0.15)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', width: '70px', height: '70px', flexShrink: 0 }}>
              {logoUrl ? (
                <img src={logoUrl} alt="شعار المدرسة" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid #065f46', backgroundColor: '#fff', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px dashed #065f46', backgroundColor: 'rgba(6, 95, 70, 0.05)', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', fontWeight: 'bold' }}>
                  رفع الشعار 📤
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} title="تغيير الشعار" />
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#1e3a8a', letterSpacing: '-0.3px' }}>مدرسة الشروق السودانية</h1>
              <p style={{ margin: '4px 0 0 0', color: '#047857', fontSize: '13px', fontWeight: '700' }}>أسوان - جمهورية مصر العربية 🇪🇬 🇸🇩</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                style={{
                  background: 'rgba(6, 95, 70, 0.1)',
                  color: '#065f46',
                  border: '1px solid rgba(6, 95, 70, 0.25)',
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                ⬅️ العودة للوحة التحكم
              </button>
            )}

            <button 
              onClick={handleLoginClick}
              style={{
                background: '#065f46',
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(6, 95, 70, 0.25)'
              }}
            >
              🔐 بوابة الدخول
            </button>
          </div>

        </div>
      </header>

      {/* شريط الأخبار المتحرك */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderBottom: '1px solid rgba(6, 95, 70, 0.15)',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div style={{ backgroundColor: '#065f46', color: '#ffffff', fontWeight: '800', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', fontSize: '13px', whiteSpace: 'nowrap', zIndex: 2 }}>
          آخر الأخبار 📢
        </div>

        <div style={{ overflow: 'hidden', width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div className="animate-marquee" style={{ fontSize: '14px', fontWeight: '600', color: '#047857' }}>
            {news.length > 0 ? (
              news.map((item, idx) => <span key={idx} style={{ marginLeft: '50px' }}>🔸 {item.title || item.content}</span>)
            ) : (
              <span>مرحباً بكم في مدرسة الشروق السودانية بأسوان - يسعدنا استقبال استفساراتكم وتسجيل الطلاب للعام الدراسي الجديد.</span>
            )}
          </div>
        </div>
      </section>

      {/* المحتوى الرئيسي */}
      <main style={{ maxWidth: '1150px', margin: '35px auto', padding: '0 20px' }}>
        
        {/* من نحن */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          }}>
            <span style={{ backgroundColor: 'rgba(6, 95, 70, 0.1)', color: '#065f46', fontSize: '12px', fontWeight: '800', padding: '5px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '14px' }}>
              عن المدرسة
            </span>
            <h2 style={{ margin: '0 0 14px 0', fontSize: '22px', color: '#065f46', fontWeight: '800' }}>من نحن</h2>
            <p style={{ margin: 0, color: '#334155', lineHeight: '2', fontSize: '15px', fontWeight: '500' }}>
              مدرسة الشروق السودانية بأسوان هي صرح تعليمي وتربوي يهدف إلى تقديم أفضل المناهج التعليمية السودانية لأبنائنا الطلاب في جمهورية مصر العربية. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً، وتوفير بيئة تعليمية محفزة تدعم الإبداع والتفوق.
            </p>
          </div>
        </section>

        {/* مجلس الإدارة */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#065f46', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '22px', backgroundColor: '#065f46', borderRadius: '4px', display: 'inline-block' }}></span>
            🏛️ مجلس الإدارة
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {boardMembers.length > 0 ? (
              boardMembers.map((member, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '20px 15px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.03)'
                }}>
                  <img src={member.photo_url || 'https://via.placeholder.com/80'} alt={member.name} style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto', border: '2px solid #065f46' }} />
                  <h3 style={{ fontSize: '14px', margin: '4px 0', color: '#1e293b', fontWeight: '700' }}>{member.name}</h3>
                  <span style={{ fontSize: '12px', color: '#065f46', fontWeight: '700' }}>{member.role || member.title}</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '25px', background: 'rgba(255,255,255,0.6)', borderRadius: '16px', color: '#64748b', textAlign: 'center', fontSize: '14px', border: '1px dashed #cbd5e1' }}>
                لم يتم إضافة أعضاء مجلس الإدارة بعد.
              </div>
            )}
          </div>
        </section>

        {/* أوائل الشهادة الابتدائية */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#065f46', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '22px', backgroundColor: '#047857', borderRadius: '4px', display: 'inline-block' }}></span>
            🏆 أوائل الشهادة الابتدائية
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {primaryTopStudents.length > 0 ? (
              primaryTopStudents.map((student, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '20px 15px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.03)'
                }}>
                  <img src={student.photo_url || 'https://via.placeholder.com/80'} alt={student.name} style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto', border: '2px solid #047857' }} />
                  <h3 style={{ fontSize: '14px', margin: '4px 0', color: '#1e293b', fontWeight: '700' }}>{student.name}</h3>
                  <span style={{ fontSize: '13px', color: '#047857', fontWeight: '800' }}>النسبة: {student.score}%</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '25px', background: 'rgba(255,255,255,0.6)', borderRadius: '16px', color: '#64748b', textAlign: 'center', fontSize: '14px', border: '1px dashed #cbd5e1' }}>
                لم يتم إضافة طلاب متفوقين بعد.
              </div>
            )}
          </div>
        </section>

        {/* أوائل الشهادة المتوسطة */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#065f46', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '22px', backgroundColor: '#065f46', borderRadius: '4px', display: 'inline-block' }}></span>
            🎓 أوائل الشهادة المتوسطة
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {middleTopStudents.length > 0 ? (
              middleTopStudents.map((student, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '20px 15px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.03)'
                }}>
                  <img src={student.photo_url || 'https://via.placeholder.com/80'} alt={student.name} style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto', border: '2px solid #065f46' }} />
                  <h3 style={{ fontSize: '14px', margin: '4px 0', color: '#1e293b', fontWeight: '700' }}>{student.name}</h3>
                  <span style={{ fontSize: '13px', color: '#065f46', fontWeight: '800' }}>النسبة: {student.score}%</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '25px', background: 'rgba(255,255,255,0.6)', borderRadius: '16px', color: '#64748b', textAlign: 'center', fontSize: '14px', border: '1px dashed #cbd5e1' }}>
                لم يتم إضافة طلاب متفوقين بعد.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* الفوتر */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderTop: '1px solid rgba(6, 95, 70, 0.15)',
        paddingTop: '35px',
        paddingBottom: '20px',
        color: '#065f46'
      }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '25px' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '16px', fontWeight: '800' }}>📞 أرقام التواصل</h3>
            <p style={{ margin: 0, fontSize: '14px', direction: 'ltr', color: '#065f46', fontWeight: '700' }}>+20 114 916 9346 / 01149169346</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '16px', fontWeight: '800' }}>📍 موقعنا</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#065f46', fontWeight: '700' }}>جمهورية مصر العربية - محافظة أسوان</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(6, 95, 70, 0.1)', marginTop: '25px', paddingTop: '15px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          تصميم وتطوير: <span style={{ color: '#065f46', fontWeight: 'bold' }}>أستاذ عثمان صديق</span> (01149169346)
        </div>
      </footer>

      {/* نافذة تسجيل الدخول بخانات فارغة يدخلها المستخدم بنفسه */}
      {showLoginModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff', padding: '30px', borderRadius: '16px',
            width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0', color: '#0f172a'
          }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#065f46', textAlign: 'center', fontWeight: '800' }}>
              🔐 تسجيل الدخول للنظام
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: 0, marginBottom: '20px' }}>
              أدخل اسم المستخدم وكلمة المرور المسجلة
            </p>

            {loginError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleDirectLoginSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>
                  اسم المستخدم
                </label>
                <input 
                  type="text"
                  required
                  placeholder="أدخل اسم المستخدم"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>
                  كلمة المرور
                </label>
                <input 
                  type="password"
                  required
                  placeholder="أدخل كلمة المرور"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{ flex: 1, backgroundColor: '#065f46', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  {loading ? 'جاري التحقق...' : 'تسجيل الدخول 🚀'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowLoginModal(false)} 
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '11px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
