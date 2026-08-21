import React, { useState, useEffect } from 'react';
import './App.css';

// استدعاء ملف الربط مع قاعدة البيانات سوبابيز
import { supabase } from './supabaseClient';

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
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // جلب بيانات المستخدم من قاعدة البيانات بناءً على اسم المستخدم المدخل
      const { data: user, error } = await supabase
        .from('users_list')
        .select('*')
        .eq('username', username.trim())
        .single();

      // التحقق من تطابق كود الدخول المدخل مع المخزن بالداتابيز
      if (user && user.password_code === password.trim()) {
        setCurrentUser({
          id: user.id,
          name: user.full_name,
          role: user.role,
          permissions: {
            students: user.can_manage_students,
            classes: user.can_manage_classes,
            teachers: user.can_manage_teachers,
            finance: user.can_manage_finance,
            admin: user.can_manage_admin
          }
        });
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setActiveTab('dashboard'); 
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff', direction: 'rtl', fontFamily: 'Arial' }}>
      
      {/* الشريط العلوي الأخضر مع خط ذهبي */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px 5%', background: 'linear-gradient(90deg, #115e59 0%, #14b8a6 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderBottom: '4px solid #d4af37' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="logo.png" alt="الشعار" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #d4af37' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>مدرسة الشروق السودانية المتكاملة</span>
            <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: 'bold' }}>بوابة التعليم الإلكتروني المتطور</span>
          </div>
        </div>
        
        {!isLoggedIn ? (
          <button style={{ padding: '8px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#d4af37', color: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#d4af37', fontWeight: 'bold', marginLeft: '10px' }}>مرحباً: {currentUser?.name}</span>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'dashboard' ? '#d4af37' : '#fff', color: activeTab === 'dashboard' ? '#fff' : '#115e59' }} onClick={() => setActiveTab('dashboard')}>لوحة التحكم</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'students' ? '#d4af37' : '#fff', color: activeTab === 'students' ? '#fff' : '#115e59' }} onClick={() => setActiveTab('students')}>الطلاب</button>
            <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold' }}>خروج 🚪</button>
          </div>
        )}
      </div>

      <div style={{ padding: '40px 5%', flex: '1', backgroundColor: '#ffffff' }}>
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* القسم الرئيسي بالأخضر المريح */}
            <div style={{ background: 'linear-gradient(135deg, #115e59 0%, #134e4a 100%)', color: '#fff', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(17,94,89,0.1)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
              
              <div style={{ textAlign: 'center', padding: '10px', maxWidth: '800px' }}>
                <h1 style={{ margin: '0 0 15px 0', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 'bold', color: '#fff' }}>مرحباً بكم في مدرسة الشروق السودانية</h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(15px, 1.8vw, 17px)', color: '#ccfbf1', lineHeight: '1.6' }}>بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز عبر جميع مراحلنا التعليمية الثلاث المتكاملة</p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#d4af37', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #d4af37' }}>🚀 بيئة رقمية ذكية</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#2dd4bf', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>📚 المنهج السوداني المعتمد</span>
                </div>
              </div>

              {/* قسم مجلس الإدارة ببطاقات بيضاء ناصعة مريحة */}
              <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', padding: '30px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ margin: '0 0 30px 0', color: '#d4af37', borderBottom: '2px solid rgba(212,175,55,0.2)', paddingBottom: '10px', fontSize: '22px', fontWeight: 'bold', textAlign: 'center' }}>🏛️ مجلس إدارة المدرسة الموقر</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', width: '100%', direction: 'rtl' }}>
                  
                  {/* البطاقة 1 */}
                  <div style={{ background: '#ffffff', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <img src="manager1.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #d4af37' }} />
                    <h4 style={{ margin: '5px 0', color: '#115e59', fontSize: '14px', fontWeight: 'bold' }}>1. المدير العام</h4>
                    <p style={{ margin: '0', color: '#334155', fontWeight: 'bold', fontSize: '15px' }}>كمال الدين مجذوب الطيب</p>
                  </div>

                  {/* البطاقة 2 */}
                  <div style={{ background: '#ffffff', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <img src="mother.png" alt="الأم التربوية" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #14b8a6' }} />
                    <h4 style={{ margin: '5px 0', color: '#115e59', fontSize: '14px', fontWeight: 'bold' }}>2. الأم التربوية الحنون</h4>
                    <p style={{ margin: '0', color: '#334155', fontWeight: 'bold', fontSize: '15px' }}>ماما هند عبد الرازق</p>
                  </div>

                  {/* البطاقة 3 */}
                  <div style={{ background: '#ffffff', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <img src="admin_manager.png" alt="مدير إداري" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #14b8a6' }} />
                    <h4 style={{ margin: '5px 0', color: '#115e59', fontSize: '14px', fontWeight: 'bold' }}>3. مدير إداري</h4>
                    <p style={{ margin: '0', color: '#334155', fontWeight: 'bold', fontSize: '15px' }}>محمد كمال الدين مجذوب</p>
                  </div>

                  {/* البطاقة 4 */}
                  <div style={{ background: '#ffffff', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <img src="admin_manager2.png" alt="مديرة إدارية" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #14b8a6' }} />
                    <h4 style={{ margin: '5px 0', color: '#115e59', fontSize: '14px', fontWeight: 'bold' }}>4. مديرة إدارية</h4>
                    <p style={{ margin: '0', color: '#334155', fontWeight: 'bold', fontSize: '15px' }}>لينا كمال الدين مجذوب</p>
                  </div>

                </div>
              </div>

            </div>

            {/* بطاقات التعريف والمعلومات بالخلفية البيضاء الناصعة */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '30px' }}>
              
              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', borderTop: '5px solid #115e59', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>📖</span><h3 style={{ color: '#115e59', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>مَن نحن؟</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة آمنة تعبر بهم بنجاح عبر ثلاث مراحل دراسية متكاملة: <strong>الابتدائية، المتوسطة، والثانوية</strong>.</p>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', borderTop: '5px solid #134e4a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
