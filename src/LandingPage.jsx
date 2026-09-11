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
      try { const { data } = await supabase.from('news').select('*'); if (data) setNews(data); } catch (e) {}
      try { 
        const { data } = await supabase.from('settings').select('*').maybeSingle(); 
        if (data) {
          if (data.about_us) setAboutUs(data.about_us);
          if (data.goals) setGoals(Array.isArray(data.goals) ? data.goals : JSON.parse(data.goals));
        }
      } catch (e) {}
      try { const { data } = await supabase.from('board_members').select('*'); if (data) setBoardMembers(data); } catch (e) {}
      try { const { data } = await supabase.from('teachers').select('*'); if (data) setTeachers(data); } catch (e) {}
      try { const { data } = await supabase.from('supervision').select('*'); if (data) setSupervision(data); } catch (e) {}
      
      try {
        const { data, error } = await supabase.from('top_students').select('*');
        if (data && !error) {
          setHonorKindergarten(data.filter(s => s.stage && s.stage.toLowerCase() === 'kindergarten'));
          setHonorPrimary(data.filter(s => s.stage && s.stage.toLowerCase() === 'primary'));
          setHonorMiddle(data.filter(s => s.stage && s.stage.toLowerCase() === 'middle'));
          setHonorHigh(data.filter(s => s.stage && s.stage.toLowerCase() === 'high'));
        }
      } catch (e) {}

      try { const { data } = await supabase.from('site_sections').select('*'); if (data) setSiteSections(data); } catch (e) {}
      try { const { data } = await supabase.from('contacts').select('*'); if (data) setContacts(data); } catch (e) {}
    };

    fetchAllData();
  }, []);

  const isValidImageUrl = (url) => {
    return url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header} className="headerResponsive">
        <div style={styles.logoSection}>
          <div style={styles.logoBox}>
            <img src="/logo.png" alt="شعار المدرسة" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
          </div>
          <h1 style={styles.schoolName}>مدرسة الشروق السودانية المتكاملة</h1>
        </div>
        <button type="button" onClick={onGoToPortal} style={styles.portalBtn}>🔑 دخول البوابة</button>
      </header>

      <div style={styles.tickerContainer}>
        <span style={styles.tickerBadge}>📢 آخر الأخبار:</span>
        <div style={styles.tickerWrapper}>
          <div className="ticker-move" style={styles.tickerContent}>
            {news.length > 0 ? news.map((item) => ` 🔹 ${item.title}: ${item.content || ''} `).join(' | ') : 'مرحباً بكم في الموقع الرسمي لمدرسة الشروق السودانية المتكاملة.'}
          </div>
        </div>
      </div>

      <main style={styles.mainContent}>
        <section style={styles.glassSection}>
          <div style={styles.gridTwoCols}>
            <div style={styles.innerCard}>
              <div style={styles.cardAccentGold}></div>
              <h3 style={styles.cardTitle}>📖 من نحن؟</h3>
              <p style={styles.cardText}>{aboutUs || 'مدرسة الشروق السودانية المتكاملة صرح تعليمي متميز.'}</p>
            </div>
            <div style={styles.innerCard}>
              <div style={styles.cardAccentGreen}></div>
              <h3 style={styles.cardTitleGreen}>🎯 أهدافنا</h3>
              <ul style={styles.list}>
                {goals.length > 0 ? goals.map((goal, i) => <li key={i}>{goal}</li>) : <li>تقديم تعليم متطور يواكب المعايير الحديثة.</li>}
              </ul>
            </div>
          </div>
        </section>

        {/* المرحلة الابتدائية */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🎒 لوحة الشرف - المرحلة الابتدائية</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {honorPrimary.length > 0 ? (
              honorPrimary.map((student) => (
                <div key={student.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {isValidImageUrl(student.image) ? (
                      <img 
                        src={student.image} 
                        alt={student.name} 
                        style={styles.personImage} 
                        onError={(e) => {
                          // إذا فشل تحميل رابط فيسبوك، يتم إخفاء الصورة تماماً وإظهار الأيقونة
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span style={{ position: 'absolute', zIndex: 0 }}>🏆</span>
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

        {/* المرحلة المتوسطة */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🎖️ لوحة الشرف - المرحلة المتوسطة</h3>
          <div className="horizontalScrollGrid" style={styles.cardGrid}>
            {honorMiddle.length > 0 ? (
              honorMiddle.map((student) => (
                <div key={student.id} style={styles.personCard} className="personCard">
                  <div style={styles.avatarContainer}>
                    {isValidImageUrl(student.image) ? (
                      <img 
                        src={student.image} 
                        alt={student.name} 
                        style={styles.personImage} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : null}
                    <span style={{ position: 'absolute', zIndex: 0 }}>🏅</span>
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
      </main>

      <footer style={styles.footer}>
        <p>© 2026 مدرسة الشروق السودانية المتكاملة - جميع الحقوق محفوظة</p>
      </footer>

      <style>{`
        @keyframes scrollLeftToRight { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .ticker-move { display: inline-block; white-space: nowrap; animation: scrollLeftToRight 30s linear infinite; }
        @media (max-width: 768px) {
          .horizontalScrollGrid { display: flex !important; overflow-x: auto !important; gap: 12px !important; padding-bottom: 12px !important; }
          .personCard { min-width: 150px !important; flex: 0 0 auto !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', direction: 'rtl', fontFamily: "'Cairo', sans-serif", display: 'flex', flexDirection: 'column' },
  header: { backgroundColor: '#ffffff', padding: '16px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 },
  logoSection: { display: 'flex', alignItems: 'center', gap: '16px' },
  logoBox: { width: '72px', height: '72px', backgroundColor: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' },
  logo: { width: '52px', height: '52px', objectFit: 'contain' },
  schoolName: { fontSize: '20px', color: '#0f172a', margin: 0, fontWeight: 'bold' },
  portalBtn: { backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '11px 22px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  tickerContainer: { backgroundColor: '#f1f5f9', color: '#334155', display: 'flex', alignItems: 'center', padding: '10px 25px', fontSize: '13px', overflow: 'hidden', borderBottom: '1px solid #e2e8f0' },
  tickerBadge: { backgroundColor: '#0f766e', color: '#ffffff', padding: '3px 10px', borderRadius: '6px', fontWeight: 'bold', marginLeft: '15px', whiteSpace: 'nowrap', zIndex: 2 },
  tickerWrapper: { overflow: 'hidden', width: '100%', direction: 'ltr' },
  tickerContent: { whiteSpace: 'nowrap' },
  mainContent: { flex: 1, padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },
  glassSection: { backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '35px' },
  gridTwoCols: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  innerCard: { backgroundColor: '#f8fafc', padding: '22px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' },
  cardAccentGold: { position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', backgroundColor: '#d97706' },
  cardAccentGreen: { position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', backgroundColor: '#0f766e' },
  cardTitle: { color: '#b45309', margin: '0 0 12px 0', fontSize: '17px', fontWeight: 'bold' },
  cardTitleGreen: { color: '#0f766e', margin: '0 0 12px 0', fontSize: '17px', fontWeight: 'bold' },
  cardText: { color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: 0 },
  list: { color: '#475569', fontSize: '14px', lineHeight: '1.7', paddingRight: '18px', margin: 0 },
  section: { marginBottom: '35px' },
  sectionTitle: { color: '#0f172a', fontSize: '18px', marginBottom: '16px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' },
  personCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0' },
  avatarContainer: { width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', border: '2px solid #e2e8f0', overflow: 'hidden', position: 'relative', fontSize: '22px' },
  personImage: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 },
  personName: { color: '#0f172a', margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' },
  personRole: { color: '#0f766e', fontSize: '12px', margin: 0, fontWeight: '600' },
  emptyText: { color: '#94a3b8', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '20px' },
  footer: { backgroundColor: '#ffffff', color: '#64748b', textAlign: 'center', padding: '22px', fontSize: '13px', marginTop: 'auto', borderTop: '1px solid #e2e8f0' },
};
