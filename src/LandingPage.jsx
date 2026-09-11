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
          <div style={styles.logoBox}>
            <img src="/logo.png" alt="شعار المدرسة" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
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
        <section style={styles.glassSection}>
          <div style={styles.gridTwoCols}>
            <div style={styles.innerCard}>
              <div style={styles.cardAccentGold}></div>
              <h3 style={styles.cardTitle}>📖 من نحن؟</h3>
              <p style={styles.cardText}>
                {aboutUs || 'مدرسة الشروق السودانية المتكاملة صرح تعليمي متميز يهدف إلى تقديم المنهج السوداني المعتمد بأعلى معايير الجودة.'}
              </p>
            </div>
            <div style={styles.innerCard}>
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
          </div>
        </section>

        {/* 4. إدارة المدرسة (5 أعضاء) */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🏛️ إدارة المدرسة (5 أعضاء)</h3>
          <div className="cardGrid" style={styles.cardGrid}>
            {boardMembers.length > 0 ? (
              boardMembers.map((member) => (
                <div key={member.id} style={styles.personCard} className="personCard">
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
          <div className="cardGrid" style={styles.cardGrid}>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <div key={teacher.id} style={styles.personCard} className="personCard">
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
          <div className="cardGrid" style={styles.cardGrid}>
            {honors.length > 0 ? (
              honors.map((student) => (
                <div key={student.id} style={styles.personCard} className="personCard">
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
        /* تحسين العرض الأفقي والتحكم بالبطاقات على الجوال */
        @media (max-width: 768px) {
          .cardGrid {
            display: flex;
            overflow-x: auto;
            gap: 14px;
            padding-bottom: 10px;
            scroll-snap-type: x mandatory;
          }
          .personCard {
            min-width: 160px;
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
    backgroundColor: '#f8fafc', // خلفية نظيفة وفاتحة بنفس نمط المنصات الحديثة
    color: '#1e293b',
    direction: 'rtl',
    fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '16px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoBox: {
    width: '48px',
    height: '48px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e2e8f0',
  },
  logo: { width: '32px', height: '32px', objectFit: 'contain' },
  schoolName: { fontSize: '18px', color: '#0f172a', margin: 0, fontWeight: 'bold' },
  portalBtn: {
    backgroundColor: '#0f766e',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(15, 118, 110, 0.2)',
    transition: 'all 0.2s',
  },
  tickerContainer: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 25px',
    fontSize: '13px',
    overflow: 'hidden',
    borderBottom: '1px solid #e2e8f0',
  },
  tickerBadge: { 
    backgroundColor: '#0f766e', 
    color: '#ffffff', 
    padding: '3px 10px', 
    borderRadius: '6px', 
    fontWeight: 'bold', 
    marginLeft: '15px', 
    whiteSpace: 'nowrap', 
    zIndex: 2,
    fontSize: '11.5px'
  },
  tickerWrapper: { overflow: 'hidden', width: '100%', direction: 'ltr' },
  tickerContent: { whiteSpace: 'nowrap' },
  mainContent: {
    flex: 1,
    padding: '30px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  glassSection: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    marginBottom: '35px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  },
  gridTwoCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  innerCard: {
    backgroundColor: '#f8fafc',
    padding: '22px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  cardAccentGold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '4px',
    height: '100%',
    backgroundColor: '#d97706',
  },
  cardAccentGreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '4px',
    height: '100%',
    backgroundColor: '#0f766e',
  },
  cardTitle: { color: '#b45309', margin: '0 0 12px 0', fontSize: '17px', fontWeight: 'bold' },
  cardTitleGreen: { color: '#0f766e', margin: '0 0 12px 0', fontSize: '17px', fontWeight: 'bold' },
  cardText: { color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: 0 },
  list: { color: '#475569', fontSize: '14px', lineHeight: '1.7', paddingRight: '18px', margin: 0 },
  section: { marginBottom: '35px' },
  sectionTitle: { color: '#0f172a', fontSize: '18px', marginBottom: '16px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
    gap: '16px',
  },
  personCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '14px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  avatarContainer: { 
    fontSize: '26px', 
    marginBottom: '10px',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px auto',
    border: '1px solid #e2e8f0',
  },
  personName: { color: '#0f172a', margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 'bold' },
  personRole: { color: '#0f766e', fontSize: '12px', margin: 0, fontWeight: '600' },
  emptyText: { color: '#94a3b8', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '20px' },
  footer: {
    backgroundColor: '#ffffff',
    color: '#64748b',
    textAlign: 'center',
    padding: '22px',
    fontSize: '13px',
    marginTop: 'auto',
    borderTop: '1px solid #e2e8f0',
  },
  designerCredit: { marginTop: '6px', color: '#475569' },
};
