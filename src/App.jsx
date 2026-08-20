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
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px 5%', background: 'linear-gradient(90deg, #09170e 0%, #152c1e 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', borderBottom: '4px solid #cc9933' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
          <img 
            src="logo.png" 
            alt="شعار مدرسة الشروق" 
            onError={(e) => { e.target.src = "https://placehold.co🇸🇩"; }} 
            style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #cc9933', objectFit: 'cover' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 'clamp(16px, 4vw, 20px)', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              مدرسة الشروق السودانية المتكاملة
            </span>
            <span style={{ color: '#cc9933', fontSize: '11px', fontWeight: 'bold' }}>بوابة التعليم الإلكتروني المتطور</span>
          </div>
        </div>
        
        {!isLoggedIn ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '8px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: '#cc9933', color: '#fff', boxShadow: '0 4px 10px rgba(204,153,51,0.3)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#cc9933', fontWeight: 'bold', marginLeft: '10px', fontSize: '14px' }}>مرحباً: {currentUser?.name} 🌟</span>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'dashboard' ? '#cc9933' : '#fff', color: activeTab === 'dashboard' ? '#fff' : '#152c1e' }} onClick={() => setActiveTab('dashboard')}>لوحة التحكم</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'students' ? '#cc9933' : '#fff', color: activeTab === 'students' ? '#fff' : '#152c1e' }} onClick={() => setActiveTab('students')}>الطلاب</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'classes' ? '#cc9933' : '#fff', color: activeTab === 'classes' ? '#fff' : '#152c1e' }} onClick={() => setActiveTab('classes')}>الفصول</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'teachers' ? '#cc9933' : '#fff', color: activeTab === 'teachers' ? '#fff' : '#152c1e' }} onClick={() => setActiveTab('teachers')}>المعلمين</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'accounts' ? '#cc9933' : '#fff', color: activeTab === 'accounts' ? '#fff' : '#152c1e' }} onClick={() => setActiveTab('accounts')}>الحسابات</button>
            <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>خروج 🚪</button>
          </div>
        )}
      </div>
      <div style={{ padding: '40px 5%', flex: '1' }}>
        
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #0b1a10 0%, #152c1e 100%)', color: '#fff', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
              
              <div style={{ flex: '1', minWidth: '290px', textAlign: 'center', padding: '10px' }}>
                <h1 style={{ margin: '0 0 15px 0', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', color: '#fff' }}>مرحباً بكم في مدرسة الشروق السودانية</h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(15px, 1.8vw, 17px)', color: '#cbd5e1', lineHeight: '1.6' }}>بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز عبر جميع مراحلنا التعليمية الثلاث المتكاملة</p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(204,153,51,0.15)', color: '#cc9933', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #cc9933' }}>🚀 بيئة رقمية ذكية</span>
                  <span style={{ backgroundColor: 'rgba(25,56,34,0.4)', color: '#4ade80', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #152c1e' }}>📚 المنهج السوداني المعتمد</span>
                </div>
              </div>

              <div style={{ flex: '1.2', minWidth: '300px', background: 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02)' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#cc9933', borderBottom: '2px solid rgba(204,153,51,0.2)', paddingBottom: '10px', fontSize: '19px', fontWeight: 'bold', textAlign: 'center' }}>🏛️ مجلس إدارة المدرسة الموقر</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', direction: 'rtl' }}>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'linear-gradient(90deg, rgba(204,153,51,0.08) 0%, rgba(255,255,255,0.01) 100%)', borderRadius: '10px', border: '1px solid rgba(204,153,51,0.15)' }}>
                    <span style={{ color: '#cc9933', fontWeight: 'bold', fontSize: '14px' }}>1. المدير العام:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff' }}>كمال الدين مجذوب الطيب</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#fed7aa', fontWeight: 'bold', fontSize: '14px' }}>2. الأم التربوية الحنون:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff' }}>ماما هند عبد الرازق</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#fed7aa', fontWeight: 'bold', fontSize: '14px' }}>3. مدير إداري:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff' }}>محمد كمال الدين مجذوب</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#fed7aa', fontWeight: 'bold', fontSize: '14px' }}>4. مديرة إدارية:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff' }}>لينا كمال الدين مجذوب</span>
                  </div>

                </div>
              </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '30px' }}>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #152c1e', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>📖</span><h3 style={{ color: '#152c1e', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>مَن نحن؟</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة آمنة تعبر بهم بنجاح عبر ثلاث مراحل دراسية متكاملة: <strong>الابتدائية، المتوسطة، والثانوية</strong>.</p>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #0d2814', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>🎯</span><h3 style={{ color: '#0d2814', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>أهدافنا ورسالتنا</h3></div>
                <ul style={{ color: '#475569', lineHeight: '1.8', fontSize: '14.5px', paddingRight: '20px', margin: 0 }}>
                  <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة والمطورة.</li>
                  <li>بناء شخصية الطالب القيادية وتعزيز القيم الأخلاقية والوطنية الراسخة.</li>
                  <li>توظيف الأنظمة الرقمية والسحابية لتسهيل العمليات الإدارية والتعليمية.</li>
                  <li>مد جسور المتابعة الدقيقة والتواصل الفعال المستمر بين المدرسة وأولياء الأمور.</li>
                </ul>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #cc9933', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>💼</span><h3 style={{ color: '#cc9933', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>الحلول الرقمية الذكية</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>تتضمن هذه البوابة الإلكترونية المتقدمة لوحة تحكم ونظاماً برمجياً لإدارة شؤون المعلمين، الفصول والمستويات الدراسية، الحسابات والرسوم المالية، وسجلات الفرز للطلاب، لضمان الدقة الكاملة والسرعة الفائقة في تنفيذ العمليات المدرسية اليومية تحت إشراف طاقم متميز.</p>
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
          <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px 35px', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '340px', position: 'relative', borderTop: '6px solid #cc9933' }}>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            <h3 style={{ textAlign: 'center', color: '#152c1e', margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>تسجيل دخول الإدارة</h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '0 0 30px 0' }}>الوصول الآمن لبوابة إدارة نظام مدرسة الشروق</p>
            <div style={{ marginBottom: '18px', textAlign: 'right' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>اسم الدخول</label>
              <input type="text" placeholder="مثال: admin" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right', fontSize: '15px' }} required />
            </div>
            <div style={{ marginBottom: '25px', textAlign: 'right' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>كلمة المرور</label>
