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
      console.log('ملاحظة في جلب البيانات:', err.message);
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
    <div style={{ backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: "'Segoe UI', Roboto, sans-serif", direction: 'rtl', minHeight: '100vh', margin: 0 }}>
      
      {/* 1. الهيدر الرئيسي والشعار */}
      <header style={{ background: 'linear-gradient(135deg, #065f46 0%, #134e4a 100%)', color: '#fff', padding: '30px 20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ textAlign: 'right' }}>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#ecfdf5' }}>
              مدرسة الشروق السودانية
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: '18px', color: '#a7f3d0' }}>
              فرع أسوان - مصر 🇪🇬 🇸🇩
            </p>
          </div>

          <div style={{ position: 'relative', cursor: 'pointer' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="شعار المدرسة" style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '50%', border: '3px solid #34d399', backgroundColor: '#fff', padding: '4px' }} />
            ) : (
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px dashed #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', fontSize: '12px', color: '#ecfdf5', textAlign: 'center', padding: '5px' }}>
                رفع الشعار 📤
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
              title="تغيير الشعار"
            />
          </div>

        </div>
      </header>

      {/* 2. شريط الأخبار المتحرك */}
      <section style={{ backgroundColor: '#f59e0b', color: '#0f172a', display: 'flex', alignItems: 'center', overflow: 'hidden', borderBottom: '2px solid #d97706' }}>
        <div style={{ backgroundColor: '#b45309', color: '#fff', fontWeight: 'bold', padding: '10px 20px', zIndex: 2, fontSize: '14px', shrink: 0 }}>
          آخر الأخبار 📣
        </div>
        <div className="marquee-container" style={{ width: '100%', overflow: 'hidden', whitespace: 'nowrap', position: 'relative' }}>
          <div className="marquee-content" style={{ display: 'inline-block', paddingLeft: '100%', animation: 'marquee 22s linear infinite', fontSize: '15px', fontWeight: 'bold' }}>
            {news.length > 0 ? (
              news.map((item, idx) => (
                <span key={idx} style={{ marginLeft: '40px' }}>🔸 {item.title || item.content}</span>
              ))
            ) : (
              <span>مرحباً بكم في مدرسة الشروق السودانية بأسوان - يسعدنا استقبال استفساراتكم وتسجيل الطلاب للعام الدراسي الجديد.</span>
            )}
          </div>
        </div>
      </section>

      {/* 3. من نحن */}
      <section style={{ padding: '50px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <span style={{ backgroundColor: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }}>
            عن المدرسة
          </span>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '24px', color: '#0f172a' }}>من نحن</h2>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '16px', margin: 0 }}>
            مدرسة الشروق السودانية بأسوان هي صرح تعليمي وتربوي يهدف إلى تقديم أفضل المناهج التعليمية السودانية لأبنائنا الطلاب في جمهورية مصر العربية. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً، وتوفير بيئة تعليمية محفزة تدعم الإبداع والتفوق تحت إشراف نخبة من أفضل الكوادر التعليمية.
          </p>
        </div>
      </section>

      {/* 4. أعضاء مجلس الإدارة */}
      {boardMembers.length > 0 && (
        <section style={{ padding: '40px 20px', backgroundColor: '#f1f5f9' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '30px' }}>مجلس الإدارة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {boardMembers.slice(0, 10).map((member, index) => (
                <div key={index} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '15px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <img src={member.photo_url} alt={member.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669', margin: '0 auto 10px auto' }} />
                  <h3 style={{ margin: '5px 0', fontSize: '15px', color: '#1e293b' }}>{member.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>{member.role || member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. المتفوقون في الابتدائي */}
      {primaryTopStudents.length > 0 && (
        <section style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#065f46', marginBottom: '30px' }}>🏆 أوايل الشهادة الابتدائية</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {primaryTopStudents.slice(0, 5).map((student, index) => (
              <div key={index} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '15px', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                <img src={student.photo_url} alt={student.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f59e0b', margin: '0 auto 10px auto' }} />
                <h3 style={{ margin: '5px 0', fontSize: '15px', color: '#1e293b' }}>{student.name}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>النسبة: {student.score}%</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. المتفوقون في المتوسط */}
      {middleTopStudents.length > 0 && (
        <section style={{ padding: '40px 20px', backgroundColor: '#f1f5f9' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', color: '#0f766e', marginBottom: '30px' }}>🎓 أوائل الشهادة المتوسطة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {middleTopStudents.slice(0, 5).map((student, index) => (
                <div key={index} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '15px', textAlign: 'center', border: '1px solid #99f6e4' }}>
                  <img src={student.photo_url} alt={student.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0d9488', margin: '0 auto 10px auto' }} />
                  <h3 style={{ margin: '5px 0', fontSize: '15px', color: '#1e293b' }}>{student.name}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>النسبة: {student.score}%</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. الموقع وأرقام التواصل */}
      <section style={{ padding: '40px 20px', backgroundColor: '#022c22', color: '#ecfdf5' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>📍 موقعنا</h3>
            <p style={{ margin: 0, color: '#a7f3d0', fontSize: '14px' }}>جمهورية مصر العربية - محافظة أسوان</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>📞 أرقام التواصل</h3>
            <p style={{ margin: 0, color: '#a7f3d0', fontSize: '14px', direction: 'ltr', textAlign: 'right' }}>+20 114 916 9346</p>
          </div>
        </div>
      </section>

      {/* 8. الفوتر */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', textAlign: 'center', padding: '15px', fontSize: '13px', borderTop: '1px solid #1e293b' }}>
        تصميم وتطوير: <span style={{ color: '#34d399', fontWeight: 'bold' }}>أستاذ عثمان صديق</span> (01149169346)
      </footer>

      {/* CSS الخاص بالتحريك والتوقف عند الماوس */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
