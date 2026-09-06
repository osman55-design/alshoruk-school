import React from 'react';

export default function LandingPage({ onOpenLogin }) {
  // بيانات مجلس الإدارة
  const boardMembers = [
    { name: 'الأستاذ كمال الدين مجذوب', role: 'رئيس مجلس الإدارة', img: 'https://placehold.co/120' },
    { name: 'ماما هند عبد الرازق', role: 'الأم التربوية', img: 'https://placehold.co/120' },
    { name: 'الأستاذ محمد كمال الدين', role: 'المدير العام', img: 'https://placehold.co/120' },
    { name: 'الأستاذة لينا كمال الدين', role: 'مديرة إدارية', img: 'https://placehold.co/120' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', Roboto, sans-serif", direction: 'rtl', color: '#1e293b' }}>
      
      {/* 1. الهيدر الرئيسي العلوي مع شريط الأخبار المتحرك */}
      <header style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        padding: '12px 3%',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '3px solid #f59e0b'
      }}>
        
        {/* الشعار واسم المدرسة */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
          <img src="logo.png" alt="Logo" onError={(e) => { e.target.src = "https://placehold.co/80"; }} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #f59e0b', backgroundColor: '#fff' }} />
          <div>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: '900' }}>مدرسة الشروق السودانية</h1>
            <span style={{ color: '#fef08a', fontSize: '11px', fontWeight: 'bold' }}>روضة | ابتدائي | متوسط | ثانوي</span>
          </div>
        </div>

        {/* شريط الأخبار المتحرك في المنتصف */}
        <div style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '30px',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(245, 158, 11, 0.4)'
        }}>
          <span style={{ backgroundColor: '#f59e0b', color: '#000', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', whitespace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
            📢 إعلان
          </span>
          <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .ticker-text {
                display: inline-block;
                animation: marquee 18s linear infinite;
                color: '#ffffff';
                font-weight: 600;
                font-size: 13px;
              }
            `}</style>
            <div className="ticker-text" style={{ color: '#ffffff' }}>
              🎉 أهلاً بكم في العام الدراسي الجديد • إعلان نتائج امتحانات الفترة الأولى قريباً • باب التسجيل مفتوح لجميع المراحل التعليمية
            </div>
          </div>
        </div>

        {/* زر دخول النظام */}
        <button 
          onClick={onOpenLogin}
          style={{
            backgroundColor: '#f59e0b',
            color: '#0f172a',
            border: 'none',
            padding: '9px 20px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minWidth: 'fit-content'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🔐 بوابة النظام
        </button>
      </header>

      {/* 2. القسم الترحيبي البارز (Hero Section) */}
      <section style={{
        background: 'linear-gradient(180deg, #047857 0%, #065f46 100%)',
        color: '#fff',
        padding: '60px 20px 80px 20px',
        textAlign: 'center',
        borderBottomRightRadius: '50px',
        borderBottomLeftRadius: '50px',
        boxShadow: '0 10px 30px rgba(4, 120, 87, 0.15)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            مرحباً بكم في صرح الشروق التعليمي 🏫
          </h2>
          <p style={{ fontSize: '16px', color: '#e2e8f0', lineHeight: '1.7', marginBottom: '25px' }}>
            بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز ل أبنائنا الطلاب.
          </p>

          {/* شارات الميزات باللون الأصفر الأخاذ */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fef08a', padding: '6px 16px', borderRadius: '25px', fontSize: '13px', fontWeight: 'bold' }}>
              📚 المنهج السوداني المطور
            </span>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#fff', padding: '6px 16px', borderRadius: '25px', fontSize: '13px', fontWeight: 'bold' }}>
              🎓 كادر تعليمي متميز
            </span>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#fff', padding: '6px 16px', borderRadius: '25px', fontSize: '13px', fontWeight: 'bold' }}>
              ⭐ بيئة تربوية متكاملة
            </span>
          </div>
        </div>
      </section>

      {/* 3. قسم مجلس الإدارة بكروت حديثة */}
      <main style={{ maxWidth: '1200px', margin: '-40px auto 50px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '35px 25px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          border: '1px solid #f1f5f9'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '22px', color: '#0f172a', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              🏛️ مجلس إدارة المدرسة
            </h3>
            <div style={{ width: '60px', height: '4px', backgroundColor: '#f59e0b', margin: '0 auto', borderRadius: '2px' }}></div>
          </div>

          {/* شبكة الكروت الحديثة */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '20px'
          }}>
            {boardMembers.map((member, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '18px',
                  padding: '25px 15px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = '#f59e0b';
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(245, 158, 11, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* لمسة ديكورية صفراء أعلى الكارت */}
                <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '4px', backgroundColor: '#f59e0b' }}></div>

                {/* الصورة مع إطار عصري */}
                <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 15px auto' }}>
                  <img 
                    src={member.img} 
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #047857',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }} 
                  />
                </div>

                {/* الصفة/المسمى الوظيفي */}
                <span style={{
                  backgroundColor: '#ecfdf5',
                  color: '#047857',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid #a7f3d0',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  {member.role}
                </span>

                {/* الاسم */}
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px', fontWeight: '700' }}>
                  {member.name}
                </h4>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* 4. فوتر أنيق ومبسط */}
      <footer style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '12px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
        جميع الحقوق محفوظة لمدرسة الشروق السودانية © {new Date().getFullYear()}
      </footer>

    </div>
  );
}
