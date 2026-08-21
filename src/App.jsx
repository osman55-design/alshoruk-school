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

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    if (username.trim() === "admin" && password.trim() === "1234") {
      setCurrentUser({
        id: 0,
        name: "الأستاذ عثمان صديق (أبو حلا)",
        role: "أدمن",
        permissions: { students: true, classes: true, teachers: true, finance: true, admin: true }
      });
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setActiveTab('dashboard'); 
    } else {
      alert('الحساب غير مسجل بالنظام!');
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f1f5f9', direction: 'rtl', fontFamily: 'Arial' }}>
      
      {/* الشريط العلوي باللون الكحلي الملكي */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px 5%', background: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', borderBottom: '4px solid #d4af37' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="logo.png" alt="الشعار" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #d4af37' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>مدرسة الشروق السودانية المتكاملة</span>
            <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: 'bold' }}>بوابة التعليم الإلكتروني المتطور</span>
          </div>
        </div>
        
        {!isLoggedIn ? (
          <button style={{ padding: '8px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#d4af37', color: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#d4af37', fontWeight: 'bold', marginLeft: '10px' }}>مرحباً: {currentUser?.name}</span>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'dashboard' ? '#d4af37' : '#fff', color: activeTab === 'dashboard' ? '#fff' : '#0f172a' }} onClick={() => setActiveTab('dashboard')}>لوحة التحكم</button>
            <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'students' ? '#d4af37' : '#fff', color: activeTab === 'students' ? '#fff' : '#0f172a' }} onClick={() => setActiveTab('students')}>الطلاب</button>
            <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold' }}>خروج 🚪</button>
          </div>
        )}
      </div>

      <div style={{ padding: '40px 5%', flex: '1' }}>
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* القسم الرئيسي الفخم المريح للعين */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: '#fff', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
              
              {/* رسالة الترحيب */}
              <div style={{ textAlign: 'center', padding: '10px', maxWidth: '800px' }}>
                <h1 style={{ margin: '0 0 15px 0', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', color: '#fff' }}>مرحباً بكم في مدرسة الشروق السودانية</h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(15px, 1.8vw, 17px)', color: '#cbd5e1', lineHeight: '1.6' }}>بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز عبر جميع مراحلنا التعليمية الثلاث المتكاملة</p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#d4af37', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #d4af37' }}>🚀 بيئة رقمية ذكية</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>📚 المنهج السوداني المعتمد</span>
                </div>
              </div>

              {/* قسم مجلس الإدارة المطور ببطاقات وصور */}
              <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '30px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02)' }}>
                <h3 style={{ margin: '0 0 30px 0', color: '#d4af37', borderBottom: '2px solid rgba(212,175,55,0.2)', paddingBottom: '10px', fontSize: '22px', fontWeight: 'bold', textAlign: 'center' }}>🏛️ مجلس إدارة المدرسة الموقر</h3>
                
                {/* شبكة عرض البطاقات المكونة من الصور والأسماء */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', width: '100%', direction: 'rtl' }}>
                  
                  {/* البطاقة 1: المدير العام */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                    <img src="manager1.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #d4af37' }} />
                    <h4 style={{ margin: '5px 0', color: '#d4af37', fontSize: '14px', fontWeight: 'bold' }}>1. المدير العام</h4>
                    <p style={{ margin: '0', color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>كمال الدين مجذوب الطيب</p>
                  </div>

                  {/* البطاقة 2: الأم التربوية */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                    <img src="mother.png" alt="الأم التربوية" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #38bdf8' }} />
                    <h4 style={{ margin: '5px 0', color: '#93c5fd', fontSize: '14px', fontWeight: 'bold' }}>2. الأم التربوية الحنون</h4>
                    <p style={{ margin: '0', color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>ماما هند عبد الرازق</p>
                  </div>

                  {/* البطاقة 3: مدير إداري */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                    <img src="admin_manager.png" alt="مدير إداري" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #38bdf8' }} />
                    <h4 style={{ margin: '5px 0', color: '#93c5fd', fontSize: '14px', fontWeight: 'bold' }}>3. مدير إداري</h4>
                    <p style={{ margin: '0', color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>محمد كمال الدين مجذوب</p>
                  </div>
                  {/* البطاقة 4: مديرة إدارية */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                    <img src="admin_manager2.png" alt="مديرة إدارية" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #38bdf8' }} />
                    <h4 style={{ margin: '5px 0', color: '#93c5fd', fontSize: '14px', fontWeight: 'bold' }}>4. مديرة إدارية</h4>
                    <p style={{ margin: '0', color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>لينا كمال الدين مجذوب</p>
                  </div>

                </div>
              </div>

            </div>

            {/* بطاقات التعريف والمعلومات بالألوان العصرية والخطوط المريحة */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '30px' }}>
              
              {/* بطاقة: من نحن */}
              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', borderTop: '5px solid #1e3a8a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>📖</span><h3 style={{ color: '#1e3a8a', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>مَن نحن؟</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة آمنة تعبر بهم بنجاح عبر ثلاث مراحل دراسية متكاملة: <strong>الابتدائية، المتوسطة، والثانوية</strong>.</p>
              </div>

              {/* بطاقة: أهدافنا ورسالتنا */}
              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', borderTop: '5px solid #0f172a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>🎯</span><h3 style={{ color: '#0f172a', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>أهدافنا ورسالتنا</h3></div>
                <ul style={{ color: '#475569', lineHeight: '1.8', fontSize: '14.5px', paddingRight: '20px', margin: 0 }}>
                  <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة والمطورة.</li>
                  <li>بناء شخصية الطالب القيادية وتعزيز القيم الأخلاقية والوطنية الراسخة.</li>
                  <li>توظيف الأنظمة الرقمية والسحابية لتسهيل العمليات الإدارية والتعليمية.</li>
                  <li>مد جسور المتابعة الدقيقة والتواصل الفعال المستمر بين المدرسة وأولياء الأمور.</li>
                </ul>
              </div>

              {/* بطاقة: الحلول الرقمية الذكية */}
              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', borderTop: '5px solid #d4af37', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>💼</span><h3 style={{ color: '#d4af37', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>الحلول الرقمية الذكية</h3></div>
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

      {/* نافذة تسجيل الدخول المعدلة بالألوان الجديدة الفخمة */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <form onSubmit={handleLogin} style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '320px', position: 'relative', borderTop: '6px solid #d4af37', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '15px', left: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#aaa' }}>❌</button>
            <h3 style={{ textAlign: 'center', color: '#0f172a', margin: '0 0 5px 0', fontSize: '20px', fontWeight: 'bold' }}>تسجيل دخول الإدارة</h3>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '12px', margin: '0 0 20px 0' }}>الوصول الآمن لبوابة إدارة نظام مدرسة الشروق</p>
            
            <div style={{ marginBottom: '15px', textAlign: 'right' }}>
              <input type="text" placeholder="اسم الدخول المخصص" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right' }} required />
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
              <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right' }} required />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 10px rgba(30,58,138,0.3)' }}>
              {loading ? "جاري فتح البوابة..." : "دخول النظام 🔓"}
            </button>
          </form>
        </div>
      )}

      {/* التذييل (Footer) المتناسق */}
      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ffffff', borderTop: '2px solid #e2e8f0', color: '#475569', fontSize: '15px', fontWeight: 'bold', width: '100%', boxSizing: 'border-box' }}>
        ✨ من تصميم : <span style={{ color: '#d4af37', fontSize: '16px' }}>الأستاذ عثمان صديق ( أبو حلا )</span> | 📱 للتواصل والدعم الفني المباشر: <span style={{ color: '#1e3a8a' }}>01149169346</span>
      </footer>

    </div>
  );
}
