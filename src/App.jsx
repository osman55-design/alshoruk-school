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

        // حماية مفرطة: فتح أول قسم يملك الموظف صلاحيته فوراً ومنعه من دخول لوحة الإدارة
        if (permissions.admin) {
          setActiveTab('dashboard'); // الأدمن الحقيقي يفتح على لوحة الإدارة
        } else if (permissions.students) {
          setActiveTab('students');  // موظف الطلاب يفتح على شاشة الطلاب مباشرة
        } else if (permissions.classes) {
          setActiveTab('classes');
        } else if (permissions.teachers) {
          setActiveTab('teachers');
        } else if (permissions.finance) {
          setActiveTab('accounts');
        } else {
          setActiveTab('landing'); // بدون صلاحيات يبقى في شاشة الترحيب الرسمية
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fcfdfd', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      
      {/* الشريط العلوي الأخضر الفاخر المشرق مع خط فخامة ذهبي */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px 5%', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(4,120,87,0.1)', borderBottom: '4px solid #f59e0b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="logo.png" alt="الشعار" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '20px', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>مدرسة الشروق السودانية </span>
            <span style={{ color: '#fef08a', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>روضة    ابتدائي     متوسط  ثانوي </span>
          </div>
        </div>
        
        {!isLoggedIn ? (
          <button style={{ padding: '10px 28px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#f59e0b', color: '#ffffff', fontSize: '14px', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#fef08a', fontWeight: 'bold', marginLeft: '12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px' }}>👤 مرحباً: {currentUser?.name}</span>
            
            {/* إظهار الأزرار والأقسام فقط لمن يملك الصلاحية المحددة له في الداتابيز */}
            {currentUser?.permissions?.admin && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'dashboard' ? '#f59e0b' : '#ffffff', color: activeTab === 'dashboard' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('dashboard')}>لوحة الإدارة ⚙️</button>
            )}
            
            {(currentUser?.permissions?.students || currentUser?.permissions?.admin) && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'students' ? '#f59e0b' : '#ffffff', color: activeTab === 'students' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('students')}>الطلاب 📚</button>
            )}
            
            {(currentUser?.permissions?.classes || currentUser?.permissions?.admin) && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'classes' ? '#f59e0b' : '#ffffff', color: activeTab === 'classes' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('classes')}>الفصول 🏛️</button>
            )}
            
            {(currentUser?.permissions?.teachers || currentUser?.permissions?.admin) && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'teachers' ? '#f59e0b' : '#ffffff', color: activeTab === 'teachers' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('teachers')}>المعلمين 👨‍🏫</button>
            )}
            
            {(currentUser?.permissions?.finance || currentUser?.permissions?.admin) && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'accounts' ? '#f59e0b' : '#ffffff', color: activeTab === 'accounts' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('accounts')}>الحسابات 💰</button>
            )}
            
            <button onClick={handleLogout} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>خروج 🚪</button>
          </div>
        )}
      </div>

      <div style={{ padding: '40px 5%', flex: '1', backgroundColor: '#f8fafc' }}>
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* القسم الترحيبي الرئيسي بالأخضر المهرجاني المشرق الفاخر ونصوص بارزة بلون ملكي */}
            <div style={{ background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)', color: '#ffffff', padding: '50px 40px', borderRadius: '24px', boxShadow: '0 12px 35px rgba(4,120,87,0.15)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
              
              <div style={{ textAlign: 'center', padding: '10px', maxWidth: '850px' }}>
                <h1 style={{ margin: '0 0 18px 0', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: '900', color: '#ffffff' }}>مرحباً بكم في صرح الشروق التعليمي </h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(16px, 2vw, 19px)', color: '#d1fae5', lineHeight: '1.7', fontWeight: '500' }}>بوابتكم التعليمية الذكية والعصرية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز ومشرق يليق بأبنائنا</p>
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '8px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #f59e0b' }}>✨ توكل نجاح  تفوق</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#34d399', padding: '8px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>📚 المنهج السوداني المطور</span>
                </div>
              </div>

              {/* قسم مجلس الإدارة ببطاقات ملكية بيضاء ناصعة ومحاطة بالذهب والأخضر */}
              <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.06)', padding: '35px 25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <h3 style={{ margin: '0 0 35px 0', color: '#fef08a', borderBottom: '2px solid rgba(245,158,11,0.3)', paddingBottom: '12px', fontSize: '24px', fontWeight: '900', textAlign: 'center' }}>🏛️ مجلس إدارة المدرسة </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '25px', width: '100%', direction: 'rtl' }}>
                  
                  {/* البطاقة 1 */}
                  <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', textAlign: 'center', border: '2px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', borderTop: '4px solid #f59e0b' }}>
                    <img src="manager1.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '125px', height: '125px', borderRadius: '50%', objectFit: 'cover', marginBottom: '14px', border: '3px solid #f59e0b', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }} />
                    <h4 style={{ margin: '5px 0', color: '#047857', fontSize: '15px', fontWeight: '900' }}>1. المدير العام</h4>
                    <p style={{ margin: '0', color: '#064e3b', fontWeight: '900', fontSize: '16px' }}>كمال الدين مجذوب الطيب</p>
                  </div>
                  {/* البطاقة 2 */}
                  <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', textAlign: 'center', border: '2px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', borderTop: '4px solid #10b981' }}>
                    <img src="mother.png" alt="الأم التربوية" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '125px', height: '125px', borderRadius: '50%', objectFit: 'cover', marginBottom: '14px', border: '3px solid #10b981', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }} />
                    <h4 style={{ margin: '5px 0', color: '#047857', fontSize: '15px', fontWeight: '900' }}>2. الأم التربوية الحنون</h4>
                    <p style={{ margin: '0', color: '#064e3b', fontWeight: '900', fontSize: '16px' }}>ماما هند عبد الرازق</p>
                  </div>

                  {/* البطاقة 3 */}
                  <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', textAlign: 'center', border: '2px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', borderTop: '4px solid #10b981' }}>
                    <img src="admin_manager.png" alt="مدير إداري" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '125px', height: '125px', borderRadius: '50%', objectFit: 'cover', marginBottom: '14px', border: '3px solid #10b981', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }} />
                    <h4 style={{ margin: '5px 0', color: '#047857', fontSize: '15px', fontWeight: '900' }}>3. مدير إداري</h4>
                    <p style={{ margin: '0', color: '#064e3b', fontWeight: '900', fontSize: '16px' }}>محمد كمال الدين مجذوب</p>
                  </div>

                  {/* البطاقة 4 */}
                  <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', textAlign: 'center', border: '2px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', borderTop: '4px solid #10b981' }}>
                    <img src="admin_manager2.png" alt="مديرة إدارية" onError={(e) => { e.target.src = "https://placehold.co"; }} style={{ width: '125px', height: '125px', borderRadius: '50%', objectFit: 'cover', marginBottom: '14px', border: '3px solid #10b981', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }} />
                    <h4 style={{ margin: '5px 0', color: '#047857', fontSize: '15px', fontWeight: '900' }}>4. مديرة إدارية</h4>
                    <p style={{ margin: '0', color: '#064e3b', fontWeight: '900', fontSize: '16px' }}>لينا كمال الدين مجذوب</p>
                  </div>

                </div>
              </div>

            </div>

            {/* بطاقات التعريف والمعلومات */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '30px' }}>
              <div style={{ background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', borderTop: '6px solid #047857', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}><span style={{ fontSize: '24px' }}>📖</span><h3 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '20px' }}>مَن نحن؟</h3></div>
                <p style={{ color: '#064e3b', lineHeight: '1.8', fontSize: '15.5px', margin: 0, fontWeight: '700' }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية عبر مراحلها الثلاث.</p>
              </div>

              <div style={{ background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', borderTop: '6px solid #065f46', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}><span style={{ fontSize: '24px' }}>🎯</span><h3 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: '20px' }}>أهدافنا ورسالتنا</h3></div>
                <ul style={{ color: '#064e3b', lineHeight: '1.9', fontSize: '15px', paddingRight: '20px', margin: 0, fontWeight: '700' }}>
                  <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة والمطورة.</li>
                  <li>بناء شخصية الطالب القيادية وتعزيز القيم الأخلاقية والوطنية الراسخة.</li>
                </ul>
              </div>

              <div style={{ background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', borderTop: '6px solid #f59e0b', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}><span style={{ fontSize: '24px' }}>💼</span><h3 style={{ color: '#f59e0b', margin: 0, fontWeight: '900', fontSize: '20px' }}>الحلول الرقمية الذكية</h3></div>
                <p style={{ color: '#064e3b', lineHeight: '1.8', fontSize: '15.5px', margin: 0, fontWeight: '700' }}>تتضمن هذه البوابة الإلكترونية المتقدمة لوحة تحكم مخصصة لإدارة شؤون المعلمين، الفصول والمستويات الدراسية، الحسابات والنتائج بسرعة فائقة.</p>
              </div>
            </div>

          </div>
        )}

        {/* عرض نوافذ الأقسام الستة التفاعلية في حال نجاح الدخول */}
        {isLoggedIn && (
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            {activeTab === 'students' && <StudentsSection />}
            {activeTab === 'classes' && <ClassesSection />}
            {activeTab === 'teachers' && <TeachersSection />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'dashboard' && <DashboardSection onBack={() => setActiveTab('dashboard')} />}
          </div>
        )}
      </div>

      {/* نافذة تسجيل الدخول الفاخرة بالأخضر الملكي - المصلحة والنظيفة */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(6,95,70,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(4px)' }}>
          <form onSubmit={handleLogin} style={{ background: '#ffffff', padding: '35px', borderRadius: '20px', width: '340px', position: 'relative', borderTop: '6px solid #f59e0b', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '18px', left: '18px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            <h3 style={{ textAlign: 'center', color: '#047857', margin: '0 0 6px 0', fontSize: '22px', fontWeight: '900' }}>تسجيل دخول الإدارة</h3>
            <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px', margin: '0 0 25px 0', fontWeight: 'bold' }}>الوصول الآمن لبوابة إدارة نظام مدرسة الشروق</p>
            
            <div style={{ marginBottom: '18px', textAlign: 'right' }}>
              <input type="text" placeholder="اسم الدخول المخصص" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right', fontWeight: 'bold', color: '#064e3b' }} required />
            </div>

            <div style={{ marginBottom: '25px', textAlign: 'right' }}>
              <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', textAlign: 'right', fontWeight: 'bold', color: '#064e3b' }} required />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 6px 15px rgba(4,120,87,0.25)' }}>
              {loading ? "جاري فتح البوابة السحابية..." : "دخول النظام 🔓"}
            </button>
          </form>
        </div>
      )}

      {/* التذييل الفاخر */}
      <footer style={{ textAlign: 'center', padding: '25px', backgroundColor: '#ffffff', borderTop: '2px solid #e2e8f0', color: '#064e3b', fontSize: '16px', fontWeight: '900', width: '100%', boxSizing: 'border-box' }}>
        ✨ من تصميم : <span style={{ color: '#f59e0b', fontSize: '18px', textDecoration: 'underline' }}>الأستاذ عثمان صديق ( أبو حلا )</span> | 📱  <span style={{ color: '#047857' }}>01149169346</span>
      </footer>

    </div>
  );
}
