import React from 'react';

export default function LandingPage({ currentUser, onOpenLogin, onOpenAdmin, onLogout }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', direction: 'rtl' }}>
      
      {/* الشريط العلوي العصري (Navbar) */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 5%',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #047857, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            🏫
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', color: '#047857', fontWeight: '900' }}>مدرسة الشروق السودانية</h1>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>البوابة التعليمية المتكاملة</span>
          </div>
        </div>

        {/* أزرار التحكم والولوج */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <>
              <button 
                onClick={onOpenAdmin}
                style={{
                  background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(4, 120, 87, 0.2)'
                }}
              >
                📊 لوحة التحكم
              </button>
              <button 
                onClick={onLogout}
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fee2e2',
                  padding: '9px 14px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <button 
              onClick={onOpenLogin}
              style={{
                background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '25px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)',
                transition: 'all 0.3s ease'
              }}
            >
              🔑 بوابة النظام
            </button>
          )}
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={{ padding: '24px 3%', flex: '1', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* قسم الترحيب والمقدمة */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '35px 25px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '900', color: '#047857' }}>
              مرحباً بكم في صرح الشروق التعليمي 🎓
            </h2>
            <p style={{ margin: '0 auto 16px auto', fontSize: '15px', color: '#475569', maxWidth: '650px', fontWeight: '600', lineHeight: '1.7' }}>
              بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز بالمنهج السوداني المطور.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #fde68a' }}>✨ توكل • نجاح • تفوق</span>
              <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #a7f3d0' }}>📚 المنهج السوداني المطور</span>
            </div>
          </div>

          {/* بطاقات التعريف والمعلومات */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '22px' }}>📖</span>
                <h4 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '17px' }}>مَن نحن؟</h4>
              </div>
              <p style={{ color: '#334155', lineHeight: '1.7', fontSize: '13.5px', margin: 0, fontWeight: '600' }}>
                مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة عالية عبر جميع المراحل.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '22px' }}>🎯</span>
                <h4 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: '17px' }}>أهدافنا ورسالتنا</h4>
              </div>
              <ul style={{ color: '#334155', lineHeight: '1.7', fontSize: '13px', paddingRight: '18px', margin: 0, fontWeight: '600' }}>
                <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة.</li>
                <li>تعزيز القيم الأخلاقية والوطنية الراسخة في الطلاب.</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '22px' }}>💼</span>
                <h4 style={{ color: '#d97706', margin: 0, fontWeight: '900', fontSize: '17px' }}>الحلول الرقمية الذكية</h4>
              </div>
              <p style={{ color: '#334155', lineHeight: '1.7', fontSize: '13.5px', margin: 0, fontWeight: '600' }}>
                بوابة إلكترونية متقدمة تتضمن لوحة تحكم سحابية مخصصة لإدارة شؤون الطلاب، المعلمين، الحسابات، والنتائج بسهولة وموثوقية.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* التذييل (Footer) */}
      <footer style={{ textAlign: 'center', padding: '18px 12px', marginTop: 'auto', width: '100%', boxSizing: 'border-box', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 24px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#047857', fontSize: '13px', fontWeight: '700' }}>✨ تصميم وتطوير:</span>
          <span style={{ color: '#d97706', fontSize: '13.5px', fontWeight: '900' }}>الأستاذ عثمان صديق ( أبو حلا )</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <a href="tel:01149169346" style={{ color: '#047857', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>📱 01149169346</a>
        </div>
      </footer>

    </div>
  );
}
