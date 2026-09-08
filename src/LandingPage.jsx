import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ goToLogin }) {
  const [siteSettings, setSiteSettings] = useState({
    about_text: 'مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد متخصص لتقديم المنهج السوداني الرصين بكفاءة عالية عبر جميع المراحل.',
    goals_text: 'تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة، وتعزيز القيم الأخلاقية والوطنية الراسخة في الطلاب.',
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
      {/* إدراج تنسيقات السحب الأفقي للموبايل */}
      <style>{`
        .scroll-container {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 12px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        .scroll-container::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .scroll-item {
          scroll-snap-align: start;
          flex: 0 0 160px; /* عرض مناسب يتيح رؤية عدة عناصر أو التمرير بسلاسة على الموبايل */
        }
      `}</style>

      {/* الهيدر العلوي */}
      <header style={styles.header}>
        <button type="button" style={styles.systemPortalBtn} onClick={goToLogin}>
          🔑 بوابة النظام
        </button>

        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="شعار المدرسة" style={styles.logoImage} />
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={styles.mainContent}>

        {/* الكروت الثلاثة الرئيسية */}
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
          <div className="scroll-container">
            {(boardMembers.length > 0 ? boardMembers : [
              { name: 'عثمان صديق', role: 'رئيس مجلس الإدارة' },
              { name: 'أحمد علي', role: 'نائب الرئيس' },
              { name: 'محمد حسن', role: 'المدير التنفيذي' },
              { name: 'عالم مصطفى', role: 'المشرف العام' },
              { name: 'حلا عثمان', role: 'الأمانة العامة' },
            ]).map((item, idx) => (
              <div key={idx} className="scroll-item" style={styles.goldCard}>
                <div style={styles.avatarCircle}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '👤'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <p style={styles.memberRole}>{item.role || 'المسمى الوظيفي'}</p>
              </div>
            ))}
          </div>
        </section>

        {/* المتفوقون - المرحلة الابتدائية */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>🌟 المتفوقون - المرحلة الابتدائية</h2>
          <div className="scroll-container">
            {(primaryStudents.length > 0 ? primaryStudents : [
              { name: 'محمد أحمد', grade: 'المرتبة الأولى', total_score: '98.5%' },
              { name: 'سارة يوسف', grade: 'المرتبة الثانية', total_score: '97.2%' },
              { name: 'عمر خالد', grade: 'المرتبة الثالثة', total_score: '96.8%' },
              { name: 'فاطمة علي', grade: 'المرتبة الرابعة', total_score: '95.5%' },
              { name: 'عبدالله حسن', grade: 'المرتبة الخامسة', total_score: '94.0%' },
            ]).map((item, idx) => (
              <div key={idx} className="scroll-item" style={styles.studentCard}>
                <div style={styles.studentAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '⭐'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <div style={styles.badgeGroup}>
                  <span style={styles.studentGrade}>{item.grade || 'المرتبة'}</span>
                  <span style={styles.scoreBadge}>الدرجة: {item.total_score || item.score || '98%'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* المتفوقون - المرحلة المتوسطة */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>🎓 المتفوقون - المرحلة المتوسطة</h2>
          <div className="scroll-container">
            {(middleStudents.length > 0 ? middleStudents : [
              { name: 'أحمد محمود', grade: 'المرتبة الأولى', total_score: '99.0%' },
              { name: 'ريم العبيد', grade: 'المرتبة الثانية', total_score: '98.1%' },
              { name: 'خالد إبراهيم', grade: 'المرتبة الثالثة', total_score: '97.4%' },
              { name: 'منى طارق', grade: 'المرتبة الرابعة', total_score: '96.0%' },
              { name: 'حمزة عثمان', grade: 'المرتبة الخامسة', total_score: '95.2%' },
            ]).map((item, idx) => (
              <div key={idx} className="scroll-item" style={styles.studentCard}>
                <div style={styles.studentAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '🏆'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <div style={styles.badgeGroup}>
                  <span style={styles.studentGrade}>{item.grade || 'المرتبة'}</span>
                  <span style={styles.scoreBadge}>الدرجة: {item.total_score || item.score || '99%'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* طاقم التدريس */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>👨‍🏫 طاقم التدريس المتميز</h2>
          <div className="scroll-container">
            {(teachers.length > 0 ? teachers : Array(10).fill(null).map((_, i) => ({
              name: `معلم ${i + 1}`,
              subject: 'اللغة العربية'
            }))).map((item, idx) => (
              <div key={idx} className="scroll-item" style={styles.teacherCard}>
                <div style={styles.teacherAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '👨‍🏫'}</div>
                <h5 style={styles.teacherName}>{item.name}</h5>
                <p style={styles.teacherSubject}>المادة: {item.subject || 'غير محدد'}</p>
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
    backgroundColor: '#f8fafc',
    direction: 'rtl',
    minHeight: '100vh',
    color: '#1e293b',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '3px solid #d97706',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImage: {
    height: '85px',
    width: 'auto',
    objectFit: 'contain',
  },
  systemPortalBtn: {
    backgroundColor: '#065f46',
    color: '#ffffff',
    border: '2px solid #d97706',
    padding: '8px 20px',
    borderRadius: '25px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(6, 95, 70, 0.15)',
    whiteSpace: 'nowrap',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px 60px 16px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    borderTop: '4px solid #065f46',
  },
  cardTitle: {
    color: '#065f46',
    margin: '0 0 10px 0',
    fontSize: '17px',
  },
  cardText: {
    color: '#475569',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: 0,
  },
  sectionContainer: {
    marginTop: '36px',
  },
  sectionHeading: {
    color: '#065f46',
    fontSize: '20px',
    borderRight: '5px solid #d97706',
    paddingRight: '10px',
    marginBottom: '16px',
  },
  goldCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #fef3c7',
    borderRadius: '12px',
    padding: '14px 10px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    boxSizing: 'border-box',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '14px 10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    boxSizing: 'border-box',
  },
  teacherCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '14px 10px',
    textAlign: 'center',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    boxSizing: 'border-box',
  },
  avatarCircle: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    backgroundColor: '#fef3c7',
    color: '#d97706',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    fontSize: '22px',
  },
  studentAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    fontSize: '20px',
  },
  teacherAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
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
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '140px',
  },
  memberRole: {
    margin: 0,
    fontSize: '12px',
    color: '#d97706',
    fontWeight: 'bold',
  },
  badgeGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
    marginTop: '2px',
  },
  studentGrade: {
    fontSize: '11px',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 'bold',
  },
  scoreBadge: {
    fontSize: '11px',
    backgroundColor: '#fef3c7',
    color: '#b45309',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 'bold',
  },
  teacherName: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '140px',
  },
  teacherSubject: {
    margin: 0,
    fontSize: '12px',
    color: '#065f46',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '16px',
    textAlign: 'center',
  },
  footerText: {
    margin: 0,
    fontSize: '12px',
    color: '#475569',
    fontWeight: 'bold',
  },
};
