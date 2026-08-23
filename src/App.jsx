import React, { useState, useEffect } from 'react';
import './App.css';

// استدعاء ملف الربط مع قاعدة البيانات سوبابيز
import { supabase } from './supabaseClient';

// استيراد الأقسام والشاشات
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';
import ResultsSection from './components/ResultsSection';
import TransportsSection from './components/TransportsSection'; // <-- إضافة استيراد التراحيل

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('landing'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // دالة تسجيل الدخول مع الحماية والتوجيه التلقائي للموظف حسب صلاحياته
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
          transports: user.can_manage_transports ?? true, // <-- صلاحية التراحيل والمشرفين
          admin: user.can_manage_admin
        };

        setCurrentUser({
          id: user.id,
          name: user.full_name,
          role: user.role,
          permissions: permissions
        });
        
        setIsLoggedIn(true);
        setShowLoginModal(false);

        // توجيه المستخدم تلقائياً للقسم المناسب فور تسجيل الدخول
        if (permissions.admin) {
          setActiveTab('dashboard');
        } else if (permissions.students) {
          setActiveTab('students'); 
        } else if (permissions.classes) {
          setActiveTab('classes');
        } else if (permissions.teachers) {
          setActiveTab('teachers');
        } else if (permissions.finance) {
          setActiveTab('accounts');
        } else if (permissions.results) {
          setActiveTab('results'); 
        } else if (permissions.transports) {
          setActiveTab('transports'); 
        } else {
          setActiveTab('landing');
        }

      } else {
        alert('اسم المستخدم أو رمز الدخول غير صحيح!');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالنظام، يرجى المحاولة لاحقاً!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setActiveTab('landing'); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* الشريط العلوي العصري */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '16px 5%', background: 'linear-gradient(135deg, #047857 0%, #0d9488 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(4,120,87,0.15)', borderBottom: '4px solid #f59e0b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="logo.png" alt="الشعار" onError={(e) => { e.target.src = "https://placehold.co/100x100?text=الشروق"; }} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', objectFit: 'cover' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '20px', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>مدرسة الشروق السودانية</span>
            <span style={{ color: '#fef08a', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>روضة  •  ابتدائي  •  متوسط  •  ثانوي</span>
          </div>
        </div>
        
        {!isLoggedIn ? (
          <button style={{ padding: '10px 24px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#f59e0b', color: '#ffffff', fontSize: '14px', boxShadow: '0 4px 15px rgba(245,158,11,0.4)', transition: 'transform 0.2s' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#ffffff', fontWeight: 'bold', marginLeft: '8px', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(5px)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>👤 مرحباً: {currentUser?.name}</span>
            
            {/* الأزرار التفاعلية للأقسام بناءً على الصلاحيات */}
            {currentUser?.permissions?.admin && (
              <button style={navBtnStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>لوحة الإدارة ⚙️</button>
            )}
            
            {(currentUser?.permissions?.students || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'students')} onClick={() => setActiveTab('students')}>الطلاب 📚</button>
            )}
            
            {(currentUser?.permissions?.classes || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'classes')} onClick={() => setActiveTab('classes')}>الفصول 🏛️</button>
            )}
            
            {(currentUser?.permissions?.teachers || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'teachers')} onClick={() => setActiveTab('teachers')}>المعلمين 👨‍🏫</button>
            )}

            {(currentUser?.permissions?.transports || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'transports')} onClick={() => setActiveTab('transports')}>التراحيل والمشرفين 🚌</button>
            )}
            
            {(currentUser?.permissions?.finance || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'accounts')} onClick={() => setActiveTab('accounts')}>الحسابات 💰</button>
            )}

            {(currentUser?.permissions?.results || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'results')} onClick={() => setActiveTab('results')}>النتيجة 📋</button>
            )}
            
            <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginRight: '6px' }}>خروج 🚪</button>
          </div>
        )}
      </div>

      <div style={{ padding: '30px 5%', flex: '1' }}>
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '35px' }}>
            
            {/* البانر الترحيبي العصري */}
            <div style={{ background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)', color: '#ffffff', padding: '45px 30px', borderRadius: '24px', boxShadow: '0 12px 30px rgba(4,120,87,0.15)', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
              
              <div style={{ textAlign: 'center', maxWidth: '850px' }}>
                <h1 style={{ margin: '0 0 16px 0', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '900', color: '#ffffff' }}>مرحباً بكم في صرح الشروق التعليمي</h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(15px, 2vw, 18px)', color: '#d1fae5', lineHeight: '1.7', fontWeight: '500' }}>بوابتكم التعليمية الذكية والعصرية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز ومشرق يليق بأبنائنا</p>
                
                <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #f59e0b' }}>✨ توكل • نجاح • تفوق</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#34d399', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>📚 المنهج السوداني المطور</span>
                </div>
              </div>

              {/* قسم مجلس الإدارة - بطاقات عصرية */}
              <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', padding: '30px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <h3 style={{ margin: '0 0 25px 0', color: '#fef08a', borderBottom: '2px solid rgba(245,158,11,0.4)', paddingBottom: '10px', fontSize: '22px', fontWeight: '900', textAlign: 'center' }}>🏛️ مجلس إدارة المدرسة</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px', width: '100%' }}>
                  
                  {/* البطاقات الإدارية */}
                  <div style={boardCardStyle('#f59e0b')}>
                    <img src="manager1.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={avatarStyle('#f59e0b')} />
                    <h4 style={roleStyle}>رئيس مجلس الإدارة</h4>
                    <p style={nameStyle}>الاستاذ كمال الدين مجذوب الطيب</p>
                  </div>

                  <div style={boardCardStyle('#10b981')}>
                    <img src="mother.png" alt="الأم التربوية" onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={avatarStyle('#10b981')} />
                    <h4 style={roleStyle}>الأم التربوية الحنون</h4>
                    <p style={nameStyle}>ماما هند عبد الرازق</p>
                  </div>

                  <div style={boardCardStyle('#3b82f6')}>
                    <img src="admin_manager.png" alt="مدير إداري" onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={avatarStyle('#3b82f6')} />
                    <h4 style={roleStyle}>المدير العام</h4>
                    <p style={nameStyle}>الاستاذ محمد كمال الدين مجذوب</p>
                  </div>

                  <div style={boardCardStyle('#8b5cf6')}>
                    <img src="admin_manager2.png" alt="مديرة إدارية" onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={avatarStyle('#8b5cf6')} />
                    <h4 style={roleStyle}>مديرة إدارية</h4>
                    <p style={nameStyle}>الاستاذه لينا كمال الدين مجذوب</p>
                  </div>

                </div>
              </div>

            </div>

            {/* بطاقات التعريف والمعلومات */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={infoCardStyle('#047857')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}><span style={{ fontSize: '24px' }}>📖</span><h3 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '19px' }}>مَن نحن؟</h3></div>
                <p style={{ color: '#334155', lineHeight: '1.7', fontSize: '14.5px', margin: 0, fontWeight: '600' }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية عبر مراحلها الثلاث.</p>
              </div>

              <div style={infoCardStyle('#065f46')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}><span style={{ fontSize: '24px' }}>🎯</span><h3 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: '19px' }}>أهدافنا ورسالتنا</h3></div>
                <ul style={{ color: '#334155', lineHeight: '1.8', fontSize: '14px', paddingRight: '18px', margin: 0, fontWeight: '600' }}>
                  <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة والمطورة.</li>
                  <li>بناء شخصية الطالب القيادية وتعزيز القيم الأخلاقية والوطنية الراسخة.</li>
                </ul>
              </div>

              <div style={infoCardStyle('#f59e0b')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}><span style={{ fontSize: '24px' }}>💼</span><h3 style={{ color: '#d97706', margin: 0, fontWeight: '900', fontSize: '19px' }}>الحلول الرقمية الذكية</h3></div>
                <p style={{ color: '#334155', lineHeight: '1.7', fontSize: '14.5px', margin: 0, fontWeight: '600' }}>تتضمن هذه البوابة الإلكترونية المتقدمة لوحة تحكم مخصصة لإدارة شؤون المعلمين، التراحيل والمشرفين، الفصول، الحسابات والنتائج بسرعة فائقة.</p>
              </div>
            </div>

          </div>
        )}

        {/* عرض نوافذ الأقسام التفاعلية في حال نجاح الدخول */}
        {isLoggedIn && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
            {activeTab === 'students' && <StudentsSection />}
            {activeTab === 'classes' && <ClassesSection />}
            {activeTab === 'teachers' && <TeachersSection />}
            {activeTab === 'transports' && <TransportsSection onBack={() => setActiveTab('dashboard')} />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'results' && <ResultsSection />}
            {activeTab === 'dashboard' && <DashboardSection onBack={() => setActiveTab('dashboard')} />}
          </div>
        )}
      </div>

      {/* نافذة تسجيل الدخول */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(5px)' }}>
          <form onSubmit={handleLogin} style={{ background: '#ffffff', padding: '32px', borderRadius: '20px', width: '350px', position: 'relative', borderTop: '6px solid #f59e0b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '16px', left: '16px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            <h3 style={{ textAlign: 'center', color: '#047857', margin: '0 0 6px 0', fontSize: '22px', fontWeight: '900' }}>تسجيل دخول الإدارة</h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '0 0 24px 0', fontWeight: 'bold' }}>الوصول الآمن لبوابة إدارة نظام مدرسة الشروق</p>
            
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
              <input type="text" placeholder="اسم الدخول المخصص" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right', fontWeight: 'bold', color: '#0f172a', outline: 'none' }} required />
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'right' }}>
              <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right', fontWeight: 'bold', color: '#0f172a', outline: 'none' }} required />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 12px rgba(4,120,87,0.3)' }}>
              {loading ? "جاري فتح البوابة السحابية..." : "دخول النظام 🔓"}
            </button>
          </form>
        </div>
      )}

      {/* التذييل العصري والأنيق */}
      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', color: '#334155', fontSize: '15px', fontWeight: '800', width: '100%', boxSizing: 'border-box' }}>
        ✨ من تصميم : <span style={{ color: '#d97706', textDecoration: 'underline' }}>الأستاذ عثمان صديق ( أبو حلا )</span> | 📱 <span style={{ color: '#047857' }}>01149169346</span>
      </footer>

    </div>
  );
}

// 🎨 التنسيقات المساعدة للظهور المميز
const navBtnStyle = (isActive) => ({
  padding: '8px 14px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
  backgroundColor: isActive ? '#f59e0b' : '#ffffff',
  color: isActive ? '#ffffff' : '#047857',
  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  transition: 'all 0.2s'
});

const boardCardStyle = (borderColor) => ({
  background: '#ffffff',
  borderRadius: '16px',
  padding: '18px 12px',
  textAlign: 'center',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
  borderTop: `4px solid ${borderColor}`
});

const avatarStyle = (borderColor) => ({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: '12px',
  border: `3px solid ${borderColor}`,
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
});

const roleStyle = { margin: '4px 0', color: '#047857', fontSize: '13.5px', fontWeight: '900' };
const nameStyle = { margin: 0, color: '#1e293b', fontWeight: '800', fontSize: '14.5px' };

const infoCardStyle = (borderColor) => ({
  background: '#ffffff',
  padding: '24px',
  borderRadius: '18px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  borderTop: `6px solid ${borderColor}`,
  borderLeft: '1px solid #e2e8f0',
  borderRight: '1px solid #e2e8f0',
  borderBottom: '1px solid #e2e8f0'
});
