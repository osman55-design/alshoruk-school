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
      // 1. جلب الأخبار
      try {
        const { data } = await supabase.from('news').select('*');
        if (data) setNews(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب الأخبار"); }

      // 2. جلب إدارة المدرسة (محددة بـ 5 اعضاء)
      try {
        const { data } = await supabase.from('board_members').select('*').limit(5);
        if (data) setBoardMembers(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب أعضاء الإدارة"); }

      // 3. جلب الكادر التعليمي (محدد بـ 25 معلم)
      try {
        const { data } = await supabase.from('teachers').select('*').limit(25);
        if (data) setTeachers(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب المعلمين"); }

      // 4. جلب لوحة الشرف (محددة بـ 10 طلاب)
      try {
        const { data } = await supabase.from('students').select('*').eq('is_honor', true).limit(10);
        if (data) setHonors(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب لوحة الشرف"); }

      // 5. جلب من نحن والأهداف من جدول الإعدادات
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
      {/* 1. الهيدر العلوي - زر دخول واحد فقط */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <img src="/logo.png" alt="شعار المدرسة" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
          <h1 style={styles.schoolName}>مدرسة الشروق السودانية المتكاملة</h1>
        </div>
        <button type="button" onClick={onGoToPortal} style={styles.portalBtn}>
          🔑 دخول البوابة
        </button>
      </header>

      {/* 2. الشريط المتحرك من اليسار إلى اليمين */}
      <div style={styles.tickerContainer}>
        <span style={styles.tickerBadge}>📢 آخر الأخبار:</span>
        <div style={styles.tickerWrapper}>
          <div style={styles.tickerContent}>
            {news.length > 0 
              ? news.map((item) => ` 🔹 ${item.title}: ${item.content || ''} `).join(' | ') 
              : 'مرحباً بكم في الموقع الرسمي لمدرسة الشروق السودانية المتكاملة.'}
          </div>
        </div>
      </div>

      <main style={styles.mainContent}>
        {/* 3. من نحن وأهدافنا */}
        <section style={styles.gridTwoCols}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📖 من نحن؟</h3>
            <p style={styles.cardText}>
              {aboutUs || 'مدرسة الشروق السودانية المتكاملة صرح تعليمي متميز يهدف إلى تقديم المنهج السوداني المعتمد بأعلى معايير الجودة.'}
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎯 أهدافنا</h3>
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
                  <div style={styles.avatar}>👤</div>
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
                  <div style={styles.avatar}>🎓</div>
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
                  <div style={styles.avatar}>🏆</div>
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
        <p style={styles.designerCredit}>تم التصميم والتطوير بواسطة: <strong>أستاذ عثمان صديق </strong> 💻</p>
      </footer>

      {/* كود حركة الشريط الإخباري من اليسار إلى اليمين */}
      <style>{`
        @keyframes scrollLeftToRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .ticker-move {
          display: inline-block;
          white-space: nowrap;
          animation: scrollLeftToRight 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    direction: 'rtl',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { width: '40px', height: '40px', objectFit: 'contain' },
  schoolName: { fontSize: '18px', color: '#047857', margin: 0, fontWeight: 'bold' },
  portalBtn: {
    backgroundColor: '#047857',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tickerContainer: {
    backgroundColor: '#047857',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 20px',
    fontSize: '14px',
    overflow: 'hidden',
  },
  tickerBadge: { fontWeight: 'bold', marginLeft: '15px', whiteSpace: 'nowrap', zIndex: 2 },
  tickerWrapper: { overflow: 'hidden', width: '100%', direction: 'ltr' },
  tickerContent: { className: 'ticker-move' },
  mainContent: {
    flex: 1,
    padding: '30px 20px',
    maxWidth: '1100px',
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
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    borderTop: '4px solid #047857',
  },
  cardTitle: { color: '#047857', margin: '0 0 12px 0', fontSize: '18px' },
  cardText: { color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 },
  list: { color: '#475569', fontSize: '14px', lineHeight: '1.8', paddingRight: '20px', margin: 0 },
  section: { marginBottom: '35px' },
  sectionTitle: { color: '#1e293b', fontSize: '18px', marginBottom: '15px', fontWeight: 'bold' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px',
  },
  personCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
  },
  avatar: { fontSize: '32px', marginBottom: '8px' },
  personName: { color: '#0f172a', margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' },
  personRole: { color: '#64748b', fontSize: '12px', margin: 0 },
  emptyText: { color: '#94a3b8', fontSize: '13px' },
  footer: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '20px',
    fontSize: '13px',
    marginTop: 'auto',
  },
  designerCredit: { marginTop: '5px', color: '#cbd5e1' },
};
