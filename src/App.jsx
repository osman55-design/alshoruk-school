import React, { useState, useEffect } from 'react';
import './App.css';

import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('landing'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);

  const fetchUsersFromCloud = async () => {
    return [];
  };

  useEffect(() => {
    fetchUsersFromCloud();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (inputUser === "admin" && inputPass === "1234") {
      const adminUser = {
        id: 0,
        name: "الأستاذ عثمان صديق (أبو حلا)",
        loginName: "admin",
        role: "أدمن",
        pin: "1234",
        permissions: { students: true, classes: true, teachers: true, finance: true, admin: true }
      };
      setCurrentUser(adminUser);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setActiveTab('dashboard'); 
    } else {
      alert('اسم المستخدم أو كلمة المرور غير مسجلة بالنظام!');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setActiveTab('landing'); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px 40px', background: 'linear-gradient(90deg, #10351a 0%, #1e3a8a 100%)', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', borderBottom: '4px solid #cc9933' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
          <img 
            src="logo.png" 
            alt="شعار مدرسة الشروق" 
            onError={(e) => { e.target.src = "https://placehold.co🇸🇩"; }} 
            style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #cc9933', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '20px', letterSpacing: '0.5px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              مدرسة الشروق السودانية المتكاملة
            </span>
            <span style={{ color: '#cc9933', fontSize: '12px', fontWeight: 'bold', marginTop: '2px' }}>بوابة التعليم الإلكتروني المتطور</span>
          </div>
        </div>
        
        {!isLoggedIn ? (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button style={{ padding: '10px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: activeTab === 'landing' ? '#cc9933' : 'transparent', color: activeTab === 'landing' ? '#fff' : '#e2e8f0' }} onClick={() => setActiveTab('landing')}>الرئيسية</button>
            <button style={{ padding: '10px 25px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: '#cc9933', color: '#fff', boxShadow: '0 4px 10px rgba(204,153,51,0.3)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام الإلكتروني</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#cc9933', fontWeight: 'bold', marginLeft: '20px', fontSize: '15px' }}>مرحباً: {currentUser?.name} 🌟</span>
            <button style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'dashboard' ? '#cc9933' : '#fff', color: activeTab === 'dashboard' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('dashboard')}>لوحة التحكم</button>
            <button style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'students' ? '#cc9933' : '#fff', color: activeTab === 'students' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('students')}>الطلاب</button>
            <button style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'classes' ? '#cc9933' : '#fff', color: activeTab === 'classes' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('classes')}>الفصول</button>
            <button style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'teachers' ? '#cc9933' : '#fff', color: activeTab === 'teachers' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('teachers')}>المعلمين</button>
            <button style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'accounts' ? '#cc9933' : '#fff', color: activeTab === 'accounts' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('accounts')}>الحسابات</button>
            <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px' }}>خروج 🚪</button>
          </div>
        )}
      </div>
      <div style={{ padding: '40px 20px', flex: '1' }}>
        
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #10351a 0%, #1e3a8a 100%)', color: '#fff', padding: '60px 40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 15px 30px rgba(30,58,138,0.2)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(204,153,51,0.1)', borderRadius: '50%', top: '-50px', left: '-50px' }}></div>
              <img src="logo.png" alt="شعار المدرسة الكبير" onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '130px', height: '130px', marginBottom: '20px', borderRadius: '50%', backgroundColor: '#fff', padding: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', border: '3px solid #cc9933' }} />
              <h1 style={{ margin: '0 0 15px 0', fontSize: '36px', fontWeight: 'bold', color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>مرحباً بكم في مدرسة الشروق السودانية</h1>
              <p style={{ margin: '0 auto', maxWidth: '700px', fontSize: '19px', color: '#e2e8f0', lineHeight: '1.6' }}>بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز عبر جميع مراحلنا التعليمية الثلاث المتكاملة</p>
              
              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <span style={{ backgroundColor: 'rgba(204,153,51,0.2)', color: '#cc9933', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #cc9933' }}>🚀 بيئة رقمية ذكية</span>
                <span style={{ backgroundColor: 'rgba(16,53,26,0.4)', color: '#4ade80', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #10351a' }}>📚 المنهج السوداني المعتمد</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              
              <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.02)', borderTop: '5px solid #1e3a8a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '24px' }}>📖</span>
                  <h3 style={{ color: '#1e3a8a', margin: 0, fontWeight: 'bold', fontSize: '20px' }}>مَن نحن؟</h3>
                </div>
                <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '15.5px', margin: 0 }}>
                  مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة آمنة تعبر بهم بنجاح عبر ثلاث مراحل دراسية متكاملة: <strong style={{ color: '#1e3a8a' }}>المرحلة الابتدائية، المرحلة المتوسطة، والمرحلة الثانوية</strong>.
                </p>
              </div>

              <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.02)', borderTop: '5px solid #10351a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '24px' }}>🎯</span>
                  <h3 style={{ color: '#10351a', margin: 0, fontWeight: 'bold', fontSize: '20px' }}>أهدافنا ورسالتنا</h3>
                </div>
                <ul style={{ color: '#475569', lineHeight: '1.9', fontSize: '15px', paddingRight: '20px', margin: 0 }}>
                  <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة والمطورة.</li>
                  <li>بناء شخصية الطالب القيادية وتعزيز القيم الأخلاقية والوطنية الراسخة.</li>
                  <li>توظيف التكنولوجيا الرقمية والسحابية لتسهيل العمليات الإدارية والتعليمية.</li>
                  <li>مد جسور المتابعة الدقيقة والتواصل الفعال المستمر بين المدرسة وأولياء الأمور.</li>
                </ul>
              </div>

              <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.02)', borderTop: '5px solid #cc9933', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '24px' }}>💼</span>
                  <h3 style={{ color: '#cc9933', margin: 0, fontWeight: 'bold', fontSize: '20px' }}>الحلول الرقمية الذكية</h3>
                </div>
                <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '15.5px', margin: 0 }}>
                  تتضمن هذه البوابة الإلكترونية المتقدمة لوحة تحكم ونظاماً برمجياً لإدارة شؤون المعلمين، الفصول والمستويات الدراسية، الحسابات والرسوم المالية، وسجلات الفرز للطلاب، لضمان الدقة الكاملة والسرعة الفائقة في تنفيذ العمليات المدرسية اليومية تحت إشراف طاقم تربوي وإداري متميز ومحترف.
                </p>
              </div>

            </div>
          </div>
        )}

        {isLoggedIn && (
          <div className="content-fade-in">
            {activeTab === 'students' && <StudentsSection />}
            {activeTab === 'classes' && <ClassesSection />}
            {activeTab === 'teachers' && <TeachersSection />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'dashboard' && (
              <DashboardSection users={usersList} setUsers={setUsersList} onBack={() => setActiveTab('dashboard')} />
            )}
          </div>
        )}
      </div>

      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(4px)' }}>
          <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px 35px', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '350px', position: 'relative', borderTop: '6px solid #cc9933' }}>
            
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            
            <h3 style={{ textAlign: 'center', color: '#1e3a8a', margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>تسجيل دخول الإدارة</h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '0 0 30px 0' }}>الوصول الآمن لبوابة إدارة نظام مدرسة الشروق</p>
            
            <div style={{ marginBottom: '18px', textAlign: 'right' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>اسم الدخول</label>
              <input type="text" placeholder="مثال: admin" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right', fontSize: '15px' }} required />
            </div>

            <div style={{ marginBottom: '25px', textAlign: 'right' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>كلمة المرور</label>
              <input type="password" placeholder="ادخل كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right', fontSize: '15px' }} required />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: 'linear-gradient(90deg, #10351a 0%, #1e3a8a 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 12px rgba(30,58,138,0.25)' }}>
              {loading ? "جاري فتح البوابة..." : "دخول النظام 🔓"}
            </button>
          </form>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ffffff', borderTop: '2px solid #e2e8f0', color: '#475569', fontSize: '15px', fontWeight: 'bold', width: '100%', boxSizing: 'border-box', boxShadow: '0 -4px 10px rgba(0,0,0,0.02)' }}>
        ✨ من تصميم الإبداعي للمطور: <span style={{ color: '#cc9933', fontSize: '16px' }}>الأستاذ عثمان صديق ( أبو حلا )</span> | 📱 للتواصل والدعم الفني المباشر: <span style={{ color: '#1e3a8a' }}>01149169346</span>
      </footer>

    </div>
  );
}
