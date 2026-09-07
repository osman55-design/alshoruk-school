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
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", direction: 'rtl', textAlign: 'right', margin: 0, padding: 0 }}>
      
      {/* 1. الهيدر الأخضر الرئيسي مستوحى من هوية سوداني */}
      <header style={{ backgroundColor: '#005a36', color: '#ffffff', padding: '15px 25px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          
          {/* الشعار ثم اسم المدرسة */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', width: '75px', height: '75px', flexShrink: 0 }}>
              {logoUrl ? (
                <img src={logoUrl} alt="شعار المدرسة" style={{ width: '75px', height: '75px', borderRadius: '50%', border: '3px solid #ff9900', backgroundColor: '#fff', objectFit: 'contain', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
              ) : (
                <div style={{ width: '75px', height: '75px', borderRadius: '50%', border: '2px dashed #ff9900', backgroundColor: '#004227', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', fontWeight: 'bold' }}>
                  رفع الشعار 📤
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} title="تغيير الشعار" />
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>مدرسة الشروق السودانية</h1>
              <p style={{ margin: '3px 0 0 0', color: '#ff9900', fontSize: '13px', fontWeight: '700' }}>أسوان - جمهورية مصر العربية 🇪🇬 🇸🇩</p>
            </div>
          </div>

          {/* أزرار التحكم والعمليات */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                style={{ backgroundColor: 'transparent', color: '#ffffff', border: '2px solid #ffffff', padding: '8px 16px', borderRadius: '25px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                ⬅️ العودة للوحة التحكم
              </button>
            )}

            <button 
              onClick={onOpenLogin}
              style={{ backgroundColor: '#ff9900', color: '#000000', border: 'none', padding: '10px 22px', borderRadius: '25px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 3px 10px rgba(255,153,0,0.4)' }}
            >
              🔐 بوابة الدخول
            </button>
          </div>

        </div>
      </header>

      {/* 2. شريط الأخبار بالبرتقالي الجذاب */}
      <section style={{ backgroundColor: '#ff9900', color: '#000000', height: '42px', display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ backgroundColor: '#005a36', color: '#ffffff', fontWeight: 'bold', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', fontSize: '13px', whiteSpace: 'nowrap' }}>
          آخر الأخبار 📢
        </div>
        <div style={{ padding: '0 20px', fontSize: '14px', fontWeight: '600', overflow: 'hidden', whiteSpace: 'nowrap', flexGrow: 1 }}>
          {news.length > 0 ? (
            news.map((item, idx) => <span key={idx} style={{ marginLeft: '30px' }}>🔸 {item.title || item.content}</span>)
          ) : (
            <span>مرحباً بكم في مدرسة الشروق السودانية بأسوان - يسعدنا استقبال استفساراتكم وتسجيل الطلاب للعام الدراسي الجديد.</span>
          )}
        </div>
        {onBackToDashboard && (
          <button onClick={onBackToDashboard} style={{ margin: '0 12px', backgroundColor: '#005a36', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
            ✏️ تعديل
          </button>
        )}
      </section>

      <main style={{ maxWidth: '1150px', margin: '30px auto', padding: '0 20px' }}>
        
        {/* 3. بطاقة من نحن */}
        <section style={{ marginBottom: '35px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '30px', borderRight: '6px solid #ff9900', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative' }}>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#f0fdf4', color: '#005a36', border: '1px solid #86efac', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ تعديل
              </button>
            )}
            <span style={{ backgroundColor: '#e6f4ea', color: '#005a36', fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }}>
              عن المدرسة
            </span>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '22px', color: '#005a36', fontWeight: '800' }}>من نحن</h2>
            <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.9', fontSize: '15px', fontWeight: '500' }}>
              مدرسة الشروق السودانية بأسوان هي صرح تعليمي وتربوي يهدف إلى تقديم أفضل المناهج التعليمية السودانية لأبنائنا الطلاب في جمهورية مصر العربية. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً، وتوفير بيئة تعليمية محفزة تدعم الإبداع والتفوق.
            </p>
          </div>
        </section>

        {/* 4. مجلس الإدارة */}
        <section style={{ marginBottom: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#005a36', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '20px', backgroundColor: '#ff9900', borderRadius: '3px', display: 'inline-block' }}></span>
              🏛️ مجلس الإدارة
            </h2>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ backgroundColor: '#ffffff', color: '#005a36', border: '1px solid #005a36', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ تعديل الأعضاء
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {boardMembers.length > 0 ? (
              boardMembers.map((member, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', transition: 'transform 0.2s' }}>
                  <img src={member.photo_url || 'https://via.placeholder.com/80'} alt={member.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto', border: '3px solid #ff9900' }} />
                  <h3 style={{ fontSize: '15px', margin: '4px 0', color: '#111827', fontWeight: '700' }}>{member.name}</h3>
                  <span style={{ fontSize: '12px', color: '#005a36', fontWeight: '700' }}>{member.role || member.title}</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', color: '#6b7280', textAlign: 'center', fontSize: '14px', border: '1px dashed #cbd5e1' }}>
                لم يتم إضافة أعضاء مجلس الإدارة بعد.
              </div>
            )}
          </div>
        </section>

        {/* 5. أوائل الشهادة الابتدائية */}
        <section style={{ marginBottom: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#005a36', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '20px', backgroundColor: '#ff9900', borderRadius: '3px', display: 'inline-block' }}></span>
              🏆 أوائل الشهادة الابتدائية
            </h2>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ backgroundColor: '#ffffff', color: '#005a36', border: '1px solid #005a36', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ تعديل المتفوقين
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {primaryTopStudents.length > 0 ? (
              primaryTopStudents.map((student, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
                  <img src={student.photo_url || 'https://via.placeholder.com/80'} alt={student.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto', border: '3px solid #005a36' }} />
                  <h3 style={{ fontSize: '15px', margin: '4px 0', color: '#111827', fontWeight: '700' }}>{student.name}</h3>
                  <span style={{ fontSize: '13px', color: '#d97706', fontWeight: '800' }}>النسبة: {student.score}%</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', color: '#6b7280', textAlign: 'center', fontSize: '14px', border: '1px dashed #cbd5e1' }}>
                لم يتم إضافة طلاب متفوقين بعد.
              </div>
            )}
          </div>
        </section>

        {/* 6. أوائل الشهادة المتوسطة */}
        <section style={{ marginBottom: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#005a36', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '20px', backgroundColor: '#ff9900', borderRadius: '3px', display: 'inline-block' }}></span>
              🎓 أوائل الشهادة المتوسطة
            </h2>
            {onBackToDashboard && (
              <button onClick={onBackToDashboard} style={{ backgroundColor: '#ffffff', color: '#005a36', border: '1px solid #005a36', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ تعديل المتفوقين
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {middleTopStudents.length > 0 ? (
              middleTopStudents.map((student, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
                  <img src={student.photo_url || 'https://via.placeholder.com/80'} alt={student.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto', border: '3px solid #005a36' }} />
                  <h3 style={{ fontSize: '15px', margin: '4px 0', color: '#111827', fontWeight: '700' }}>{student.name}</h3>
                  <span style={{ fontSize: '13px', color: '#d97706', fontWeight: '800' }}>النسبة: {student.score}%</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', color: '#6b7280', textAlign: 'center', fontSize: '14px', border: '1px dashed #cbd5e1' }}>
                لم يتم إضافة طلاب متفوقين بعد.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* 7. الفوتر الأخضر الغامق بنفس ألوان سوداني */}
      <footer style={{ backgroundColor: '#003822', color: '#ffffff', paddingTop: '30px', paddingBottom: '15px', borderTop: '4px solid #ff9900' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '25px' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff9900', fontSize: '16px', fontWeight: '700' }}>📞 أرقام التواصل</h3>
            <p style={{ margin: 0, fontSize: '14px', direction: 'ltr', color: '#e5e7eb', fontWeight: '600' }}>+20 114 916 9346 / 01149169346</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff9900', fontSize: '16px', fontWeight: '700' }}>📍 موقعنا</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#e5e7eb', fontWeight: '600' }}>جمهورية مصر العربية - محافظة أسوان</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '25px', paddingTop: '15px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          تصميم وتطوير: <span style={{ color: '#ff9900', fontWeight: 'bold' }}>أستاذ عثمان صديق</span> (01149169346)
        </div>
      </footer>

    </div>
  );
}
