import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onOpenLogin, onBackToDashboard, schoolLogo }) {
  const [logoUrl, setLogoUrl] = useState(schoolLogo || null);
  const [news, setNews] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [primaryTopStudents, setPrimaryTopStudents] = useState([]);
  const [middleTopStudents, setMiddleTopStudents] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. الشعار
      const { data: logoData } = await supabase.from('school_settings').select('logo_url').single();
      if (logoData?.logo_url) setLogoUrl(logoData.logo_url);

      // 2. الأخبار
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNews(newsData);

      // 3. أعضاء مجلس الإدارة
      const { data: boardData } = await supabase.from('board_members').select('*');
      if (boardData) setBoardMembers(boardData);

      // 4. المتفوقين
      const { data: primData } = await supabase.from('top_students').select('*').eq('stage', 'primary');
      if (primData) setPrimaryTopStudents(primData);

      const { data: midData } = await supabase.from('top_students').select('*').eq('stage', 'middle');
      if (midData) setMiddleTopStudents(midData);
    } catch (err) {
      console.log('Notice:', err.message);
    }
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl', textAlign: 'right', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 1. الهيدر والشعار واسم المدرسة */}
      <header style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: '#fff', padding: '20px 40px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="شعار المدرسة" style={{ width: '65px', height: '65px', objectFit: 'contain', borderRadius: '50%', background: '#fff', padding: '3px' }} />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold' }}>
                ☀️
              </div>
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#fbbf24' }}>مدرسة الشروق السودانية بأسوان</h1>
              <span style={{ fontSize: '13px', opacity: 0.9 }}>العلم والتربية لبناء المستقبل</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid #fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                لوحة التحكم
              </button>
            )}
            {/* استدعاء دالة الدخول الأصلية الخاصة بك كما هي */}
            <button 
              onClick={onOpenLogin}
              style={{ background: '#d97706', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🔐 بوابة الدخول
            </button>
          </div>
        </div>
      </header>

      {/* 2. شريط الأخبار المتحرك (يتوقف عند الوقوف بالماوس) */}
      <div style={{ background: '#1e293b', color: '#fbbf24', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderBottom: '3px solid #d97706' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <span style={{ background: '#d97706', color: '#fff', padding: '3px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', marginLeft: '15px', zIndex: 2 }}>
            📢 شريط الأخبار:
          </span>
          <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              animation: isPaused ? 'none' : 'marquee 25s linear infinite',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {news.length > 0 ? (
              news.map((item, idx) => (
                <span key={idx} style={{ marginLeft: '50px' }}>🔹 {item.title || item.content}</span>
              ))
            ) : (
              <span>🔹 مرحباً بكم في مدرسة الشروق السودانية بأسوان - بداية العام الدراسي الجديد.</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. أقسام المحتوى */}
      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* قسم من نحن */}
        <section style={{ background: '#fff', borderRadius: '12px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRight: '5px solid #065f46' }}>
          <h2 style={{ color: '#065f46', marginTop: 0, fontSize: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            📖 من نحن
          </h2>
          <p style={{ lineHeight: '1.8', color: '#475569', fontSize: '15px' }}>
            مدرسة الشروق السودانية بأسوان هي صرح تعليمي تربوي يهدف إلى تقديم أفضل المناهج والخبرات التعليمية للطلاب السودانيين بأسوان. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً ضمن بيئة تعليمية متكاملة ومشجعة على الإبداع والنجاح.
          </p>
        </section>

        {/* قسم أعضاء مجلس الإدارة */}
        <section style={{ background: '#fff', borderRadius: '12px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRight: '5px solid #d97706' }}>
          <h2 style={{ color: '#065f46', marginTop: 0, fontSize: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            👥 أعضاء مجلس الإدارة
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {boardMembers.length > 0 ? (
              boardMembers.map((member, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  {member.photo_url && <img src={member.photo_url} alt={member.name} style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' }} />}
                  <h4 style={{ margin: '5px 0', color: '#1e293b' }}>{member.name}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{member.role || member.title}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontSize: '14px' }}>سيتم عرض أعضاء مجلس الإدارة قريباً.</p>
            )}
          </div>
        </section>

        {/* قسم الأوائل */}
        <section style={{ background: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRight: '5px solid #065f46' }}>
          <h2 style={{ color: '#065f46', marginTop: 0, fontSize: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            🏆 الطلاب المتفوقون
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
              <h3 style={{ color: '#d97706', fontSize: '16px' }}>الشهادة الابتدائية</h3>
              {primaryTopStudents.length > 0 ? (
                primaryTopStudents.map((st, i) => <div key={i}>🥇 {st.name} ({st.score}%)</div>)
              ) : <p style={{ fontSize: '13px', color: '#94a3b8' }}>لا يوجد بيانات حالياً</p>}
            </div>
            <div>
              <h3 style={{ color: '#d97706', fontSize: '16px' }}>الشهادة المتوسطة</h3>
              {middleTopStudents.length > 0 ? (
                middleTopStudents.map((st, i) => <div key={i}>🥇 {st.name} ({st.score}%)</div>)
              ) : <p style={{ fontSize: '13px', color: '#94a3b8' }}>لا يوجد بيانات حالياً</p>}
            </div>
          </div>
        </section>

      </main>

      {/* 4. الفوتر */}
      <footer style={{ background: '#064e3b', color: '#fff', padding: '25px', textAlign: 'center', marginTop: '40px', borderTop: '3px solid #d97706' }}>
        <p style={{ margin: '5px 0' }}>📞 للتواصل: 01149169346 | 📍 أسوان، جمهورية مصر العربية</p>
        <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.8 }}>حقوق الطبع والتطوير محفوظة - أستاذ عثمان صديق (01149169346)</p>
      </footer>

      {/* الحركة الخاصة بالشريط */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
