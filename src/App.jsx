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
      
      {/* هيدر مرن متوافق مع الجوال والكمبيوتر */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px 5%', background: 'linear-gradient(90deg, #0f2916 0%, #172554 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', borderBottom: '4px solid #cc9933' }}>
        
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
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ padding: '8px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: activeTab === 'landing' ? '#cc9933' : 'transparent', color: activeTab === 'landing' ? '#fff' : '#e2e8f0' }} onClick={() => setActiveTab('landing')}>الرئيسية</button>
            <button style={{ padding: '8px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: '#cc9933', color: '#fff', boxShadow: '0 4px 10px rgba(204,153,51,0.3)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#cc9933', fontWeight: 'bold', marginLeft: '10px', fontSize: '14px' }}>مرحباً: {currentUser?.name} 🌟</span>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'dashboard' ? '#cc9933' : '#fff', color: activeTab === 'dashboard' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('dashboard')}>لوحة التحكم</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'students' ? '#cc9933' : '#fff', color: activeTab === 'students' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('students')}>الطلاب</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'classes' ? '#cc9933' : '#fff', color: activeTab === 'classes' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('classes')}>الفصول</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'teachers' ? '#cc9933' : '#fff', color: activeTab === 'teachers' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('teachers')}>المعلمين</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'accounts' ? '#cc9933' : '#fff', color: activeTab === 'accounts' ? '#fff' : '#1e3a8a' }} onClick={() => setActiveTab('accounts')}>الحسابات</button>
            <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>خروج 🚪</button>
          </div>
        )}
      </div>
      <div style={{ padding: '40px 5%', flex: '1' }}>
        
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* 🌅 الهيرو بانر المطور بالتدرج اللوني الهادئ المريح ودعم الشاشات المتكامل */}
            <div style={{ background: 'linear-gradient(135deg, #0d2814 0%, #111e40 100%)', color: '#fff', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* القسم الأيمن: الشعار والترحيب الأنيق (ياخذ نصف المساحة في الشاشات الكبيرة) */}
              <div style={{ flex: '1', minWidth: '290px', textAlign: 'center', padding: '10px' }}>
                <img src="logo.png" alt="شعار مدرسة الشروق" onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '110px', height: '110px', marginBottom: '15px', borderRadius: '50%', backgroundColor: '#fff', padding: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', border: '3px solid #cc9933' }} />
                <h1 style={{ margin: '0 0 12px 0', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', color: '#fff' }}>مرحباً بكم في مدرسة الشروق السودانية</h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#cbd5e1', lineHeight: '1.6' }}>بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز عبر جميع مراحلنا التعليمية الثلاث المتكاملة</p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(204,153,51,0.15)', color: '#cc9933', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #cc9933' }}>🚀 بيئة رقمية ذكية</span>
                  <span style={{ backgroundColor: 'rgba(15,41,22,0.4)', color: '#4ade80', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #0f2916' }}>📚 المنهج السوداني المعتمد</span>
                </div>
              </div>

              {/* القسم الأيسر: لوحة الهيكل الإداري المتميز المدمج مع الألبوم المتناسق */}
              <div style={{ flex: '1.2', minWidth: '300px', background: 'rgba(255, 255, 255, 0.04)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#cc9933', borderBottom: '2px solid rgba(204,153,51,0.2)', paddingBottom: '10px', fontSize: '19px', fontWeight: 'bold', textAlign: 'center' }}>🏛️ مجلس إدارة المدرسة الموقر</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}><span style={{ color: '#fed7aa', fontWeight: 'bold' }}>1. المدير العام:</span><span style={{ fontWeight: 'bold' }}>كمال الدين مجذوب الطيب</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}><span style={{ color: '#fed7aa', fontWeight: 'bold' }}>2. الأم التربوية الحنون:</span><span style={{ fontWeight: 'bold' }}>ماما هند عبد الرازق</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}><span style={{ color: '#fed7aa', fontWeight: 'bold' }}>3. مدير إداري:</span><span style={{ fontWeight: 'bold' }}>محمد كمال الدين مجذوب</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}><span style={{ color: '#fed7aa', fontWeight: 'bold' }}>4. مديرة إدارية:</span><span style={{ fontWeight: 'bold' }}>لينا كمال الدين مجذوب</span></div>
                </div>

                {/* ألبوم الصور المدمج في شبكة متناسقة عصرية تدعم كافة الأبعاد */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', direction: 'rtl' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}><img src="image_jfdIgw.png" alt="المدير العام" style={{ width: '100%', height: '95px', objectFit: 'cover' }} /><div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(13,40,20,0.85)', color: '#fff', fontSize: '11px', padding: '3px', textAlign: 'center', fontWeight: 'bold' }}>المدير العام</div></div>
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}><img src="image_sLq9TO.png" alt="ماما هند" style={{ width: '100%', height: '95px', objectFit: 'cover' }} /><div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(13,40,20,0.85)', color: '#fff', fontSize: '11px', padding: '3px', textAlign: 'center', fontWeight: 'bold' }}>ماما هند</div></div>
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}><img src="image_VKI-Lz.png" alt="محمد كمال" style={{ width: '100%', height: '95px', objectFit: 'cover' }} /><div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(13,40,20,0.85)', color: '#fff', fontSize: '11px', padding: '3px', textAlign: 'center', fontWeight: 'bold' }}>أ. محمد كمال</div></div>
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}><img src="image_ZItlkY.png" alt="لينا كمال" style={{ width: '100%', height: '95px', objectFit: 'cover' }} /><div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(13,40,20,0.85)', color: '#fff', fontSize: '11px', padding: '3px', textAlign: 'center', fontWeight: 'bold' }}>أ. لينا كمال</div></div>
                </div>
              </div>

            </div>

            {/* بطاقات معلومات مَن نحن وأهدافنا المتناسقة والداعمة للجوال */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '30px' }}>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #172554', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>📖</span><h3 style={{ color: '#172554', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>مَن نحن؟</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة آمنة تعبر بهم بنجاح عبر ثلاث مراحل دراسية متكاملة: <strong>الابتدائية، المتوسطة، والثانوية</strong>.</p>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #0f2916', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>🎯</span><h3 style={{ color: '#0f2916', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>أهدافنا ورسالتنا</h3></div>
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
