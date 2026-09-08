import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onLoginClick }) {
  // حالات البيانات الديناميكية
  const [siteSettings, setSiteSettings] = useState({
    school_name: 'مدرسة الشروق السودانية',
    subtitle: 'البوابة التعليمية المتكاملة',
    hero_title: 'مرحباً بكم في صرح الشروق التعليمي 🎓',
    hero_description: 'بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز بالمنهج السوداني المطور.',
    about_text: 'مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد متخصص لتقديم المنهج السوداني الرصين بكفاءة عالية عبر جميع المراحل.',
    goals_text: 'تقديم تعليم متميز يتوافق مع المعاير التربوية الحديثة، وتعزيز القيم الأخلاقية والوطنية الراسخة في الطلاب.',
    solutions_text: 'بوابة إلكترونية متقدمة تتضمن لوحة تحكم سحابية مخصصة لإدارة شؤون الطلاب، المعلمين، الحسابات، والنتائج بسهولة وموثوقية.',
    developer_text: 'تصميم وتطوير: الأستاذ عثمان صديق ( أبو حلا ) | 📱 01149169346'
  });

  const [boardMembers, setBoardMembers] = useState([]);
  const [primaryStudents, setPrimaryStudents] = useState([]);
  const [middleStudents, setMiddleStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: settings } = await supabase.from('site_settings').select('*').single();
        if (settings) setSiteSettings(prev => ({ ...prev, ...settings }));

        const { data: board } = await supabase.from('board_members').select('*').limit(5);
        if (board) setBoardMembers(board);

        const { data: priStudents } = await supabase.from('top_students').select('*').eq('stage', 'primary').limit(5);
        if (priStudents) setPrimaryStudents(priStudents);

        const { data: midStudents } = await supabase.from('top_students').select('*').eq('stage', 'middle').limit(5);
        if (midStudents) setMiddleStudents(midStudents);

        const { data: teacherList } = await supabase.from('teachers').select('*').limit(25);
        if (teacherList) setTeachers(teacherList);
      } catch (err) {
        console.log('استخدام البيانات الافتراضية');
      }
    }
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. الهيدر العلوي */}
      <header style={styles.header}>
        {/* زر بوابة النظام في أقصى اليسار/اليمين ليعمل مباشرة */}
        <button type="button" style={styles.systemPortalBtn} onClick={onLoginClick}>
          🔑 بوابة النظام
        </button>

        <div style={styles.headerRight}>
          <div>
            <h1 style={styles.schoolName}>{siteSettings.school_name}</h1>
            <p style={styles.schoolSubtitle}>{siteSettings.subtitle}</p>
          </div>
          <div style={styles.logoBadge}>🏫</div>
        </div>
      </header>

      {/* 2. القسم الترحيبي بالمنحنى الحقيقي (Curve) */}
      <section style={styles.heroCurvedSection}>
        <div style={styles.heroContent}>
          <h2 style={styles.heroTitle}>{siteSettings.hero_title}</h2>
          <p style={styles.heroDescription}>{siteSettings.hero_description}</p>

          <div style={styles.badgeContainer}>
            <span style={styles.goldBadge}>🧚‍♂️ توكل • نجاح • تفوق</span>
            <span style={styles.greenBadge}>📚 المنهج السوداني المطور</span>
          </div>
        </div>
      </section>

      {/* 3. المحتوى السفلي */}
      <main style={styles.mainContent}>

        {/* الكروت الثلاثة */}
        <section style={styles.cardsGrid}>
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>📖 من نحن؟</h3>
            <p style={styles.cardText}>{siteSettings.about_text}</p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>🎯 أهدافنا ورسالتنا</h3>
            <p style={styles.cardText}>{siteSettings.goals_text}</p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>💼 الحلول الرقمية الذكية</h3>
            <p style={styles.cardText}>{siteSettings.solutions_text}</p>
          </div>
        </section>

        {/* مجلس الإدارة */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>🏛️ مجلس الإدارة</h2>
          <div style={styles.membersGrid}>
            {(boardMembers.length > 0 ? boardMembers : Array(5).fill({ name: 'اسم العضو', role: 'الصفة الإدارية' })).map((item, idx) => (
              <div key={idx} style={styles.goldCard}>
                <div style={styles.avatarCircle}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '👤'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <p style={styles.memberRole}>{item.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* المتفوقون - ابتدائية */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>🌟 المتفوقون - المرحلة الابتدائية</h2>
          <div style={styles.membersGrid}>
            {(primaryStudents.length > 0 ? primaryStudents : Array(5).fill({ name: 'اسم الطالب/ة', grade: 'المرتبة الأولى' })).map((item, idx) => (
              <div key={idx} style={styles.studentCard}>
                <div style={styles.studentAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '⭐'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <span style={styles.studentGrade}>{item.grade}</span>
              </div>
            ))}
          </div>
        </section>

        {/* المتفوقون - متوسطة */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>🎓 المتفوقون - المرحلة المتوسطة</h2>
          <div style={styles.membersGrid}>
            {(middleStudents.length > 0 ? middleStudents : Array(5).fill({ name: 'اسم الطالب/ة', grade: 'المرتبة الأولى' })).map((item, idx) => (
              <div key={idx} style={styles.studentCard}>
                <div style={styles.studentAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '🏆'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <span style={styles.studentGrade}>{item.grade}</span>
              </div>
            ))}
          </div>
        </section>

        {/* المعلمون */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>👨‍🏫 طاقم التدريس المتميز</h2>
          <div style={styles.teachersGrid}>
            {(teachers.length > 0 ? teachers : Array(25).fill({ name: 'اسم المعلم/ة', subject: 'المادة الدراسية' })).map((item, idx) => (
              <div key={idx} style={styles.teacherCard}>
                <div style={styles.teacherAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '👨‍🏫'}</div>
                <h5 style={styles.teacherName}>{item.name}</h5>
                <p style={styles.teacherSubject}>{item.subject}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* الفوتر */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>✨ {siteSettings.developer_text}</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#ffffff',
    direction: 'rtl',
    minHeight: '100vh',
    color: '#1e293b',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#ffffff',
    borderBottom: '2px solid #d97706',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBadge: {
    fontSize: '28px',
    backgroundColor: '#065f46',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
  },
  schoolName: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#065f46',
  },
  schoolSubtitle: {
    margin: 0,
    fontSize: '12px',
    color: '#d97706',
  },
  systemPortalBtn: {
    backgroundColor: '#065f46',
    color: '#ffffff',
    border: '2px solid #d97706',
    padding: '10px 22px',
    borderRadius: '25px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(6, 95, 70, 0.2)',
  },
  // المنحنى الدائري الحقيقي بدون أخطاء SVG
  heroCurvedSection: {
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    color: '#ffffff',
    padding: '60px 20px 100px 20px',
    textAlign: 'center',
    borderBottomLeftRadius: '50% 30px',
    borderBottomRightRadius: '50% 30px',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  heroDescription: {
    fontSize: '15px',
    lineHeight: '1.6',
    opacity: 0.95,
    marginBottom: '24px',
  },
  badgeContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  goldBadge: {
    backgroundColor: '#d97706',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  greenBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid #ffffff',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px 60px 20px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '-40px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    borderTop: '4px solid #065f46',
  },
  cardTitle: {
    color: '#065f46',
    margin: '0 0 12px 0',
    fontSize: '18px',
  },
  cardText: {
    color: '#475569',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
  },
  sectionContainer: {
    marginTop: '50px',
  },
  sectionHeading: {
    color: '#065f46',
    fontSize: '22px',
    borderRight: '5px solid #d97706',
    paddingRight: '12px',
    marginBottom: '24px',
  },
  membersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  goldCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #fef3c7',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
  },
  teachersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '14px',
  },
  teacherCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '14px',
    textAlign: 'center',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
  },
  avatarCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#fef3c7',
    color: '#d97706',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px auto',
    fontSize: '24px',
  },
  studentAvatar: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px auto',
    fontSize: '22px',
  },
  teacherAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px auto',
    fontSize: '20px',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  memberName: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    color: '#1e293b',
  },
  memberRole: {
    margin: 0,
    fontSize: '12px',
    color: '#d97706',
  },
  studentGrade: {
    fontSize: '12px',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 'bold',
  },
  teacherName: {
    margin: '0 0 2px 0',
    fontSize: '14px',
    color: '#1e293b',
  },
  teacherSubject: {
    margin: 0,
    fontSize: '12px',
    color: '#64748b',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '20px',
    textAlign: 'center',
  },
  footerText: {
    margin: 0,
    fontSize: '13px',
    color: '#475569',
    fontWeight: 'bold',
  },
};
