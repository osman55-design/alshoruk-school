import React, { useState } from 'react';

export default function LandingPage({ onOpenLogin, schoolLogo }) {
  const [isPaused, setIsPaused] = useState(false);

  // أخبار تجريبية للشريط
  const newsList = [
    "مرحباً بكم في مدرسة الشروق السودانية بأسوان - بداية العام الدراسي الجديد",
    "تنبيه: فتح باب التسجيل لاختبارات الشهادتين الابتدائية والمتوسطة",
    "تهنئة خاصة لطلابنا المتفوقين في الأنشطة الثقافية والرياضية"
  ];

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl', textAlign: 'right', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 1. الهيدر والشعار واسم المدرسة */}
      <header style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: '#fff', padding: '20px 40px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* الشعار من داخل البرنامج أو شعار افتراضي محمل */}
            {schoolLogo ? (
              <img src={schoolLogo} alt="شعار المدرسة" style={{ width: '65px', height: '65px', objectFit: 'contain', borderRadius: '50%', background: '#fff', padding: '3px' }} />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold' }}>
                ☀️
              </div>
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#fbbf24' }}>مدرسة الشروق السودانية بأسوان</h1>
              <span style={{ fontSize: '13px', opacity: 0.9 }}>العلم والتربية لبناء المستقبل</span>
            </div>
          </div>

          {/* زر بوابة الدخول لتشغيل النظام القديم الشغال بدون تعديل */}
          <button 
            onClick={onOpenLogin}
            style={{
              background: '#d97706',
              color: '#fff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            🔐 بوابة الدخول
          </button>
        </div>
      </header>

      {/* 2. شريط متحرك بآخر الأخبار (يتحرك ويتوقف عند مرور الماوس) */}
      <div style={{ background: '#1e293b', color: '#fbbf24', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderBottom: '3px solid #d97706' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <span style={{ background: '#d97706', color: '#fff', padding: '3px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', marginLeft: '15px', zIndex: 2 }}>
            📢آخر الأخبار:
          </span>
          <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              animation: isPaused ? 'none' : 'marquee 25s linear infinite',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {newsList.map((item, idx) => (
              <span key={idx} style={{ marginLeft: '40px' }}>🔹 {item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. الأقسام الرئيسية (من نحن ومجلس الإدارة) */}
      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* قسم من نحن */}
        <section style={{ background: '#fff', borderRadius: '12px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRight: '5px solid #065f46' }}>
          <h2 style={{ color: '#065f46', marginTop: 0, fontSize: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            📖 من نحن
          </h2>
          <p style={{ lineHeight: '1.8', color: '#475569', fontSize: '15px' }}>
            مدرسة الشروق السودانية بأسوان هي صرح تعليمي تربوي يهدف إلى تقديم أفضل المناهج والخبرات التعليمية للطلاب السودانيين بأسوان. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً ضمن بيئة تعليمية متكاملة ومشجعة على الإبداع والنجاح.
          </p>
        </section>

        {/* قسم أعضاء مجلس الإدارة */}
        <section style={{ background: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRight: '5px solid #d97706' }}>
          <h2 style={{ color: '#065f46', marginTop: 0, fontSize: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            👥 أعضاء مجلس الإدارة
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
            
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '30px', marginBottom: '8px' }}>👨‍💼</div>
              <h4 style={{ margin: '5px 0', color: '#1e293b' }}>إدارة المدرسة</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>رئاسة مجلس الإدارة والتربية</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '30px', marginBottom: '8px' }}>👨‍🏫</div>
              <h4 style={{ margin: '5px 0', color: '#1e293b' }}>الشؤون الأكاديمية</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>الإشراف والتحصيل العلمي</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '30px', marginBottom: '8px' }}>📋</div>
              <h4 style={{ margin: '5px 0', color: '#1e293b' }}>الشؤون الإدارية</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>التنظيم والخدمات الطلابية</p>
            </div>

          </div>
        </section>

      </main>

      {/* تنسيقات حركة شريط الأخبار */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
