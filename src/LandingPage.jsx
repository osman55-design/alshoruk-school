import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onGoToPortal }) {
  const [news, setNews] = useState([]);
  const [aboutUs, setAboutUs] = useState('');
  const [goals, setGoals] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [supervision, setSupervision] = useState([]);
  const [honorKindergarten, setHonorKindergarten] = useState([]);
  const [honorPrimary, setHonorPrimary] = useState([]);
  const [honorMiddle, setHonorMiddle] = useState([]);
  const [honorHigh, setHonorHigh] = useState([]);
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

      // 6. لوحة الشرف (جلب من جدول top_students وتوزيعها حسب المرحلة)
      try {
        const { data, error } = await supabase.from('top_students').select('*');
        if (data && !error) {
          setHonorKindergarten(data.filter(s => s.stage && s.stage.toLowerCase() === 'kindergarten'));
          setHonorPrimary(data.filter(s => s.stage && s.stage.toLowerCase() === 'primary'));
          setHonorMiddle(data.filter(s => s.stage && s.stage.toLowerCase() === 'middle'));
          setHonorHigh(data.filter(s => s.stage && s.stage.toLowerCase() === 'high'));
        }
      } catch (e) { 
        console.warn("تنبيه: لم يتم جلب لوحة الشرف"); 
      }

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

  return (
    <div style={styles.container}>
      {/* الهيدر العلوي */}
      <header style={styles.header} className="headerResponsive">
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

      {/* الشريط المتحرك للأخبار */}
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
        {/* 1. من نحن وأهدافنا */}
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

        {/* 2. الإدارة */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🏛️ إدارة المدرسة</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {boardMembers.length > 0 ? (
              boardMembers.map((member) => (
                <div key={member.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} style={styles.personImage} />
                    ) : (
                      '👤'
                    )}
                  </div>
                  <h4 style={styles.personName}>{member.name || member.full_name}</h4>
                  <p style={styles.personRole}>{member.role || 'عضو مجلس الإدارة'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>يمكنك إضافة أعضاء الإدارة من لوحة التحكم بعد تسجيل الدخول.</p>
            )}
          </div>
        </section>

        {/* 3. الكادر التعليمي */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>👨‍🏫 الكادر التعليمي</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <div key={teacher.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {teacher.image ? (
                      <img src={teacher.image} alt={teacher.full_name} style={styles.personImage} />
                    ) : (
                      '🎓'
                    )}
                  </div>
                  <h4 style={styles.personName}>{teacher.full_name || teacher.name}</h4>
                  <p style={styles.personRole}>{teacher.subject || 'معلم'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>يمكنك إضافة الكادر التعليمي من لوحة التحكم بعد تسجيل الدخول.</p>
            )}
          </div>
        </section>

        {/* 4. الإشراف */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 قسم الإشراف</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {supervision.length > 0 ? (
              supervision.map((item) => (
                <div key={item.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={styles.personImage} />
                    ) : (
                      '🔍'
                    )}
                  </div>
                  <h4 style={styles.personName}>{item.name || item.full_name}</h4>
                  <p style={styles.personRole}>{item.role || 'مشرف تربوي'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>لا توجد بيانات مضافة لقسم الإشراف حالياً.</p>
            )}
          </div>
        </section>

        {/* 5. لوحة الشرف للروضة */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🧸 لوحة الشرف - الروضة</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {honorKindergarten.length > 0 ? (
              honorKindergarten.map((student) => (
                <div key={student.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {student.image ? (
                      <img src={student.image} alt={student.name} style={styles.personImage} />
                    ) : (
                      '⭐'
                    )}
                  </div>
                  <h4 style={styles.personName}>{student.name}</h4>
                  <p style={styles.personRole}>{student.score ? `الدرجة: ${student.score}` : 'طالب متميز'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>لا توجد أسامي مضافة في لوحة شرف الروضة.</p>
            )}
          </div>
        </section>

        {/* 6. لوحة الشرف المرحلة الابتدائية */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🎒 لوحة الشرف - المرحلة الابتدائية</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {honorPrimary.length > 0 ? (
              honorPrimary.map((student) => (
                <div key={student.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {student.image ? (
                      <img src={student.image} alt={student.name} style={styles.personImage} />
                    ) : (
                      '🏆'
                    )}
                  </div>
                  <h4 style={styles.personName}>{student.name}</h4>
                  <p style={styles.personRole}>{student.score ? `الدرجة: ${student.score}` : 'طالب متفوق'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>لا توجد أسامي مضافة في لوحة شرف الابتدائية.</p>
            )}
          </div>
        </section>

        {/* 7. المرحلة المتوسطة */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🎖️ لوحة الشرف - المرحلة المتوسطة</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {honorMiddle.length > 0 ? (
              honorMiddle.map((student) => (
                <div key={student.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {student.image ? (
                      <img src={student.image} alt={student.name} style={styles.personImage} />
                    ) : (
                      '🏅'
                    )}
                  </div>
                  <h4 style={styles.personName}>{student.name}</h4>
                  <p style={styles.personRole}>{student.score ? `الدرجة: ${student.score}` : 'طالب متفوق'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>لا توجد أسامي مضافة في لوحة شرف المتوسطة.</p>
            )}
          </div>
        </section>

        {/* 8. الثانوية */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🎓 لوحة الشرف - المرحلة الثانوية</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {honorHigh.length > 0 ? (
              honorHigh.map((student) => (
                <div key={student.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {student.image ? (
                      <img src={student.image} alt={student.name} style={styles.personImage} />
                    ) : (
                      '💡'
                    )}
                  </div>
                  <h4 style={styles.personName}>{student.name}</h4>
                  <p style={styles.personRole}>{student.score ? `الدرجة: ${student.score}` : 'طالب متفوق'}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>لا توجد أسامي مضافة في لوحة شرف الثانوية.</p>
            )}
          </div>
        </section>

        {/* 9. قسم الموقع */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🌐 أقسام ومرافق الموقع</h3>
          <div style={styles.gridTwoCols}>
            {siteSections.length > 0 ? (
              siteSections.map((sec) => (
                <div key={sec.id} style={styles.innerCard}>
                  <h4 style={styles.cardTitleGreen}>{sec.title}</h4>
                  <p style={styles.cardText}>{sec.description}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>يمكنك تخصيص وتعديل أقسام الموقع من لوحة التحكم.</p>
            )}
          </div>
        </section>

        {/* 10. أرقام التواصل */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>📞 أرقام التواصل</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div key={contact.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>📱</div>
                  <h4 style={styles.personName}>{contact.title || contact.name}</h4>
                  <p style={styles.personRole}>{contact.phone || contact.number}</p>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>
                المدير / الإدارة: يرجى إضافة أرقام التواصل من إعدادات الموقع.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* التذييل والحقوق */}
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
        
        @media (max-width: 768px) {
          .headerResponsive {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 20px 16px !important;
            gap: 16px !important;
          }
          .headerResponsive > div {
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }
          .headerResponsive h1 {
            white-space: normal !important;
            font-size: 19px !important;
            text-align: center !important;
          }
          .headerResponsive button {
            width: 100% !important;
            max-width: 260px !important;
            padding: 12px !important;
          }
          .horizontalScrollGrid {
            display: flex !important;
            overflow-x: auto !important;
            gap: 12px !important;
            padding-bottom: 12px !important;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .horizontalScrollGrid::-webkit-scrollbar {
            height: 6px;
          }
          .horizontalScrollGrid::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 10px;
          }
          .personCard {
            min-width: 150px !important;
            flex: 0 0 auto !important;
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
    backgroundColor: '#f8fafc',
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
  logoSection: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px',
  },
  logoBox: {
    width: '72px',
    height: '72px',
    backgroundColor: '#f1f5f9',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
    flexShrink: 0,
  },
  logo: { 
    width: '52px', 
    height: '52px', 
    objectFit: 'contain' 
  },
  schoolName: { 
    fontSize: '20px', 
    color: '#0f172a', 
    margin: 0, 
    fontWeight: 'bold',
    lineHeight: '1.4',
  },
  portalBtn: {
    backgroundColor: '#0f766e',
    color: '#ffffff',
    border: 'none',
    padding: '11px 22px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(15, 118, 110, 0.2)',
    transition: 'all 0.2s',
    flexShrink: 0,
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
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px auto',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    fontSize: '22px',
  },
  personImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  personName: { color: '#0f172a', margin: '0 0 4px 0', fontSize: '14.0px', fontWeight: 'bold' },
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
