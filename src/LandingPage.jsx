import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// الاتصال المباشر بثبات لمنع أخطاء الـ Environment
const supabaseUrl = 'https://jtmmtmwdmcxjfshjddaq.supabase.co';
const supabaseAnonKey = 'sb_publishable_wnS38tUCR8vS2bUGixFdpA_1hC62xEz';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LandingPage() {
  const [news, setNews] = useState([]);
  const [aboutUs, setAboutUs] = useState('');
  const [goals, setGoals] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [supervision, setSupervision] = useState([]);
  
  // حالات لوحة الشرف الموزعة حسب المراحل الأربع
  const [honorKindergarten, setHonorKindergarten] = useState([]);
  const [honorPrimary, setHonorPrimary] = useState([]);
  const [honorMiddle, setHonorMiddle] = useState([]);
  const [honorHigh, setHonorHigh] = useState([]);
  const [activeTab, setActiveTab] = useState('primary');

  const [siteSections, setSiteSections] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      // 1. الشريط الإخباري
      try {
        const { data } = await supabase.from('news').select('*');
        if (data) setNews(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب الأخبار"); }

      // 2. من نحن والأهداف
      try {
        const { data } = await supabase.from('settings').select('*').maybeSingle();
        if (data) {
          if (data.about_us) setAboutUs(data.about_us);
          if (data.goals) setGoals(Array.isArray(data.goals) ? data.goals : JSON.parse(data.goals));
        }
      } catch (e) { console.warn("تنبيه: لم يتم جلب بيانات الإعدادات"); }

      // 3. الإدارة
      try {
        const { data } = await supabase.from('board_members').select('*');
        if (data) setBoardMembers(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب أعضاء الإدارة"); }

      // 4. الكادر التعليمي
      try {
        const { data } = await supabase.from('teachers').select('*');
        if (data) setTeachers(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب المعلمين"); }

      // 5. الإشراف
      try {
        const { data } = await supabase.from('supervision').select('*');
        if (data) setSupervision(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب قسم الإشراف"); }

      // 6. جلب لوحة الشرف وتوزيعها بدقة
      try {
        const { data } = await supabase.from('top_students').select('*');
        if (data) {
          setHonorKindergarten(data.filter(s => s.stage && s.stage.toLowerCase() === 'kindergarten'));
          setHonorPrimary(data.filter(s => s.stage && (s.stage.toLowerCase() === 'primary' || s.stage.toLowerCase() === 'الابتدائية')));
          setHonorMiddle(data.filter(s => s.stage && (s.stage.toLowerCase() === 'middle' || s.stage.toLowerCase() === 'المتوسطة')));
          setHonorHigh(data.filter(s => s.stage && (s.stage.toLowerCase() === 'high' || s.stage.toLowerCase() === 'الثانوية')));
        }
      } catch (e) { console.warn("تنبيه: لم يتم جلب لوحة الشرف"); }

      // 7. قسم الموقع
      try {
        const { data } = await supabase.from('site_sections').select('*');
        if (data) setSiteSections(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب أقسام الموقع"); }

      // 8. أرقام التواصل
      try {
        const { data } = await supabase.from('contacts').select('*');
        if (data) setContacts(data);
      } catch (e) { console.warn("تنبيه: لم يتم جلب أرقام التواصل"); }
    };

    fetchAllData();
  }, []);

  const getActiveHonorStudents = () => {
    switch (activeTab) {
      case 'kindergarten': return honorKindergarten;
      case 'primary': return honorPrimary;
      case 'middle': return honorMiddle;
      case 'high': return honorHigh;
      default: return [];
    }
  };

  return (
    <div style={styles.pageContainer} dir="rtl">
      {news.length > 0 && (
        <div style={styles.newsTicker}>
          <span style={styles.newsLabel}>أخبار عاجلة:</span>
          <div style={styles.newsContent}>
            {news.map((item, index) => (
              <span key={index} style={styles.newsItem}>{item.title || item.content} &nbsp; • &nbsp;</span>
            ))}
          </div>
        </div>
      )}

      <header style={styles.header}>
        <h1 style={styles.mainTitle}>مدرسة الشروق السودانية المتكاملة</h1>
        <p style={styles.subTitle}>بناء الجيل القادم بالعلم والمعرفة</p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>من نحن</h2>
        <p style={styles.aboutText}>{aboutUs || 'نعمل جاهدين لتوفير بيئة تعليمية مثالية ومتقدمة لأبنائنا الطلاب.'}</p>
        
        {goals.length > 0 && (
          <div style={styles.goalsContainer}>
            <h3 style={styles.subSectionTitle}>أهدافنا</h3>
            <ul style={styles.goalsList}>
              {goals.map((goal, idx) => (
                <li key={idx} style={styles.goalItem}>{goal}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>لوحة الشرف والتميز</h2>
        
        <div style={styles.tabsContainer}>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'primary' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('primary')}
          >
            🎒 المرحلة الابتدائية
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'middle' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('middle')}
          >
            🎖️ المرحلة المتوسطة
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'kindergarten' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('kindergarten')}
          >
            🧸 الروضة والأطفال
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'high' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('high')}
          >
            🎓 المرحلة الثانوية
          </button>
        </div>

        <div style={styles.gridContainer}>
          {getActiveHonorStudents().length > 0 ? (
            getActiveHonorStudents().map((student, idx) => (
              <div key={idx} style={styles.card}>
                {student.image ? (
                  <img src={student.image} alt={student.name} style={styles.cardImage} />
                ) : (
                  <div style={styles.placeholderImage}>طالب متميز</div>
                )}
                <h4 style={styles.personName}>{student.name}</h4>
                <p style={styles.personRole}>{student.stage || 'متفوق دراسياً'}</p>
              </div>
            ))
          ) : (
            <p style={styles.noDataText}>لا توجد بيانات مسجلة في لوحة الشرف لهذه المرحلة حالياً، يمكنك إضافتها من لوحة التحكم.</p>
          )}
        </div>
      </section>

      {teachers.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>الكادر التعليمي</h2>
          <div style={styles.gridContainer}>
            {teachers.map((teacher, idx) => (
              <div key={idx} style={styles.card}>
                {teacher.image && <img src={teacher.image} alt={teacher.name} style={styles.cardImage} />}
                <h4 style={styles.personName}>{teacher.name}</h4>
                <p style={styles.personRole}>{teacher.subject || 'معلم/ة'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {boardMembers.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>إدارة المدرسة</h2>
          <div style={styles.gridContainer}>
            {boardMembers.map((member, idx) => (
              <div key={idx} style={styles.card}>
                {member.image && <img src={member.image} alt={member.name} style={styles.cardImage} />}
                <h4 style={styles.personName}>{member.name}</h4>
                <p style={styles.personRole}>{member.position || 'عضو إداري'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer style={styles.footer}>
        <h3 style={styles.footerTitle}>تواصل معنا</h3>
        <div style={styles.contactsContainer}>
          {contacts.length > 0 ? (
            contacts.map((contact, idx) => (
              <p key={idx} style={styles.contactItem}>{contact.title || 'رقم التواصل'}: {contact.phone || contact.value}</p>
            ))
          ) : (
            <p>يسعدنا اتصالكم واستفساراتكم دائماً.</p>
          )}
        </div>
        <p style={styles.copyright}>جميع الحقوق محفوظة © 2026 - مدرسة الشروق السودانية المتكاملة</p>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: 'Cairo, Tahoma, sans-serif',
    backgroundColor: '#f8f9fa',
    color: '#333',
    minHeight: '100vh',
    direction: 'rtl',
    textAlign: 'right',
  },
  newsTicker: {
    backgroundColor: '#0056b3',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '14px',
  },
  newsLabel: {
    backgroundColor: '#ffc107',
    color: '#000',
    padding: '2px 8px',
    borderRadius: '4px',
    marginLeft: '15px',
    fontWeight: 'bold',
  },
  newsContent: {
    display: 'inline-block',
  },
  newsItem: {
    marginLeft: '20px',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '40px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #dee2e6',
  },
  mainTitle: {
    fontSize: '32px',
    color: '#0056b3',
    marginBottom: '10px',
  },
  subTitle: {
    fontSize: '18px',
    color: '#6c757d',
  },
  section: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#343a40',
    marginBottom: '20px',
    borderRight: '4px solid #0056b3',
    paddingRight: '10px',
  },
  subSectionTitle: {
    fontSize: '20px',
    color: '#495057',
    marginTop: '20px',
    marginBottom: '10px',
  },
  aboutText: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#495057',
  },
  goalsContainer: {
    marginTop: '20px',
  },
  goalsList: {
    paddingRight: '20px',
    lineHeight: '1.8',
  },
  goalItem: {
    marginBottom: '8px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '10px 20px',
    border: '1px solid #0056b3',
    backgroundColor: '#fff',
    color: '#0056b3',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  activeTab: {
    backgroundColor: '#0056b3',
    color: '#fff',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    padding: '15px',
    textAlign: 'center',
    border: '1px solid #e9ecef',
  },
  cardImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
    border: '3px solid #0056b3',
  },
  placeholderImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#e9ecef',
    color: '#6c757d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 15px auto',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  personName: {
    fontSize: '18px',
    color: '#212529',
    marginBottom: '5px',
  },
  personRole: {
    fontSize: '14px',
    color: '#6c757d',
  },
  noDataText: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#6c757d',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px dashed #ced4da',
  },
  footer: {
    backgroundColor: '#343a40',
    color: '#fff',
    padding: '40px 20px',
    textAlign: 'center',
    marginTop: '40px',
  },
  footerTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#ffc107',
  },
  contactsContainer: {
    marginBottom: '20px',
  },
  contactItem: {
    marginBottom: '8px',
  },
  copyright: {
    fontSize: '14px',
    color: '#adb5bd',
    borderTop: '1px solid #495057',
    paddingTop: '20px',
    marginTop: '20px',
  },
};
