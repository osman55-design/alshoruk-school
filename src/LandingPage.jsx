import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onGoToPortal }) {
  const [news, setNews] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      // 1. جلب الأخبار للشريط المتحرك والكروت
      try {
        const { data: newsData } = await supabase.from('news').select('*');
        if (newsData) setNews(newsData);
      } catch (e) {
        console.warn("تنبيه: لم يتم جلب الأخبار");
      }

      // 2. جلب قائمة المعلمين
      try {
        const { data: teachersData } = await supabase.from('teachers').select('*');
        if (teachersData) setTeachers(teachersData);
      } catch (e) {
        console.warn("تنبيه: لم يتم جلب المعلمين");
      }

      // 3. جلب أعضاء الإدارة
      try {
        const { data: boardData } = await supabase.from('board_members').select('*');
        if (boardData) setBoardMembers(boardData);
      } catch (e) {
        console.warn("تنبيه: لم يتم جلب أعضاء الإدارة");
      }
    };

    fetchAllData();
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. الشريط العلوي مع زر دخول واحد فقط */}
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
          <div style={styles.tickerContent}>
            {news.length > 0 
              ? news.map((item) => ` 🔹 ${item.title}: ${item.content || ''} `).join(' | ') 
              : 'مرحباً بكم في الموقع الرسمي لمدرسة الشروق السودانية المتكاملة.'}
          </div>
        </div>
      </div>

      <main style={styles.mainContent}>
        {/* 3. قسم من نحن وأهدافنا */}
        <section style={styles.gridTwoCols}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📖 من نحن؟</h3>
            <p style={styles.cardText}>
              مدرسة الشروق السودانية المتكاملة صرح تعليمي متميز يهدف إلى تقديم المنهج السوداني المعتمد بأعلى معايير الجودة، مع الاهتمام بالتربية القويمة وبناء شخصية الطالب.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎯 أهدافنا</h3>
            <ul style={styles.list}>
              <li>تقديم تعليم متطور يواكب المعايير الحديثة.</li>
              <li>ترسيخ القيم الأخلاقية والوطنية لدى الطلاب.</li>
              <li>بناء بيئة تعليمية آمنة ومحفزة للابتكار.</li>
            </ul>
          </div>
        </section>

        {/* 4. قسم مجلس الإدارة */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🏛️ إدارة المدرسة</h3>
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
              <p style={styles.emptyText}>سيتم إدراج أعضاء الإدارة قريباً.</p>
            )}
          </div>
        </section>

        {/* 5. قسم الكادر التعليمي (المعلمين) */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>👨‍🏫 الكادر التعليمي</h3>
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
              <p style={styles.emptyText}>سيتم إدراج قائمة المعلمين قريباً.</p>
            )}
          </div>
        </section>

        {/* 6. قسم الطلاب المتفوقين */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🌟 لوحة الشرف (الطلاب المتفوقون)</h3>
          <div style={styles.cardGrid}>
            <div style={styles.personCard}>
              <div style={styles.avatar}>🏆</div>
              <h4 style={styles.personName}>أوائل المدرسة</h4>
              <p style={styles.personRole}>المرحلة الثانوية والمتوسطة</p>
            </div>
          </div>
        </section>
      </main>

      {/* 7. التذييل وحقوق التصميم */}
      <footer style={styles.footer}>
        <p>© 2026 مدرسة الشروق السودانية المتكاملة - جميع الحقوق محفوظة</p>
        <p style={styles.designerCredit}>تم التصميم والتطوير بواسطة: <strong>حنين عثمان</strong> 💻</p>
      </footer>
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
  tickerBadge: { fontWeight: 'bold', marginLeft: '15px', whiteSpace: 'nowrap' },
  tickerWrapper: { overflow: 'hidden', width: '100%' },
  tickerContent: { whiteSpace: 'nowrap' },
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
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
  personName: { color: '#0f172a', margin: '0 0 5px 0', fontSize: '15px', fontWeight: 'bold' },
  personRole: { color: '#64748b', fontSize: '13px', margin: 0 },
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
