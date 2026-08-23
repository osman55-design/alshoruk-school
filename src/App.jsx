import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// استيراد جميع الأقسام المكونة
import DashboardSection from './components/DashboardSection';
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import ResultsSection from './components/ResultsSection';
import TransportSection from './components/TransportSection';
import SupervisorsSection from './components/SupervisorsSection';
import SubjectsSection from './components/SubjectsSection';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('landing');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // التحقق من حالة التسجيل
  useEffect(() => {
    const savedUser = localStorage.getItem('school_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setIsLoggedIn(true);
      setActiveTab(parsed.permissions?.admin ? 'dashboard' : 'students');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: user, error } = await supabase
        .from('users_list')
        .select('*')
        .eq('username', username.trim())
        .single();

      if (user && user.password_code === password.trim()) {
        const permissions = {
          students: user.can_manage_students,
          classes: user.can_manage_classes,
          teachers: user.can_manage_teachers,
          finance: user.can_manage_finance,
          results: user.can_manage_results ?? user.can_see_results,
          transport: user.can_manage_transport,
          supervisors: user.can_manage_supervisors,
          subjects: user.can_manage_subjects,
          admin: user.can_manage_admin
        };

        const userData = {
          id: user.id,
          name: user.full_name,
          role: user.role,
          permissions: permissions
        };

        setCurrentUser(userData);
        localStorage.setItem('school_user', JSON.stringify(userData));
        setIsLoggedIn(true);
        setShowLoginModal(false);

        if (permissions.admin) setActiveTab('dashboard');
        else if (permissions.students) setActiveTab('students');
        else setActiveTab('landing');

      } else {
        alert('اسم المستخدم أو رمز الدخول غير صحيح!');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالنظام!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('school_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('landing');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f766e 100%)', fontFamily: "'Segoe UI', Roboto, sans-serif", direction: 'rtl', color: '#ffffff' }}>
      
      {/* 🟢 الشريط العلوي الزجاجي الفاخر (Modern Glass Navbar) */}
      <header style={{
        background: 'rgba(6, 78, 59, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '14px 4%',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
          <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '3px', borderRadius: '50%', display: 'flex', boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)' }}>
            <img src="logo.png" alt="الشعار" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '19px', fontWeight: '900', letterSpacing: '0.3px', background: 'linear-gradient(90deg, #ffffff, #fef08a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>مدرسة الشروق الخاصة</h1>
            <span style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: '600' }}>منظومة الإدارة الذكية المتكاملة</span>
          </div>
        </div>

        {!isLoggedIn ? (
          <button style={loginBtnStyle} onClick={() => setShowLoginModal(true)}>
            🔐 دخول النظام
          </button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            
            <div style={{ color: '#fef08a', fontWeight: 'bold', fontSize: '12.5px', background: 'rgba(255, 255, 255, 0.08)', padding: '7px 15px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👤</span> {currentUser?.name}
            </div>

            {/* الأزرار العصرية الانسيابية */}
            {currentUser?.permissions?.admin && (
              <NavPill active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="⚙️" label="لوحة الإدارة" />
            )}
            {(currentUser?.permissions?.students || currentUser?.permissions?.admin) && (
              <NavPill active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon="📚" label="الطلاب" />
            )}
            {(currentUser?.permissions?.classes || currentUser?.permissions?.admin) && (
              <NavPill active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} icon="🏛️" label="الفصول" />
            )}
            {(currentUser?.permissions?.teachers || currentUser?.permissions?.admin) && (
              <NavPill active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} icon="👨‍🏫" label="المعلمين" />
            )}
            {(currentUser?.permissions?.subjects || currentUser?.permissions?.admin) && (
              <NavPill active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} icon="📖" label="المواد" />
            )}
            {(currentUser?.permissions?.finance || currentUser?.permissions?.admin) && (
              <NavPill active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} icon="💰" label="الحسابات" />
            )}
            {(currentUser?.permissions?.results || currentUser?.permissions?.admin) && (
              <NavPill active={activeTab === 'results'} onClick={() => setActiveTab('results')} icon="📋" label="النتيجة" />
            )}
            {(currentUser?.permissions?.transport || currentUser?.permissions?.admin) && (
              <NavPill active={activeTab === 'transport'} onClick={() => setActiveTab('transport')} icon="🚌" label="التراحيل" />
            )}
            {(currentUser?.permissions?.supervisors || currentUser?.permissions?.admin) && (
              <NavPill active={activeTab === 'supervisors'} onClick={() => setActiveTab('supervisors')} icon="👩‍💼" label="المشرفات" />
            )}

            <button onClick={handleLogout} style={logoutBtnStyle}>
              🚪 خروج
            </button>
          </div>
        )}
      </header>

      {/* 📄 قسم الصفحة الرئيسية والمحتوى */}
      <main style={{ padding: '30px 4%', maxWidth: '1400px', margin: '0 auto' }}>
        
        {activeTab === 'landing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            
            {/* البانر الترحيبي العصرى */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '45px 30px', borderRadius: '28px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.18)', color: '#fef08a', padding: '6px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'inline-block', marginBottom: '15px' }}>✨ أصالة التعليم ورؤية المستقبل</span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', margin: '10px 0', fontWeight: '900', color: '#ffffff' }}>مرحباً بكم في صرح الشروق التعليمي</h2>
              <p style={{ color: '#a7f3d0', fontSize: '16px', maxWidth: '750px', margin: '0 auto 25px auto', lineHeight: '1.7' }}>منظومة متكاملة تهدف لإدارة شؤون الطلاب، الفصول، الكادر التعليمي، والتراحيل بأعلى معايير الدقة والتقنية الحديثة.</p>
            </div>

            {/* مجلس الإدارة بالتصميم الزجاجي المضيء */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '35px 25px', borderRadius: '28px' }}>
              <h3 style={{ textAlign: 'center', margin: '0 0 30px 0', color: '#fef08a', fontSize: '24px', fontWeight: '900' }}>🏛️ مجلس إدارة المدرسة</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <ManagementCard title="الأستاذ كمال الدين مجذوب الطيب" role="رئيس مجلس الإدارة" img="manager1.png" badge="👑" color="#f59e0b" />
                <ManagementCard title="ماما هند عبد الرازق" role="الأم التربوية الحنون" img="mother.png" badge="❤️" color="#f472b6" />
                <ManagementCard title="الأستاذ محمد كمال الدين مجذوب" role="المدير العام" img="admin_manager.png" badge="⭐" color="#10b981" />
                <ManagementCard title="الأستاذة لينا كمال الدين مجذوب" role="مديرة إدارية" img="admin_manager2.png" badge="💎" color="#8b5cf6" />
              </div>
            </div>

          </div>
        )}

        {/* عرض الأقسام الحالية المفعّلة للمستخدم */}
        {isLoggedIn && activeTab !== 'landing' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.96)', color: '#0f172a', padding: '25px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
            {activeTab === 'dashboard' && <DashboardSection />}
            {activeTab === 'students' && <StudentsSection />}
            {activeTab === 'classes' && <ClassesSection />}
            {activeTab === 'teachers' && <TeachersSection />}
            {activeTab === 'subjects' && <SubjectsSection />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'results' && <ResultsSection />}
            {activeTab === 'transport' && <TransportSection />}
            {activeTab === 'supervisors' && <SupervisorsSection />}
          </div>
        )}
      </main>

      {/* 🔐 نافذة تسجيل الدخول الزجاجية */}
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 44, 34, 0.75)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <form onSubmit={handleLogin} style={{ background: 'rgba(6, 78, 59, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '35px', borderRadius: '24px', width: '330px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', textAlign: 'right' }}>
            <h3 style={{ textAlign: 'center', color: '#fef08a', margin: '0 0 8px 0', fontSize: '22px', fontWeight: '900' }}>تسجيل الدخول</h3>
            <p style={{ textAlign: 'center', color: '#a7f3d0', fontSize: '13px', margin: '0 0 22px 0' }}>منظومة مدرسة الشروق الإلكترونية</p>
            
            <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} style={modalInputStyle} required />
            <input type="password" placeholder="رمز الدخول" value={password} onChange={e => setPassword(e.target.value)} style={modalInputStyle} required />

            <button type="submit" disabled={loading} style={loginBtnSubmitStyle}>
              {loading ? "جاري التحقق..." : "دخول 🔓"}
            </button>
            
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ width: '100%', marginTop: '10px', background: 'transparent', color: '#cbd5e1', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              إلغاء
            </button>
          </form>
        </div>
      )}

      {/* التذييل العصري */}
      <footer style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', color: '#6ee7b7', fontSize: '14px', marginTop: '40px' }}>
        ✨ تنفيذ وإشراف: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>الأستاذ عثمان صديق (أبو حلا)</span> | 📱 01149169346
      </footer>

    </div>
  );
}

