import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage() {
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

  return (
    <div>
      {/* 1. الهيدر والشعار */}
      <header className="header-container">
        <div className="header-content">
          <div>
            <h1 className="school-title">مدرسة الشروق السودانية</h1>
            <div className="school-sub">أسوان - جمهورية مصر العربية 🇪🇬 🇸🇩</div>
          </div>

          <div className="logo-uploader">
            {logoUrl ? (
              <img src={logoUrl} alt="شعار المدرسة" className="logo-img" />
            ) : (
              <div className="logo-placeholder">اضغط لرفع الشعار 📤</div>
            )}
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="file-input" />
          </div>
        </div>
      </header>

      {/* 2. شريط الأخبار */}
      <section className="ticker-section">
        <div className="ticker-badge">آخر الأخبار 📣</div>
        <div className="ticker-wrap">
          <div className="ticker-move">
            {news.length > 0 ? (
              news.map((item, idx) => <span key={idx} style={{ marginLeft: '40px' }}>🔸 {item.title || item.content}</span>)
            ) : (
              <span>مرحباً بكم في مدرسة الشروق السودانية بأسوان - يسعدنا استقبال استفساراتكم وتسجيل الطلاب للعام الدراسي الجديد.</span>
            )}
          </div>
        </div>
      </section>

      {/* 3. من نحن */}
      <section className="main-section">
        <div className="card-box">
          <span className="badge-tag">عن المدرسة</span>
          <h2 className="section-title">من نحن</h2>
          <p style={{ lineHeight: '1.8', color: '#475569', margin: 0 }}>
            مدرسة الشروق السودانية بأسوان هي صرح تعليمي وتربوي يهدف إلى تقديم أفضل المناهج التعليمية السودانية لأبنائنا الطلاب في جمهورية مصر العربية. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً، وتوفير بيئة تعليمية محفزة تدعم الإبداع والتفوق.
          </p>
        </div>
      </section>

      {/* 4. مجلس الإدارة (يظهر فقط عند وجود أعضاء) */}
      {boardMembers.length > 0 && (
        <section className="main-section" style={{ paddingTop: 0 }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>مجلس الإدارة</h2>
          <div className="section-grid">
            {boardMembers.slice(0, 10).map((member, idx) => (
              <div key={idx} className="grid-card">
                <img src={member.photo_url} alt={member.name} className="member-avatar" />
                <h3 style={{ fontSize: '15px', margin: '4px 0' }}>{member.name}</h3>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>{member.role || member.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. المتفوقون ابتدائي */}
      {primaryTopStudents.length > 0 && (
        <section className="main-section" style={{ paddingTop: 0 }}>
          <h2 className="section-title" style={{ textAlign: 'center', color: '#065f46' }}>🏆 أوائل الشهادة الابتدائية</h2>
          <div className="section-grid">
            {primaryTopStudents.slice(0, 5).map((student, idx) => (
              <div key={idx} className="grid-card" style={{ borderColor: '#a7f3d0' }}>
                <img src={student.photo_url} alt={student.name} className="member-avatar" style={{ borderColor: '#f59e0b' }} />
                <h3 style={{ fontSize: '15px', margin: '4px 0' }}>{student.name}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>النسبة: {student.score}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. المتفوقون متوسط */}
      {middleTopStudents.length > 0 && (
        <section className="main-section" style={{ paddingTop: 0 }}>
          <h2 className="section-title" style={{ textAlign: 'center', color: '#0f766e' }}>🎓 أوائل الشهادة المتوسطة</h2>
          <div className="section-grid">
            {middleTopStudents.slice(0, 5).map((student, idx) => (
              <div key={idx} className="grid-card" style={{ borderColor: '#99f6e4' }}>
                <img src={student.photo_url} alt={student.name} className="member-avatar" style={{ borderColor: '#0d9488' }} />
                <h3 style={{ fontSize: '15px', margin: '4px 0' }}>{student.name}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>النسبة: {student.score}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. الفوتر والتواصل */}
      <section className="footer-contact">
        <div className="footer-content">
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#fbbf24' }}>📍 موقعنا</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>جمهورية مصر العربية - محافظة أسوان</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#fbbf24' }}>📞 أرقام التواصل</h3>
            <p style={{ margin: 0, fontSize: '14px', direction: 'ltr' }}>+20 114 916 9346 / 01149169346</p>
          </div>
        </div>
      </section>

      <footer className="copyright-bar">
        تصميم وتطوير: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>أستاذ عثمان صديق</span> (01149169346)
      </footer>
    </div>
  );
}
