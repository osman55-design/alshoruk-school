import React, { useState } from 'react';

export default function LandingPage({ currentUser, onOpenLogin, onOpenAdmin, onLogout }) {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* الهيدر العلوي */}
      <header style={{ padding: '14px 5%', background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)', boxShadow: '0 4px 20px rgba(4, 120, 87, 0.15)', borderBottom: '3px solid #f59e0b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1300px', margin: '0 auto', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* شعار المدرسة والعنوان */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="logo.png" 
              alt="شعار المدرسة" 
              onError={(e) => { e.target.src = "https://placehold.co/100"; }} 
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #f59e0b', objectFit: 'cover' }} 
            />
            <div>
              <h2 style={{ color: '#ffffff', margin: 0, fontSize: '18px', fontWeight: '900' }}>مدرسة الشروق السودانية</h2>
              <span style={{ color: '#fef08a', fontSize: '12px', fontWeight: 'bold' }}>البوابة الإلكترونية الرسمية</span>
            </div>
          </div>

          {/* أزرار التسجيل وبوابة النظام */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!currentUser ? (
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
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}>
                  مرحباً، {currentUser.name || currentUser.username}
                </span>
                <button 
                  onClick={onOpenAdmin}
                  style={{
                    backgroundColor: '#047857',
                    color: '#ffffff',
                    border: '1px solid #10b981',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ لوحة التحكم
                </button>
                <button 
                  onClick={onLogout}
                  style={{
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fee2e2',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  خروج 🚪
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* القسم الرئيسي / البانر الترحيبي */}
      <section style={{ background: 'linear-gradient(180deg, #065f46 0%, #047857 100%)', color: '#ffffff', padding: '40px 5%', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px' }}>أهلاً بكم في مدرسة الشروق السودانية</h1>
          <p style={{ fontSize: '15px', color: '#e2e8f0', lineHeight: '1.6' }}>
            نسعى لتقديم أفضل مستويات التعليم وبناء جيل متفوق. يمكنكم متابعة آخر الأخبار والفعاليات أو تسجيل الدخول لبوابة النظام.
          </p>
        </div>
      </section>

      {/* محتوى الصفحة */}
      <main style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        
        {/* أزرار التنقل بين الأقسام العامة */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '25px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('news')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: activeTab === 'news' ? '#047857' : '#ffffff',
              color: activeTab === 'news' ? '#ffffff' : '#334155',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            📰 آخر الأخبار والإعلانات
          </button>

          <button 
            onClick={() => setActiveTab('about')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: activeTab === 'about' ? '#047857' : '#ffffff',
              color: activeTab === 'about' ? '#ffffff' : '#334155',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            🏫 عن المدرسة
          </button>
        </div>

        {/* عرض المحتوى حسب التبويب */}
        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
          {activeTab === 'news' && (
            <div>
              <h3 style={{ color: '#047857', marginTop: 0 }}>📌 الأخبار والإعلانات الرسمية</h3>
              <div style={{ padding: '15px', borderRight: '4px solid #f59e0b', backgroundColor: '#fffbe8', borderRadius: '6px', marginTop: '15px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#78350f' }}>بداية التسجيل للعام الدراسي الجديد</h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#92400e' }}>تعلن إدارة مدرسة الشروق السودانية عن فتح باب التسجيل والقبول للعام الدراسي الجديد. يُرجى التوجه لمديرية الشؤون للتقديم.</p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div>
              <h3 style={{ color: '#047857', marginTop: 0 }}>🏫 عن مدرسة الشروق السودانية</h3>
              <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '14px' }}>
                صرح تعليمي يهدف إلى تطوير المهارات الأكاديمية والتربوية للطلاب وفق أحدث المناهج والمعايير التعليمية.
              </p>
            </div>
          )}
        </div>

      </main>

      {/* التذييل */}
      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', marginTop: '40px' }}>
        جميع الحقوق محفوظة © مدرسة الشروق السودانية {new Date().getFullYear()}
      </footer>

    </div>
  );
}
