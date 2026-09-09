import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onGoToPortal }) {
  const [news, setNews] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [honors, setHonors] = useState([]);
  const [aboutUs, setAboutUs] = useState('');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const { data } = await supabase.from('news').select('*');
        if (data) setNews(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب الأخبار"); }

      try {
        const { data } = await supabase.from('board_members').select('*').limit(5);
        if (data) setBoardMembers(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب أعضاء الإدارة"); }

      try {
        const { data } = await supabase.from('teachers').select('*').limit(25);
        if (data) setTeachers(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب المعلمين"); }

      try {
        const { data } = await supabase.from('students').select('*').eq('is_honor', true).limit(10);
        if (data) setHonors(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب لوحة الشرف"); }

      try {
        const { data } = await supabase.from('settings').select('*').maybeSingle();
        if (data) {
          if (data.about_us) setAboutUs(data.about_us);
          if (data.goals) setGoals(Array.isArray(data.goals) ? data.goals : JSON.parse(data.goals));
        }
      } catch (e) { console.warn("تنبيه: لم يتم جلب بيانات الإعدادات"); }
    };

    fetchAllData();
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. الهيدر العلوي العصري */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logoWrapper}>
            <img src="/logo.png" alt="شعار المدرسة" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
            <span style={styles.logoFallback}>ش</span>
          </div>
          <h1 style={styles.schoolName}>مدرسة الشروق السودانية المتكاملة</h1>
        </div>
        <button type="button" onClick={onGoToPortal} style={styles.portalBtn}>
          🔑 دخول البوابة
        </button>
      </header>

      {/* 2. الشريط المتحرك للأخبار */}
      <div style={styles.tickerContainer}>
        <span style={styles.tickerBadge}>📢 آخر الأخبار:</span>
        <div style={styles.tickerWrapper}>
          <div className="ticker-move" style={styles.tickerContent}>
            {news.length > 0 
              ? news.map((item) => ` 🔹 ${item.title}: ${item.content || ''} `).join(' | ') 
              : 'مرحباً بكم في الموقع الرسمي لمدرسة الشروق السودانية المتكاملة | البرنامج تحت التعديل والتطوير.'}
          </div>
        </div>
      </div>

      <main style={styles.mainContent}>
        {/* 3. من نحن وأهدافنا */}
        <section style={styles.gridTwoCols}>
          <div style={styles.card}>
            <div style={styles.cardAccentGold}></div>
            <h3 style={styles.cardTitle}>📖 من نحن؟</h3>
            <p style={styles.cardText}>
              {aboutUs || 'مدرسة الشروق السودانية المتكاملة صرح تعليمي متميز يهدف إلى تقديم المنهج السوداني المعتمد بأعلى معايير الجودة.'}
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardAccentGreen}></div>
            <h3 style={styles.cardTitleGreen}>🎯 أهدافنا</h3>
            <ul style={styles.list}>
              {goals.length > 0 ? (
                goals.map((goal, index) => <li key={index}>{goal}</li>)
              ) : (
                <>
                  <li>تقديم تعليم متطور يواكب المعايير الحديثة.</li>
                  <li>ترسيخ القيم الأخلاقية والوطنية لدى الطلاب.</li>
                  <li>بناء بيئة تعليمية آمنة ومحفزة للابتكار.</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* 4. إدارة المدرسة (5 أعضاء) */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🏛️ إدارة المدرسة (5 أعضاء)</h3>
          <div style={styles.cardGrid}>
            {boardMembers.length > 0 ? (
              boardMembers.map((member) => (
                <div key={member.id} style={styles.personCard}>
                  <div style={styles.avatarContainer}>👤</div>
                  <h4 style={styles.personName}>{member.name || member.full_name}</h4>
                  <p style={styles.personRole}>{member.role || 'عضو مجلس الإدارة'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>يمكنك إضافة أعضاء الإدارة من لوحة التحكم بعد تسجيل الدخول.</p>
            )}
          </div>
        </section>

        {/* 5. الكادر التعليمي (25 معلم) */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>👨‍🏫 الكادر التعليمي (25 معلم)</h3>
          <div style={styles.cardGrid}>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <div key={teacher.id} style={styles.personCard}>
                  <div style={styles.avatarContainer}>🎓</div>
                  <h4 style={styles.personName}>{teacher.full_name || teacher.name}</h4>
                  <p style={styles.personRole}>{teacher.subject || 'معلم'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>يمكنك إضافة الكادر التعليمي من لوحة التحكم بعد تسجيل الدخول.</p>
            )}
          </div>
        </section>

        {/* 6. لوحة الشرف (10 طلاب) */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🌟 لوحة الشرف (10 طلاب متفوقين)</h3>
          <div style={styles.cardGrid}>
            {honors.length > 0 ? (
              honors.map((student) => (
                <div key={student.id} style={styles.personCard}>
                  <div style={styles.avatarContainer}>🏆</div>
                  <h4 style={styles.personName}>{student.full_name || student.name}</h4>
                  <p style={styles.personRole}>{student.class_name || 'طالب متفوق'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>يمكنك تحديد الطلاب المتفوقين من لوحة التحكم بعد تسجيل الدخول.</p>
            )}
          </div>
        </section>
      </main>

      {/* 7. التذييل والحقوق */}
      <footer style={styles.footer}>
        <p>© 2026 مدرسة الشروق السودانية المتكاملة - جميع الحقوق محفوظة</p>
        <p style={styles.designerCredit}>تم التصميم والتطوير بواسطة: <strong>أستاذ عثمان صديق</strong> 💻</p>
      </footer>

      {/* تأثيرات الحركة والتصميم العصري الزجاجي */}
      <style>{`
        @keyframes scrollLeftToRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .ticker-move {
          display: inline-block;
          white-space: nowrap;
          animation: scrollLeftToRight 30s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #05130f;
        }
        ::-webkit-scrollbar-thumb {
          background: #065f46;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#05130f',
    color: '#ffffff',
    direction: 'rtl',
    fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: 'rgba(7, 25, 19, 0.95)',
    backdropFilter: 'blur(12px)',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(6, 95, 70, 0.5)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f59e0b, #059669)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(245, 158, 11, 0.2)',
  },
  logo: { width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' },
  logoFallback: { fontSize: '18px', fontWeight: 'bold', color: '#05130f' },
  schoolName: { fontSize: '18px', color: '#fbbf24', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px' },
  portalBtn: {
    background: 'linear-gradient(135deg, #059669, #047857)',
    color: '#ffffff',
    border: '1px solid rgba(251, 191, 36, 0.4)',
    padding: '10px 22px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(4, 120, 87, 0.4)',
    transition: 'all 0.3s ease',
  },
  tickerContainer: {
    backgroundColor: 'rgba(4, 47, 34, 0.9)',
    color: '#ecfdf5',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '14px',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
  },
  tickerBadge: { 
    backgroundColor: '#fbbf24', 
    color: '#05130f', 
    padding: '3px 10px', 
    borderRadius: '8px', 
    fontWeight: 'bold', 
    marginLeft: '15px', 
    whiteSpace: 'nowrap', 
    zIndex: 2,
    fontSize: '12px'
  },
  tickerWrapper: { overflow: 'hidden', width: '100%', direction: 'ltr' },
  tickerContent: { whiteSpace: 'nowrap' },
  mainContent: {
    flex: 1,
    padding: '35px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  gridTwoCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '25px',
    marginBottom: '35px',
  },
  card: {
    backgroundColor: 'rgba(11, 35, 28, 0.75)',
    backdropFilter: 'blur(14px)',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardAccentGold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '4px',
    height: '100%',
    backgroundColor: '#fbbf24',
  },
  cardAccentGreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '4px',
    height: '100%',
    backgroundColor: '#10b981',
  },
  cardTitle: { color: '#fbbf24', margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold' },
  cardTitleGreen: { color: '#34d399', margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold' },
  cardText: { color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8', margin: 0 },
  list: { color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8', paddingRight: '20px', margin: 0 },
  section: { marginBottom: '40px' },
  sectionTitle: { color: '#fbbf24', fontSize: '19px', marginBottom: '20px', fontWeight: 'bold', borderBottom: '1px solid rgba(6, 95, 70, 0.6)', paddingBottom: '10px' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  personCard: {
    backgroundColor: 'rgba(11, 35, 28, 0.75)',
    backdropFilter: 'blur(10px)',
    padding: '22px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
    border: '1px solid rgba(6, 95, 70, 0.4)',
    transition: 'transform 0.3s ease',
  },
  avatarContainer: { 
    fontSize: '32px', 
    marginBottom: '10px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(6, 95, 70, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px auto',
    border: '1px solid rgba(245, 158, 11, 0.3)'
  },
  personName: { color: '#ffffff', margin: '0 0 6px 0', fontSize: '15px', fontWeight: 'bold' },
  personRole: { color: '#fbbf24', fontSize: '12px', margin: 0, fontWeight: '600' },
  emptyText: { color: '#94a3b8', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '20px' },
  footer: {
    backgroundColor: '#030d0a',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '25px',
    fontSize: '13px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(6, 95, 70, 0.4)',
  },
  designerCredit: { marginTop: '8px', color: '#cbd5e1' },
};
