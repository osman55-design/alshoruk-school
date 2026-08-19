import React, { useState, useEffect } from 'react';
import './App.css';

// استيراد الأقسام الأساسية للوحة التحكم
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // للتحكم في ظهور نافذة تسجيل الدخول
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' تعني صفحة التنوير التعريفية الأولى
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);

  // دالة جلب المستخدمين (مجهزة تمهيداً لربطها بالفيربيس)
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

    // 🔑 حساب الإدارة الثابت للأستاذ عثمان
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
      setActiveTab('dashboard'); // التوجه مباشرة للوحة التحكم بعد الدخول
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
    setActiveTab('landing'); // العودة لصفحة التنوير عند الخروج
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 🌐 شريط التنقل العلوي العصري الموحد */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px 30px', background: '#1e3a8a', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* الشعار واسم المدرسة جهة اليمين */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
          {/* الكود يقرأ الشعار مباشرة من جيت هاب، تأكد فقط من مطابقة الامتداد png أو jpg */}
          <img 
            src="logo.png" 
            alt="شعار مدرسة الشروق" 
            onError={(e) => { e.target.src = "https://placehold.co🇸🇩"; }} // صورة احتياطية في حال تعطل المسار
            style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }} 
          />
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
            مدرسة الشروق السودانية المتكاملة
          </span>
        </div>
        
        {/* أزرار التنقل حسب حالة تسجيل الدخول */}
        {!isLoggedIn ? (
          <>
            <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'landing' ? '#fed7aa' : 'transparent', color: activeTab === 'landing' ? '#1e3a8a' : '#fff' }} onClick={() => setActiveTab('landing')}>الرئيسية</button>
            <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#16a34a', color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام الإلكتروني</button>
          </>
        ) : (
          <>
            <span style={{ color: '#fed7aa', fontWeight: 'bold', marginLeft: '20px' }}>مرحباً: {currentUser?.name} 🌟</span>
            <button style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'dashboard' ? '#fed7aa' : '#fff' }} onClick={() => setActiveTab('dashboard')}>لوحة التحكم</button>
            <button style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'students' ? '#fed7aa' : '#fff' }} onClick={() => setActiveTab('students')}>الطلاب</button>
            <button style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'classes' ? '#fed7aa' : '#fff' }} onClick={() => setActiveTab('classes')}>الفصول</button>
            <button style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'teachers' ? '#fed7aa' : '#fff' }} onClick={() => setActiveTab('teachers')}>المعلمين</button>
            <button style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'accounts' ? '#fed7aa' : '#fff' }} onClick={() => setActiveTab('accounts')}>الحسابات</button>
            <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px' }}>خروج 🚪</button>
          </>
        )}
      </div>

      {/* 📄 عرض محتوى الشاشات */}
      <div style={{ padding: '30px 20px', flex: '1' }}>
        
        {/* 🏛️ 1. صفحة التنوير والتعريف بالمدرسة (Landing Page) */}
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* البانر الترحيبي العريض */}
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#fff', padding: '50px 30px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 20px rgba(30,58,138,0.15)' }}>
              <img src="logo.png" alt="شعار المدرسة الكبير" onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '100px', height: '100px', marginBottom: '15px', borderRadius: '50%', backgroundColor: '#fff', padding: '5px' }} />
              <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>مرحباً بكم في مدرسة الشروق السودانية</h1>
              <p style={{ margin: 0, fontSize: '18px', color: '#bfdbfe' }}>بوابتكم التعليمية نحو مستقبل أكاديمي متميز وذكي لمراحلنا الثلاث</p>
            </div>

            {/* شبكة معلومات من نحن وأهدافنا */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              
              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1e3a8a', marginTop: 0, borderBottom: '2px solid #fed7aa', paddingBottom: '8px' }}>📖 مَن نحن؟</h3>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px' }}>
                  مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة عبر ثلاث مراحل دراسية متكاملة: **المرحلة الابتدائية، المرحلة المتوسطة، والمرحلة الثانوية**.
                </p>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1e3a8a', marginTop: 0, borderBottom: '2px solid #fed7aa', paddingBottom: '8px' }}>🎯 أهدافنا ورسالتنا</h3>
                <ul style={{ color: '#475569', lineHeight: '1.8', fontSize: '15px', paddingRight: '20px' }}>
                  <li>تقديم **تعليم متميز** يتوافق مع المعايير التربوية الحديثة.</li>
                  <li>بناء شخصية الطالب وتعزيز القيم الأخلاقية والوطنية.</li>
                  <li>توظيف **التكنولوجيا والأنظمة الذكية** لتسهيل الإدارة والمتابعة.</li>
                  <li>مد جسور التواصل الفعال بين المدرسة وأولياء الأمور.</li>
                </ul>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1e3a8a', marginTop: 0, borderBottom: '2px solid #fed7aa', paddingBottom: '8px' }}>💼 إدارة النظام والحلول الذكية</h3>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px' }}>
                  تحتوي البوابة الإلكترونية على نظام سحابي متطور لإدارة شؤون المعلمين، الفصول، الحسابات المالية، وقوائم الطلاب بشكل يضمن الدقة التامة والسرعة الفائقة في تنفيذ العمليات المدرسية تحت إشراف طاقم إداري متميز.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ⚙️ 2. أقسام لوحة الإدارة (تظهر فقط عند تسجيل الدخول) */}
        {isLoggedIn && (
          <>
            {activeTab === 'students' && <StudentsSection />}
            {activeTab === 'classes' && <ClassesSection />}
            {activeTab === 'teachers' && <TeachersSection />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'dashboard' && (
              <DashboardSection users={usersList} setUsers={setUsersList} onBack={() => setActiveTab('dashboard')} />
            )}
          </>
        )}
      </div>

      {/* 🔐 3. النافذة المنبثقة لتسجيل الدخول (Login Modal) */}
      {showLoginModal && (
