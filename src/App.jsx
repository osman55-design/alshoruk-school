import React, { useState, useEffect } from 'react';
import './App.css';

// استيراد الملفات الستة المفصولة لحماية النظام
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import ResultsSection from './components/ResultsSection';
import DashboardSection from './components/DashboardSection';

// الرابط السحابي (الجسر البرمجي) الخاص بك مع سحابة جوجل
const GOOGLE_SCRIPT_URL = "https://google.com";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ستبدأ القائمة فارغة ليتم جلب الحسابات والصلاحيات حية ومباشرة من جدولك السحابي
  const [usersList, setUsersList] = useState([]);

  // دالة جلب بيانات المستخدمين من جدول جوجل وتجهيز الصلاحيات
  const fetchUsersFromCloud = async () => {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=المستخدمين`);
      const cloudData = await response.json();
      
      // مطابقة الأعمدة الإنجليزية من جدولك مع نظام الحسابات الأصلي لديك
      const formattedUsers = cloudData.map((u, index) => {
        const isAdmin = String(u.role).trim() === "أدمن";
        return {
          id: index + 1,
          name: u.name,
          loginName: String(u.username).trim(),
          role: u.role,
          pin: String(u.password).trim(),
          permissions: { 
            students: true, 
            classes: true, 
            teachers: isAdmin, 
            finance: isAdmin, 
            admin: isAdmin 
          }
        };
      });
      setUsersList(formattedUsers);
      return formattedUsers;
    } catch (error) {
      console.error("حدث خطأ في الاتصال بسحابة جوجل:", error);
      return [];
    }
  };

  // جلب البيانات فور فتح التطبيق
  useEffect(() => {
    fetchUsersFromCloud();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // تحديث البيانات من السحابة للتأكد من مواكبة التغييرات
    const freshUsers = await fetchUsersFromCloud();

    const foundUser = freshUsers.find(
      u => u.loginName === username.trim() && u.pin === password.trim()
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setIsLoggedIn(true);
      if (foundUser.permissions.admin) {
        setActiveTab('dashboard');
      } else if (foundUser.permissions.students) {
        setActiveTab('students');
      } else {
        setActiveTab('classes');
      }
    } else {
      alert('اسم المستخدم أو كلمة المرور غير مسجلة بالنظام السحابي!');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="app-main-layout" dir="rtl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '320px' }}>
          <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '5px' }}>مدرسة الشروق السودانية</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', marginTop: 0, marginBottom: '20px' }}>بوابة إدارة النظام الإلكتروني المتكامل</p>
          
          <div style={{ marginBottom: '15px', textAlign: 'right' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>اسم الدخول الخاص بك</label>
            <input type="text" placeholder="مثال: admin أو محمد" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', textAlign: 'right' }} required />
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>كلمة المرور</label>
            <input type="password" placeholder="ادخل كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', textAlign: 'right' }} required />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
            {loading ? "جاري الاتصال بالسحابة..." : "دخول النظام"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-main-layout" dir="rtl" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="elegant-nav-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px', background: '#1e3a8a', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', marginLeft: 'auto', paddingLeft: '15px' }}>
          🇸🇩 مدرسة الشروق السودانية | <span style={{ color: '#fed7aa' }}>مرحباً: {currentUser?.name} ({currentUser?.role})</span>
        </span>
        
        {currentUser?.permissions.students && <button className={`nav-tab-btn ${activeTab === 'students' ? 'active-tab' : ''}`} onClick={() => setActiveTab('students')}>الطلاب</button>}
        {currentUser?.permissions.classes && <button className={`nav-tab-btn ${activeTab === 'classes' ? 'active-tab' : ''}`} onClick={() => setActiveTab('classes')}>الفصل</button>}
        {currentUser?.permissions.teachers && <button className={`nav-tab-btn ${activeTab === 'teachers' ? 'active-tab' : ''}`} onClick={() => setActiveTab('teachers')}>المعلمين</button>}
        {currentUser?.permissions.finance && <button className={`nav-tab-btn ${activeTab === 'accounts' ? 'active-tab' : ''}`} onClick={() => setActiveTab('accounts')}>الحسابات</button>}
        {currentUser?.permissions.admin && <button className={`nav-tab-btn ${activeTab === 'results' ? 'active-tab' : ''}`} onClick={() => setActiveTab('results')}>النتيجة</button>}
        {currentUser?.permissions.admin && <button className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active-tab' : ''}`} onClick={() => setActiveTab('dashboard')}>لوحة التحكم</button>}
        
        <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>خروج</button>
      </div>

      <div className="content-fade-in" style={{ padding: '20px', flex: '1' }}>
        {activeTab === 'students' && currentUser?.permissions.students && <StudentsSection />}
        {activeTab === 'classes' && currentUser?.permissions.classes && <ClassesSection />}
        {activeTab === 'teachers' && currentUser?.permissions.teachers && <TeachersSection />}
        {activeTab === 'accounts' && currentUser?.permissions.finance && <AccountsSection />}
        {activeTab === 'results' && currentUser?.permissions.admin && <ResultsSection />}
        
        {activeTab === 'dashboard' && currentUser?.permissions.admin && (
          <DashboardSection users={usersList} setUsers={setUsersList} onBack={() => setActiveTab('dashboard')} />
        )}
      </div>

      <footer className="no-print" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f3f4f6', borderTop: '1px solid #e5e7eb', color: '#4b5563', fontSize: '14px', fontWeight: 'bold', marginTop: 'auto' }}>
        ✨ من تصميم الأستاذ عثمان صديق ( أبو حلا ) | 📱 للتواصل والدعم الفني: <span style={{ color: '#1e3a8a' }}>01149169346</span>
      </footer>
    </div>
  );
}
