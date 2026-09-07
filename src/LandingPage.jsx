import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onOpenLogin, onBackToDashboard, currentUser }) {
  const [logoUrl, setLogoUrl] = useState(null);
  const [news, setNews] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [primaryTopStudents, setPrimaryTopStudents] = useState([]);
  const [middleTopStudents, setMiddleTopStudents] = useState([]);

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
      background: 'linear-gradient(135deg, #062c1e 0%, #0c3e2b 50%, #041f15 100%)',
      minHeight: '100vh',
      fontFamily: "'Tajawal', 'Segoe UI', system-ui, sans-serif",
      direction: 'rtl',
      textAlign: 'right',
      margin: 0,
      padding: 0,
      color: '#e2e8f0'
    }}>
      
      {/* 1. الهيدر الزجاجي (Glassmorphism Header) */}
      <header style={{
        background: 'rgba(6, 44, 30, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', width: '70px', height: '70px', flexShrink: 0 }}>
              {logoUrl ? (
                <img src={logoUrl} alt="شعار المدرسة" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid rgba(245, 158, 11, 0.8)', backgroundColor: '#fff', objectFit: 'contain', boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' }} />
              ) : (
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px dashed #f59e0b', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', fontWeight: 'bold' }}>
                  رفع الشعار 📤
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} title="تغيير الشعار" />
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.3px' }}>مدرسة الشروق السودانية</h1>
              <p style={{ margin: '4px 0 0 0', color: '#f59e0b', fontSize: '13px', fontWeight: '600' }}>أسوان - جمهورية مصر العربية 🇪🇬 🇸🇩</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                ⬅️ العودة للوحة التحكم
              </button>
            )}

            <button 
              onClick={onOpenLogin}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0f172a',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
              }}
            >
              🔐 بوابة الدخول
            </button>
          </div>

        </div>
      </header>

      {/* 2. شريط الأخبار المتحرك زجاجياً (Animated Marquee Bar) */}
      <section style={{
        background: 'rgba(245, 158, 11, 0.15)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(245, 158, 11, 0.2)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
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

        <div style={{ backgroundColor: '#f59e0b', color: '#062c1e', fontWeight: '800', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', fontSize: '13px', whiteSpace: 'nowrap', zIndex: 2, boxShadow: '2px 0 10px rgba(0,0,0,0.2)' }}>
          آخر الأخبار 📢
        </div>

        <div style={{ overflow: 'hidden', width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div className="animate-marquee" style={{ fontSize: '14px', fontWeight: '600', color: '#fbbf24' }}>
            {news.length > 0 ? (
              news.map((item, idx) => <span key={idx} style={{ marginLeft: '50px' }}>🔸 {item.title || item.content}</span>)
            ) : (
              <span>مرحباً بكم في مدرسة الشروق السودانية بأسوان - يسعدنا استقبال استفساراتكم وتسجيل الطلاب للعام الدراسي الجديد.</span>
            )}
          </div>
        </div>

        {onBackToDashboard && (
          <button onClick={onBackToDashboard} style={{ zIndex: 2, margin: '0 10px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            ✏️ تعديل
          </button>
        )}
      </section>

      {/* المحتوى الرئيسي بكروت فريم زجاجي (Glassmorphism Cards) */}
      <main style={{ maxWidth: '1150px', margin: '35px auto', padding: '0 20px' }}>
        
        {/* 3. من نحن */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            position: 'relative'
          }}>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ تعديل
              </button>
            )}
            <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '12px', fontWeight: '800', padding: '5px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '14px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              عن المدرسة
            </span>
            <h2 style={{ margin: '0 0 14px 0', fontSize: '22px', color: '#ffffff', fontWeight: '800' }}>من نحن</h2>
            <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '2', fontSize: '15px', fontWeight: '400' }}>
              مدرسة الشروق السودانية بأسوان هي صرح تعليمي وتربوي يهدف إلى تقديم أفضل المناهج التعليمية السودانية لأبنائنا الطلاب في جمهورية مصر العربية. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً، وتوفير بيئة تعليمية محفزة تدعم الإبداع والتفوق.
            </p>
          </div>
        </section>

        {/* 4. مجلس الإدارة */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#ffffff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '22px', backgroundColor: '#f59e0b', borderRadius: '4px', display: 'inline-block' }}></span>
              🏛️ مجلس الإدارة
            </h2>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ تعديل الأعضاء
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {boardMembers.length > 0 ? (
              boardMembers.map((member, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '20px 15px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}>
                  <img src={member.photo_url || 'https://via.placeholder.com/80'} alt={member.name} style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto', border: '2px solid #f59e0b', boxShadow: '0 0 10px rgba(245,158,11,0.2)' }} />
                  <h3 style={{ fontSize: '14px', margin: '4px 0', color: '#ffffff', fontWeight: '700' }}>{member.name}</h3>
                  <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>{member.role || member.title}</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '25px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', color: '#94a3b8', textAlign: 'center', fontSize: '14px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                لم يتم إضافة أعضاء مجلس الإدارة بعد.
              </div>
            )}
          </div>
        </section>

        {/* 5. أوائل الشهادة الابتدائية */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#ffffff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '22px', backgroundColor: '#34d399', borderRadius: '4px', display: 'inline-block' }}></span>
              🏆 أوائل الشهادة الابتدائية
            </h2>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ تعديل المتفوقين
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {primaryTopStudents.length > 0 ? (
              primaryTopStudents.map((student, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '20px 15px',
                  textAlign: 'center',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}>
                  <img src={student.photo_url || 'https://via.placeholder.com/80'} alt={student.name} style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto', border: '2px solid #34d399', boxShadow: '0 0 10px rgba(52,211,153,0.2)' }} />
                  <h3 style={{ fontSize: '14px', margin: '4px 0', color: '#ffffff', fontWeight: '700' }}>{student.name}</h3>
                  <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '800' }}>النسبة: {student.score}%</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '25px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', color: '#94a3b8', textAlign: 'center', fontSize: '14px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                لم يتم إضافة طلاب متفوقين بعد.
              </div>
            )}
          </div>
        </section>

        {/* 6. أوائل الشهادة المتوسطة */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#ffffff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '22px', backgroundColor: '#38bdf8', borderRadius: '4px', display: 'inline-block' }}></span>
              🎓 أوائل الشهادة المتوسطة
            </h2>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ تعديل المتفوقين
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {middleTopStudents.length > 0 ? (
              middleTopStudents.map((student, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '20px 15px',
                  textAlign: 'center',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}>
                  <img src={student.photo_url || 'https://via.placeholder.com/80'} alt={student.name} style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto', border: '2px solid #38bdf8', boxShadow: '0 0 10px rgba(56,189,248,0.2)' }} />
                  <h3 style={{ fontSize: '14px', margin: '4px 0', color: '#ffffff', fontWeight: '700' }}>{student.name}</h3>
                  <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '800' }}>النسبة: {student.score}%</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '25px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', color: '#94a3b8', textAlign: 'center', fontSize: '14px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                لم يتم إضافة طلاب متفوقين بعد.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* 7. الفوتر الزجاجي الداكن */}
      <footer style={{
        background: 'rgba(4, 31, 21, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '35px',
        paddingBottom: '20px'
      }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '25px' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b', fontSize: '16px', fontWeight: '700' }}>📞 أرقام التواصل</h3>
            <p style={{ margin: 0, fontSize: '14px', direction: 'ltr', color: '#cbd5e1', fontWeight: '600' }}>+20 114 916 9346 / 01149169346</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b', fontSize: '16px', fontWeight: '700' }}>📍 موقعنا</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', fontWeight: '600' }}>جمهورية مصر العربية - محافظة أسوان</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '25px', paddingTop: '15px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          تصميم وتطوير: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>أستاذ عثمان صديق</span> (01149169346)
        </div>
      </footer>

    </div>
  );
}
