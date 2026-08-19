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
      
      {/* 🌐 هيدر علوي فخم بألوان الشعار الموحدة */}
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
            <button style={{ padding: '10px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: activeTab === 'landing' ? '#cc9933' : 'transparent', color: activeTab === 'landing' ? '#fff' : '#e2e8f0', transition: 'all 0.3s' }} onClick={() => setActiveTab('landing')}>الرئيسية</button>
            <button style={{ padding: '10px 25px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: '#cc9933', color: '#fff', boxShadow: '0 4px 10px rgba(204,153,51,0.3)', transition: 'all 0.3s' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام الإلكتروني</button>
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

      {/* 📄 عرض محتوى الشاشات بتصميم عصري جذاب */}
      <div style={{ padding: '40px 20px', flex: '1' }}>
        
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* 🌅 هيرو بانر إشراقي مبهر يطابق رمز الشمس والأرض بالشعار */}
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

            {/* 🧩 شبكة المعلومات المقسمة كارت كارت بألوان تفاعلية */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              
              {/* كارت من نحن - الأزرق */}
              <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.02)', borderTop: '5px solid #1e3a8a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '24px' }}>📖</span>
                  <h3 style={{ color: '#1e3a8a', margin: 0, fontWeight: 'bold', fontSize: '20px' }}>مَن نحن؟</h3>
                </div>
                <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '15.5px', margin: 0 }}>
                  مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة آمنة تعبر بهم بنجاح عبر ثلاث مراحل دراسية متكاملة: <strong style={{ color: '#1e3a8a' }}>المرحلة الابتدائية، المرحلة المتوسطة، والمرحلة الثانوية</strong>.
                </p>
              </div>

              {/* كارت أهدافنا - الأخضر */}
