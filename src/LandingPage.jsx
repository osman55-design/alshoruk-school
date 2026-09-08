import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ goToLogin }) {
  const [siteSettings, setSiteSettings] = useState({
    about_text: 'مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد متخصص لتقديم المنهج السوداني الرصين بكفاءة عالية عبر جميع المراحل.',
    goals_text: 'تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة، وتعزيز القيم الأخلاقية والوطنية الراسخة في الطلاب.',
    solutions_text: 'بوابة إلكترونية متقدمة تتضمن لوحة تحكم سحابية مخصصة لإدارة شؤون الطلاب، المعلمين، الحسابات، والنتائج بسهولة وموثوقية.',
    developer_text: 'تصميم وتطوير: الأستاذ عثمان صديق ( أبو حلا ) | 📱 01149169346'
  });

  const [newsList, setNewsList] = useState([
    'فتح باب التسجيل للعام الدراسي الجديد ٢٠٢٦ / ٢٠٢٧ م بجميع المراحل',
    'تكريم الطلاب المتفوقين في امتحانات الفترة الدراسية الأولى',
    'بدء الأنشطة الرياضية والثقافية والرحلات الميدانية للطلاب'
  ]);

  const [boardMembers, setBoardMembers] = useState([]);
  const [primaryStudents, setPrimaryStudents] = useState([]);
  const [middleStudents, setMiddleStudents] = useState([]);
  const [secondaryStudents, setSecondaryStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: settings } = await supabase.from('site_settings').select('*').single();
        if (settings) setSiteSettings(prev => ({ ...prev, ...settings }));

        const { data: newsData } = await supabase.from('school_news').select('title');
        if (newsData && newsData.length > 0) {
          setNewsList(newsData.map(n => n.title));
        }

        const { data: board } = await supabase.from('board_members').select('*').limit(5);
        if (board) setBoardMembers(board);

        const { data: priStudents } = await supabase.from('top_students').select('*').eq('stage', 'primary').limit(5);
        if (priStudents) setPrimaryStudents(priStudents);

        const { data: midStudents } = await supabase.from('top_students').select('*').eq('stage', 'middle').limit(5);
        if (midStudents) setMiddleStudents(midStudents);

        const { data: secStudents } = await supabase.from('top_students').select('*').eq('stage', 'secondary').limit(5);
        if (secStudents) setSecondaryStudents(secStudents);

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
      {/* التنسيقات الخاصة بالسحب والحركة */}
      <style>{`
        .scroll-container {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 10px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .scroll-container::-webkit-scrollbar {
          height: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .scroll-item {
          scroll-snap-align: start;
          flex: 0 0 145px;
        }

        /* تحريك شريط الأخبار من اليسار لليمين */
        @keyframes scrollLeftToRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .ticker-text-container {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: scrollLeftToRight 25s linear infinite;
        }
        .ticker-wrapper:hover .ticker-text-container {
          animation-play-state: paused;
        }
      `}</style>

      {/* الهيدر العلوي: الشعار يمين - المراحل في الوسط - البوابة شمال */}
      <header style={styles.header}>
        {/* اليمين: الشعار */}
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="شعار المدرسة" style={styles.logoImage} />
        </div>

        {/* المنتصف: شريط المراحل */}
        <div style={styles.singleLineStages}>
          <span style={styles.stageChip}>👶 روضة</span>
          <span style={styles.stageChip}>🎒 ابتدائي</span>
          <span style={styles.stageChip}>📚 متوسط</span>
          <span style={styles.stageChip}>🎓 ثانوي</span>
        </div>

        {/* اليسار: بوابة النظام */}
        <button type="button" style={styles.systemPortalBtn} onClick={goToLogin}>
          🔑 بوابة النظام
        </button>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={styles.mainContent}>

        {/* شريط أخبار المدرسة المتحرك (قبل قسم من نحن) */}
        <section style={styles.newsTickerBar} className="ticker-wrapper">
          <div style={styles.tickerTitleBadge}>
            📢 آخر الأخبار:
          </div>
          <div style={styles.tickerContentOverflow}>
            <div className="ticker-text-container">
              {newsList.map((item, index) => (
                <React.Fragment key={index}>
                  <span style={styles.newsItemText}>{item}</span>
                  <img src="/logo.png" alt="•" style={styles.newsSeparatorLogo} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

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
              { name: 'محمد أحمد', score: '98.5%' },
              { name: 'سارة يوسف', score: '97.2%' },
              { name: 'عمر خالد', score: '96.8%' },
              { name: 'فاطمة علي', score: '95.5%' },
              { name: 'عبدالله حسن', score: '94.0%' },
            ]).map((item, idx) => (
              <div key={idx} className="scroll-item" style={styles.studentCard}>
                <div style={styles.studentAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '⭐'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <span style={styles.scoreBadge}>الدرجة: {item.total_score || item.score || '98%'}</span>
              </div>
            ))}
          </div>
        </section>

        {/* المتفوقون - المرحلة المتوسطة */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>🎓 المتفوقون - المرحلة المتوسطة</h2>
          <div className="scroll-container">
            {(middleStudents.length > 0 ? middleStudents : [
              { name: 'أحمد محمود', score: '99.0%' },
              { name: 'ريم العبيد', score: '98.1%' },
              { name: 'خالد إبراهيم', score: '97.4%' },
              { name: 'منى طارق', score: '96.0%' },
              { name: 'حمزة عثمان', score: '95.2%' },
            ]).map((item, idx) => (
              <div key={idx} className="scroll-item" style={styles.studentCard}>
                <div style={styles.studentAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '🏆'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <span style={styles.scoreBadge}>الدرجة: {item.total_score || item.score || '99%'}</span>
              </div>
            ))}
          </div>
        </section>

        {/* المتفوقون - المرحلة الثانوية */}
        <section style={styles.sectionContainer}>
          <h2 style={styles.sectionHeading}>👑 المتفوقون - المرحلة الثانوية</h2>
          <div className="scroll-container">
            {(secondaryStudents.length > 0 ? secondaryStudents : [
              { name: 'مصطفى عثمان', score: '99.4%' },
              { name: 'آية الصادق', score: '98.8%' },
              { name: 'ياسين أحمد', score: '98.0%' },
              { name: 'هبة عمر', score: '97.5%' },
              { name: 'هشام الهادي', score: '96.9%' },
            ]).map((item, idx) => (
              <div key={idx} className="scroll-item" style={styles.studentCard}>
                <div style={styles.studentAvatar}>{item.avatar ? <img src={item.avatar} alt="" style={styles.avatarImg} /> : '👑'}</div>
                <h4 style={styles.memberName}>{item.name}</h4>
                <span style={styles.scoreBadge}>الدرجة: {item.total_score || item.score || '99%'}</span>
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
    backgroundColor: '#ecfdf5',
    borderBottom: '2px solid #a7f3d0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    padding: '8px 12px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoImage: {
    height: '48px',
    width: 'auto',
    objectFit: 'contain',
  },
  systemPortalBtn: {
    backgroundColor: '#065f46',
    color: '#ffffff',
    border: '1px solid #d97706',
    padding: '6px 14px',
    borderRadius: '18px',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  singleLineStages: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  stageChip: {
    backgroundColor: '#ffffff',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    padding: '2px 6px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 16px 50px 16px',
  },
  newsTickerBar: {
    backgroundColor: '#ffffff',
    border: '1px solid #a7f3d0',
    borderRadius: '10px',
    padding: '6px 10px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
  },
  tickerTitleBadge: {
    backgroundColor: '#065f46',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    zIndex: 2,
    marginLeft: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  tickerContentOverflow: {
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
    direction: 'ltr',
  },
  newsItemText: {
    fontSize: '13px',
    color: '#1e293b',
    fontWeight: '600',
    padding: '0 10px',
    direction: 'rtl',
    display: 'inline-block',
  },
  newsSeparatorLogo: {
    height: '18px',
    width: 'auto',
    margin: '0 15px',
    verticalAlign: 'middle',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '14px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '18px',
    boxShadow: '0 3px 12px rgba(0,0,0,0.04)',
    borderTop: '4px solid #065f46',
  },
  cardTitle: {
    color: '#065f46',
    margin: '0 0 8px 0',
    fontSize: '16px',
  },
  cardText: {
    color: '#475569',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0,
  },
  sectionContainer: {
    marginTop: '30px',
  },
  sectionHeading: {
    color: '#065f46',
    fontSize: '18px',
    borderRight: '4px solid #d97706',
    paddingRight: '10px',
    marginBottom: '14px',
  },
  goldCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #fef3c7',
    borderRadius: '12px',
    padding: '12px 8px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(217, 119, 6, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '12px 8px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  teacherCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '12px 8px',
    textAlign: 'center',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: '#fef3c7',
    color: '#d97706',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px',
    fontSize: '18px',
  },
  studentAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px',
    fontSize: '18px',
  },
  teacherAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px',
    fontSize: '16px',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  memberName: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '125px',
  },
  memberRole: {
    margin: 0,
    fontSize: '11px',
    color: '#d97706',
    fontWeight: 'bold',
  },
  scoreBadge: {
    fontSize: '11px',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    padding: '2px 8px',
    borderRadius: '8px',
    fontWeight: 'bold',
    border: '1px solid #a7f3d0',
  },
  teacherName: {
    margin: '0 0 3px 0',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '125px',
  },
  teacherSubject: {
    margin: 0,
    fontSize: '11px',
    color: '#065f46',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '14px',
    textAlign: 'center',
  },
  footerText: {
    margin: 0,
    fontSize: '12px',
    color: '#475569',
    fontWeight: 'bold',
  },
};
