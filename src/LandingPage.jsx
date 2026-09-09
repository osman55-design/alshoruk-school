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
      {/* 1. الهيدر العلوي */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <img src="/logo.png" alt="شعار المدرسة" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
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

      {/* التنسيقات والحركات */}
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
        /* تحسين العرض الأفقى والتحكم بالبطاقات على الجوال */
        @media (max-width: 768px) {
          .cardGrid {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            padding-bottom: 10px;
            scroll-snap-type: x mandatory;
          }
          .personCard {
            min-width: 150px;
            flex: 0 0 auto;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0c0f0e', // خلفية داكنة وهادئة جداً ومريحة للعين
    color: '#e2e8f0',
    direction: 'rtl',
    fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#121816',
    padding: '12px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #1e2923',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { width: '42px', height: '42px', objectFit: 'contain' }, // تم إزالة الحواشي والخلفيات ليعرض الشعار صافياً
  schoolName: { fontSize: '17px', color: '#fbbf24', margin: 0, fontWeight: 'bold' },
  portalBtn: {
    backgroundColor: '#047857',
    color: '#ffffff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tickerContainer: {
    backgroundColor: '#16221d',
    color: '#d1fae5',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 20px',
    fontSize: '13px',
    overflow: 'hidden',
    borderBottom: '1px solid #1e2923',
  },
  tickerBadge: { 
    backgroundColor: '#fbbf24', 
    color: '#0c0f0e', 
    padding: '2px 8px', 
    borderRadius: '6px', 
    fontWeight: 'bold', 
    marginLeft: '12px', 
    whiteSpace: 'nowrap', 
    zIndex: 2,
    fontSize: '11px'
  },
  tickerWrapper: { overflow: 'hidden', width: '100%', direction: 'ltr' },
  tickerContent: { whiteSpace: 'nowrap' },
  mainContent: {
    flex: 1,
    padding: '25px 15px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  gridTwoCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#161d1a',
    padding: '22px',
    borderRadius: '12px',
    border: '1px solid #1f2b25',
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
  cardTitle: { color: '#fbbf24', margin: '0 0 12px 0', fontSize: '17px', fontWeight: 'bold' },
  cardTitleGreen: { color: '#34d399', margin: '0 0 12px 0', fontSize: '17px', fontWeight: 'bold' },
  cardText: { color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', margin: 0 },
  list: { color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', paddingRight: '18px', margin: 0 },
  section: { marginBottom: '30px' },
  sectionTitle: { color: '#fbbf24', fontSize: '17px', marginBottom: '15px', fontWeight: 'bold', borderBottom: '1px solid #1f2b25', paddingBottom: '8px' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px',
  },
  personCard: {
    backgroundColor: '#161d1a',
    padding: '18px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #1f2b25',
  },
  avatarContainer: { 
    fontSize: '28px', 
    marginBottom: '8px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#1f2b25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px auto',
  },
  personName: { color: '#ffffff', margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' },
  personRole: { color: '#fbbf24', fontSize: '11px', margin: 0 },
  emptyText: { color: '#64748b', fontSize: '12px', gridColumn: '1 / -1', textAlign: 'center', padding: '15px' },
  footer: {
    backgroundColor: '#080a09',
    color: '#64748b',
    textAlign: 'center',
    padding: '20px',
    fontSize: '12px',
    marginTop: 'auto',
    borderTop: '1px solid #161d1a',
  },
  designerCredit: { marginTop: '5px', color: '#94a3b8' },
};
