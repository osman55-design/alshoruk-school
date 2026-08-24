import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // أعضاء مجلس الإدارة
  const boardMembers = [
    { name: 'أ. عثمان صديق (أبو حلا)', role: 'رئيس مجلس الإدارة والمشرف العام', icon: '👑' },
    { name: 'د. أحمد محمود', role: 'نائب رئيس المجلس', icon: '👨‍💼' },
    { name: 'أ. فاطمة الزهراء', role: 'المستشار التعليمي والتربوي', icon: '👩‍🏫' },
    { name: 'أ. محمد عبد الله', role: 'المدير المالي والتطوير', icon: '💰' }
  ];

  // معرض الصور المحدث
  const galleryImages = [
    { title: 'الطابور الصباحي', category: 'activities', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800' },
    { title: 'معمل العلوم الحديث', category: 'facilities', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800' },
    { title: 'المكتبة المدرسية', category: 'facilities', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
    { title: 'تكريم الطلاب المتفوقين', category: 'events', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800' },
    { title: 'الأنشطة الرياضية', category: 'activities', url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800' },
    { title: 'حافلات التراحيل المدرسية', category: 'facilities', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  useEffect(() => {
    const savedUser = localStorage.getItem('school_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { name: username || 'المسؤول', role: 'admin' };
    setCurrentUser(userData);
    localStorage.setItem('school_user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('school_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // 1️⃣ الواجهة الرئيسية الخارجية للزوار (تتضمن مجلس الإدارة والمعرض والتعديلات)
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f766e 100%)', fontFamily: "'Segoe UI', Roboto, sans-serif", direction: 'rtl', color: '#ffffff' }}>
        
        {/* الشريط العلوي الزجاجي */}
        <header style={{ background: 'rgba(6, 78, 59, 0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', padding: '16px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🏫</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#fef08a' }}>مدرسة الشروق الخاصة</h1>
              <span style={{ fontSize: '12px', color: '#6ee7b7' }}>منظومة التميز والتعليم الذكي</span>
            </div>
          </div>
          <button onClick={() => setShowLoginModal(true)} style={loginBtnStyle}>
            🔐 دخول النظام
          </button>
        </header>

        {/* محتوى الصفحة الرئيسية */}
        <main style={{ padding: '40px 5%', maxWidth: '1300px', margin: '0 auto' }}>
          
          {/* قسم الترحيب الرئيسي */}
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '50px 30px', borderRadius: '32px', textAlign: 'center', marginBottom: '50px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '36px', color: '#ffffff', marginBottom: '15px' }}>أهلاً بكم في البوابة الرسمية لمدرسة الشروق الخاصة</h2>
            <p style={{ fontSize: '18px', color: '#a7f3d0', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: '1.7' }}>
              نقدم بيئة تعليمية وتربوية متكاملة تعتمد على التقنيات الحديثة لبناء جيل متميز ومبدع.
            </p>
            <button onClick={() => setShowLoginModal(true)} style={{ ...loginBtnStyle, padding: '14px 40px', fontSize: '18px' }}>
              تسجيل الدخول للنظام الإداري 🚀
            </button>
          </div>

          {/* 👥 قسم مجلس الإدارة */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '28px', color: '#fef08a', margin: '0 0 10px 0' }}>🏛️ مجلس الإدارة</h3>
              <p style={{ color: '#6ee7b7', margin: 0 }}>القيادة والتربوية المشرفة على تطوير واستقرار المدرسة</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {boardMembers.map((member, index) => (
                <div key={index} style={{ background: 'rgba(255, 255, 255, 0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px', padding: '25px 20px', textAlign: 'center', transition: 'transform 0.3s' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{member.icon}</div>
                  <h4 style={{ margin: '5px 0', fontSize: '18px', color: '#ffffff' }}>{member.name}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#f59e0b', fontWeight: 'bold' }}>{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 🖼️ قسم معرض الصور والتعديلات */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '28px', color: '#fef08a', margin: '0 0 10px 0' }}>📸 معرض الصور المدرسية</h3>
              <p style={{ color: '#6ee7b7', margin: '0 0 20px 0' }}>جولة مصورة داخل مرافق وأنشطة مدرسة الشروق</p>
              
              {/* أزرار تصفية التصنيفات */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => setSelectedCategory('all')} style={categoryBtnStyle(selectedCategory === 'all')}>الكل</button>
                <button onClick={() => setSelectedCategory('facilities')} style={categoryBtnStyle(selectedCategory === 'facilities')}>المرافق والمباني</button>
                <button onClick={() => setSelectedCategory('activities')} style={categoryBtnStyle(selectedCategory === 'activities')}>الأنشطة المدرسية</button>
                <button onClick={() => setSelectedCategory('events')} style={categoryBtnStyle(selectedCategory === 'events')}>الفعاليات والتكريم</button>
              </div>
            </div>

            {/* شبكة عرض الصور */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
              {filteredImages.map((img, idx) => (
                <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                  <img src={img.url} alt={img.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '15px', textAlign: 'center', background: 'rgba(6, 78, 59, 0.8)' }}>
                    <h5 style={{ margin: 0, fontSize: '16px', color: '#ffffff' }}>{img.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* نافذة تسجيل الدخول Modal */}
        {showLoginModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 44, 34, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
            <form onSubmit={handleLogin} style={{ background: 'rgba(6, 78, 59, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '35px', borderRadius: '24px', width: '320px', textAlign: 'right' }}>
              <h3 style={{ color: '#fef08a', margin: '0 0 20px 0', textAlign: 'center', fontSize: '20px' }}>تسجيل الدخول للنظام</h3>
              <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} style={modalInputStyle} required />
              <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={modalInputStyle} required />
              <button type="submit" style={loginBtnSubmitStyle}>دخول 🔓</button>
              <button type="button" onClick={() => setShowLoginModal(false)} style={{ width: '100%', marginTop: '12px', background: 'transparent', color: '#cbd5e1', border: 'none', cursor: 'pointer' }}>إلغاء</button>
            </form>
          </div>
        )}

        <footer style={{ textAlign: 'center', padding: '25px', color: '#6ee7b7', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          ✨ تنفيذ وإشراف: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>الأستاذ عثمان صديق (أبو حلا)</span>
        </footer>
      </div>
    );
  }

  // 2️⃣ لوحة التحكم الشاملة (تظهر فقط بعد الدخول)
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f766e 100%)', fontFamily: "'Segoe UI', Roboto, sans-serif", direction: 'rtl', color: '#ffffff' }}>
      
      <header style={{ background: 'rgba(6, 78, 59, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', padding: '14px 4%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>🏫</span>
          <h1 style={{ margin: 0, fontSize: '18px', color: '#fef08a' }}>لوحة التحكم والإدارة</h1>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <NavPill active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="⚙️" label="الرئيسية" />
          <NavPill active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon="📚" label="الطلاب" />
          <NavPill active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} icon="🏛️" label="الفصول" />
          <NavPill active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} icon="👨‍🏫" label="المعلمين" />
          <NavPill active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} icon="📖" label="المواد" />
          <NavPill active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} icon="💰" label="الحسابات" />
          <NavPill active={activeTab === 'results'} onClick={() => setActiveTab('results')} icon="📋" label="النتيجة" />
          <NavPill active={activeTab === 'transport'} onClick={() => setActiveTab('transport')} icon="🚌" label="التراحيل" />
          <NavPill active={activeTab === 'supervisors'} onClick={() => setActiveTab('supervisors')} icon="👩‍💼" label="المشرفات" />

          <button onClick={handleLogout} style={logoutBtnStyle}>
            🚪 خروج
          </button>
        </div>
      </header>

      <main style={{ padding: '25px 4%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.96)', color: '#0f172a', padding: '30px', borderRadius: '24px', minHeight: '450px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
          <h2 style={{ color: '#047857', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginTop: 0 }}>
            قسم: {getTabTitle(activeTab)}
          </h2>
          <p style={{ color: '#475569', fontSize: '16px' }}>
            أهلاً بك يا <strong>{currentUser?.name}</strong>. جميع صلاحيات قسم ({getTabTitle(activeTab)}) متاحة للعمل والتعديل.
          </p>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#6ee7b7', fontSize: '14px' }}>
        ✨ تنفيذ وإشراف: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>الأستاذ عثمان صديق (أبو حلا)</span>
      </footer>
    </div>
  );
}

function getTabTitle(tab) {
  const titles = {
    dashboard: 'لوحة الإدارة العامة',
    students: 'إدارة الطلاب والشؤون',
    classes: 'إدارة الفصول والأقسام',
    teachers: 'الكادر التعليمي والمعلمين',
    subjects: 'المقررات والمواد الدراسية',
    accounts: 'الحسابات والرسوم الدراسية',
    results: 'النتائج والشهادات',
    transport: 'منظومة التراحيل والمواصلات',
    supervisors: 'مشرفات الحافلات والأدوار'
  };
  return titles[tab] || tab;
}

function NavPill({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.08)',
        color: active ? '#ffffff' : '#e2e8f0',
        border: active ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.15)',
        padding: '7px 15px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const loginBtnStyle = { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' };
const logoutBtnStyle = { background: 'rgba(239, 68, 68, 0.25)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '7px 16px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' };
const categoryBtnStyle = (active) => ({
  background: active ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
  padding: '8px 18px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600'
});
const modalInputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box', textAlign: 'right' };
const loginBtnSubmitStyle = { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