// 🎯 مكون الأزرار الانسيابية الحديثة (Pill Nav Component)
function NavPill({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active 
          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
          : 'rgba(255, 255, 255, 0.07)',
        color: active ? '#ffffff' : '#e2e8f0',
        border: active ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.15)',
        padding: '7px 16px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backdropFilter: 'blur(8px)',
        boxShadow: active ? '0 4px 15px rgba(245, 158, 11, 0.35)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// 🏛️ مكون بطاقة مجلس الإدارة الزجاجية
function ManagementCard({ title, role, img, badge, color }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '20px 15px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
    }}>
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <img src={img} alt={role} onError={(e) => { e.target.src = "https://placehold.co/200"; }} style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${color}`, boxShadow: `0 0 15px ${color}50` }} />
        <span style={{ position: 'absolute', bottom: '0', right: '0', background: color, borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: '2px solid #ffffff' }}>{badge}</span>
      </div>
      <span style={{ backgroundColor: `${color}25`, color: color, padding: '3px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', border: `1px solid ${color}40` }}>{role}</span>
      <h4 style={{ margin: 0, color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>{title}</h4>
    </div>
  );
}

// الأنماط الخاصة بالتسجيل والنافذة
const loginBtnStyle = {
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  color: '#ffffff',
  border: 'none',
  padding: '9px 22px',
  borderRadius: '30px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '13.5px',
  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
};

const logoutBtnStyle = {
  background: 'rgba(239, 68, 68, 0.25)',
  color: '#fca5a5',
  border: '1px solid rgba(239, 68, 68, 0.4)',
  padding: '7px 16px',
  borderRadius: '30px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '12.5px',
  backdropFilter: 'blur(8px)'
};

const modalInputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  marginBottom: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  textAlign: 'right'
};

const loginBtnSubmitStyle = {
  width: '100%',
  padding: '12px',
  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '15px',
  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
};
