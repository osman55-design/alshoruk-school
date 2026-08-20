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

