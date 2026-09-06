import React from 'react';

export default function LandingPage({ onOpenLogin }) {
  const boardMembers = [
    { name: 'الأستاذ كمال الدين مجذوب', role: 'رئيس مجلس الإدارة', img: 'https://placehold.co/120' },
    { name: 'ماما هند عبد الرازق', role: 'الأم التربوية', img: 'https://placehold.co/120' },
    { name: 'الأستاذ محمد كمال الدين', role: 'المدير العام', img: 'https://placehold.co/120' },
    { name: 'الأستاذة لينا كمال الدين', role: 'مديرة إدارية', img: 'https://placehold.co/120' },
  ];

  const topStudents = [
    { name: 'أحمد محمد علي', grade: 'الصف الثالث ثانوي', score: '98.5%', img: 'https://placehold.co/100' },
    { name: 'حلا عثمان أحمد', grade: 'الصف الثامن أساس', score: '97.8%', img: 'https://placehold.co/100' },
    { name: 'عالم عثمان', grade: 'الصف السادس', score: '96.5%', img: 'https://placehold.co/100' },
  ];

  const featuredTeachers = [
    { name: 'أ. عبد الله المصطفى', subject: 'الرياضيات المتقدمة', img: 'https://placehold.co/100' },
    { name: 'أ. فاطمة عمر', subject: 'العلوم والفيزياء', img: 'https://placehold.co/100' },
    { name: 'أ. خالد إبراهيم', subject: 'اللغة العربية والآداب', img: 'https://placehold.co/100' },
  ];

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.25s ease'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Segoe UI', Roboto, sans-serif", direction: 'rtl', color: '#0f172a' }}>
      
      {/* 1. الهيدر المدمج العصري */}
      <header style={{
        background: '#047857',
        padding: '10px 3%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '3px solid #f59e0b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '210px' }}>
          <img src="logo.png" alt="Logo" onError={(e) => { e.target.src = "https://placehold.co/80"; }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #f59e0b', backgroundColor: '#fff' }} />
          <div>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '900' }}>مدرسة الشروق السودانية</h1>
            <span style={{ color: '#fef08a', fontSize: '10.5px', fontWeight: 'bold' }}>روضة | ابتدائي | متوسط | ثانوي</span>
          </div>
        </div>

        {/* شريط الإعلان المشرق */}
        <div style={{
          flex: 1,
          backgroundColor: '#fffbeb',
          borderRadius: '30px',
          padding: '4px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflow: 'hidden',
          border: '1.5px solid #f59e0b'
        }}>
          <span style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            📢 إعلان
          </span>
          <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <style>{`
              @keyframes marquee { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
              .ticker-text { display: inline-block; animation: marquee 16s linear infinite; color: #78350f; font-weight: 700; font-size: 12.5px; }
            `}</style>
            <div className="ticker-text">
              🎉 أهلاً بكم في العام الدراسي الجديد • إعلان نتائج امتحانات الفترة الأولى قريباً • فتح باب التسجيل لجميع المراحل التعليمية
            </div>
          </div>
        </div>

        {/* زر الفتح المباشر كما في السابق */}
        <button 
          onClick={onOpenLogin}
          style={{
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '12.5px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
            whiteSpace: 'nowrap'
          }}
        >
          🔐 بوابة النظام
        </button>
      </header>

      {/* 2. القسم الترحيبي */}
      <section style={{
        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        color: '#fff',
        padding: '22px 20px 25px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 6px 0' }}>
            مرحباً بكم في صرح الشروق التعليمي 🏫
          </h2>
          <p style={{ fontSize: '13.5px', color: '#e2e8f0', margin: '0 0 12px 0' }}>
            بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: '#f59e0b', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 'bold' }}>📚 المنهج السوداني المطور</span>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 'bold' }}>🎓 كادر تعليمي متميز</span>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 'bold' }}>⭐ بيئة تربوية متكاملة</span>
          </div>
        </div>
      </section>

      {/* 3. المحتوى الرئيسي */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* كلمة المدير العام + من نحن */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          
          <div style={{ ...cardStyle, borderTop: '4px solid #f59e0b' }}>
            <h3 style={{ fontSize: '16px', color: '#047857', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎙️ كلمة المدير العام
            </h3>
            <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
              "أهلاً بكم في مدرسة الشروق. يسعدنا أن نكون الشعلة التي تُضيء طريق أبنائنا وبناتنا نحو مستقبل أكاديمي وتربوي مشرّف بالقيم والمناهج الحديثة."
            </p>
            <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '12px', color: '#0f172a' }}>— الأستاذ محمد كمال الدين</div>
          </div>

          <div style={{ ...cardStyle, borderTop: '4px solid #047857' }}>
            <h3 style={{ fontSize: '16px', color: '#047857', fontWeight: '800', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📖 من نحن وأهدافنا
            </h3>
            <ul style={{ margin: 0, paddingRight: '16px', color: '#334155', fontSize: '12.5px', lineHeight: '1.7' }}>
              <li>تطبيق المنهج السوداني المعتمد بأحدث الأساليب الرقمية.</li>
              <li>توفير بيئة آمنة ومشجعة للابتكار والتفوق الأكاديمي.</li>
              <li>تنمية المهارات التربوية والأنشطة الطلابية المختلفة.</li>
            </ul>
          </div>

        </div>

        {/* مجلس الإدارة */}
        <section style={cardStyle}>
          <div style={{ textAlignment: 'right', marginBottom: '15px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
            <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: '800', margin: 0 }}>🏛️ مجلس إدارة المدرسة</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {boardMembers.map((member, i) => (
              <div key={i} style={{ backgroundColor: '#f8fafc', padding: '15px 10px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #f59e0b' }}>
                <img src={member.img} alt={member.name} style={{ width: '65px', height: '65px', borderRadius: '50%', border: '2px solid #047857', marginBottom: '8px' }} />
                <br />
                <span style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'inline-block', marginBottom: '4px' }}>{member.role}</span>
                <h4 style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{member.name}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* الطلاب المتفوقون الأوائل */}
        <section style={cardStyle}>
          <div style={{ textAlignment: 'right', marginBottom: '15px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
            <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: '800', margin: 0 }}>🏆 الطلاب المتفوقون الأوائل</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {topStudents.map((std, i) => (
              <div key={i} style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '15px', borderRadius: '12px', textAlign: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#f59e0b', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '8px' }}>🌟 {std.score}</span>
                <img src={std.img} alt={std.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #f59e0b', marginBottom: '6px' }} />
                <h4 style={{ margin: '0 0 2px 0', fontSize: '13.5px', color: '#1e293b' }}>{std.name}</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>{std.grade}</p>
              </div>
            ))}
          </div>
        </section>

        {/* هيئة التدريس */}
        <section style={cardStyle}>
          <div style={{ textAlignment: 'right', marginBottom: '15px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
            <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: '800', margin: 0 }}>👨‍🏫 هيئة التدريس المتميزة</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {featuredTeachers.map((teacher, i) => (
              <div key={i} style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <img src={teacher.img} alt={teacher.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #047857', marginBottom: '6px' }} />
                <h4 style={{ margin: '0 0 2px 0', fontSize: '13.5px', color: '#1e293b' }}>{teacher.name}</h4>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#047857', fontWeight: 'bold' }}>{teacher.subject}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* الفوتر */}
      <footer style={{ textAlign: 'center', padding: '15px', color: '#64748b', fontSize: '11.5px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
        جميع الحقوق محفوظة لمدرسة الشروق السودانية © {new Date().getFullYear()}
      </footer>

    </div>
  );
}
