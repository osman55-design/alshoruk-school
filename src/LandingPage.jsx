import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onGoToPortal }) {
  const [news, setNews] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب الأخبار بأمان دون إيقاف التطبيق عند حدوث 404
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!newsError && newsData) {
          setNews(newsData);
        }

        // جلب الإعدادات بأمان
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .maybeSingle();

        if (!settingsError && settingsData) {
          setSettings(settingsData);
        }
      } catch (err) {
        console.warn('تنبيه: تعذر جلب بعض البيانات، سيستمر الموقع بالعمل بشكل طبيعي:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      {/* الشريط العلوي */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <img
            src={settings?.logo_url || '/logo.png'}
            alt="شعار المدرسة"
            style={styles.logo}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 style={styles.schoolName}>
            {settings?.school_name || 'مدرسة الشروق السودانية المتكاملة'}
          </h1>
        </div>
        <button 
          type="button" 
          onClick={onGoToPortal} 
          style={styles.portalBtn}
        >
          🔑 دخول البوابة
        </button>
      </header>

      {/* قسم الترحيب الرئيسي */}
      <main style={styles.main}>
        <section style={styles.heroSection}>
          <h2 style={styles.heroTitle}>مرحباً بكم في بوابة مدرسة الشروق الإلكترونية</h2>
          <p style={styles.heroSub}>
            رائدون في تقديم المنهج السوداني بكفاءة عالية ورعاية تعليمية متكاملة لجميع المراحل.
          </p>
          <button 
            type="button" 
            onClick={onGoToPortal} 
            style={styles.heroBtn}
          >
            الانتقال للنظام الإداري ⬅️
          </button>
        </section>

        {/* قسم الأخبار والإعلانات */}
        <section style={styles.newsSection}>
          <h3 style={styles.sectionTitle}>📢 آخر الأخبار والإعلانات</h3>
          {news.length > 0 ? (
            <div style={styles.newsGrid}>
              {news.map((item) => (
                <div key={item.id} style={styles.newsCard}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} style={styles.newsImg} />
                  )}
                  <h4 style={styles.newsTitle}>{item.title}</h4>
                  <p style={styles.newsContent}>{item.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noNews}>لا توجد أخبار حديثة حالياً.</p>
          )}
        </section>
      </main>

      {/* التذييل */}
      <footer style={styles.footer}>
        <p>© 2026 مدرسة الشروق السودانية - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
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
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    width: '45px',
    height: '45px',
    objectFit: 'contain',
  },
  schoolName: {
    fontSize: '18px',
    color: '#047857',
    margin: 0,
    fontWeight: 'bold',
  },
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
  main: {
    flex: 1,
    padding: '40px 20px',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  heroSection: {
    textAlign: 'center',
    backgroundColor: '#ffffff',
    padding: '40px 20px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    marginBottom: '40px',
    borderTop: '5px solid #047857',
  },
  heroTitle: {
    color: '#1e293b',
    fontSize: '24px',
    marginBottom: '10px',
  },
  heroSub: {
    color: '#64748b',
    fontSize: '15px',
    marginBottom: '25px',
  },
  heroBtn: {
    backgroundColor: '#0d9488',
    color: '#ffffff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  newsSection: {
    marginTop: '20px',
  },
  sectionTitle: {
    color: '#047857',
    fontSize: '20px',
    marginBottom: '20px',
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  newsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  newsImg: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  newsTitle: {
    color: '#1e293b',
    margin: '0 0 8px 0',
    fontSize: '16px',
  },
  newsContent: {
    color: '#64748b',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0,
  },
  noNews: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  footer: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '20px',
    fontSize: '13px',
    marginTop: 'auto',
  },
};
