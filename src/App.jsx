import React, { useState } from 'react';
import './App.css';

// استدعاء ملف الربط مع قاعدة البيانات سوبابيز
import { supabase } from './supabaseClient';

// استدعاء المكونات الفرعية
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';
import ResultsSection from './components/ResultsSection';
import TransportSection from './components/TransportsSection';
import SupervisorsSection from './components/ClassSupervisorsSection';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('landing'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- بيانات الأخبار ----------------
  const [newsList, setNewsList] = useState([
    { id: 1, title: 'بدء التسجيل للعام الدراسي الجديد', date: '2026-08-01', content: 'نُعلم جميع أولياء الأمور الكرام بفتح باب التسجيل لجميع المراحل الدراسية.' },
    { id: 2, title: 'تكريم الطلاب المتفوقين', date: '2026-08-15', content: 'تم إقامة حفل تكريم متميز للطلاب الأوائل في امتحانات الفترة.' }
  ]);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');

  // ---------------- بيانات المتفوقين (10 ابتدائي + 10 متوسط) ----------------
  const initialPrimary = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `طالب ابتدائي ${i + 1}`,
    score: '100%',
    image: 'https://placehold.co/150'
  }));

  const initialMiddle = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `طالب متوسط ${i + 1}`,
    score: '99%',
    image: 'https://placehold.co/150'
  }));

  const [primaryTopStudents, setPrimaryTopStudents] = useState(initialPrimary);
  const [middleTopStudents, setMiddleTopStudents] = useState(initialMiddle);

  // ---------------- بيانات هيئة التدريس (20 معلم) ----------------
  const initialTeachers = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `الأستاذ / المعلم ${i + 1}`,
    subject: i % 2 === 0 ? 'اللغة العربية' : 'الرياضيات',
    image: 'https://placehold.co/150'
  }));

  const [teachersList, setTeachersList] = useState(initialTeachers);

  // ---------------- حالات التعديل السريع (Modals) ----------------
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('');
  const [editName, setEditName] = useState('');
  const [editExtra, setEditExtra] = useState('');
  const [editImage, setEditImage] = useState('');

  // دالة تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: user } = await supabase
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
          results: user.can_manage_results ?? user.can_see_results,
          transport: user.can_manage_transport,
          supervisors: user.can_manage_supervisors,
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
        setActiveTab('landing');

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

  // دالة إضافة خبر
  const handleAddNews = (e) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsContent) return;
    const newItem = {
      id: Date.now(),
      title: newNewsTitle,
      content: newNewsContent,
      date: new Date().toISOString().split('T')[0]
    };
    setNewsList([newItem, ...newsList]);
    setNewNewsTitle('');
    setNewNewsContent('');
    setShowAddNewsModal(false);
  };

  // فتح نافذة التعديل
  const openEditModal = (type, item) => {
    setEditType(type);
    setEditingItem(item);
    setEditName(item.name);
    setEditExtra(type === 'teacher' ? item.subject : item.score);
    setEditImage(item.image);
  };

  // حفظ التعديل
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editType === 'primary_top') {
      setPrimaryTopStudents(primaryTopStudents.map(s => s.id === editingItem.id ? { ...s, name: editName, score: editExtra, image: editImage } : s));
    } else if (editType === 'middle_top') {
      setMiddleTopStudents(middleTopStudents.map(s => s.id === editingItem.id ? { ...s, name: editName, score: editExtra, image: editImage } : s));
    } else if (editType === 'teacher') {
      setTeachersList(teachersList.map(t => t.id === editingItem.id ? { ...t, name: editName, subject: editExtra, image: editImage } : t));
    }
    setEditingItem(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* الشريط العلوي المتجاوب */}
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 4%', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(4,120,87,0.15)', borderBottom: '3px solid #f59e0b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="logo.png" alt="الشعار" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #f59e0b', objectFit: 'cover' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: 'clamp(15px, 3.2vw, 19px)', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>مدرسة الشروق السودانية</span>
            <span style={{ color: '#fef08a', fontSize: 'clamp(10px, 2.2vw, 11px)', fontWeight: 'bold' }}>روضة | ابتدائي | متوسط | ثانوي</span>
          </div>
        </div>
        
        {!isLoggedIn ? (
          <button style={{ padding: '7px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#f59e0b', color: '#ffffff', fontSize: '13px', boxShadow: '0 3px 10px rgba(245,158,11,0.3)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', width: '100%', justifyContent: 'flex-start', marginTop: '6px' }}>
            <span style={{ color: '#fef08a', fontWeight: 'bold', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '12px' }}>👤 {currentUser?.name}</span>
            
            <button style={navBtnStyle(activeTab === 'landing')} onClick={() => setActiveTab('landing')}>الرئيسية 🏠</button>

            {currentUser?.permissions?.admin && (
              <button style={navBtnStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>الإدارة ⚙️</button>
            )}
            
            {(currentUser?.permissions?.students || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'students')} onClick={() => setActiveTab('students')}>الطلاب 📚</button>
            )}
            
            {(currentUser?.permissions?.classes || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'classes')} onClick={() => setActiveTab('classes')}>الفصول 🏛️</button>
            )}
            
            {(currentUser?.permissions?.teachers || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'teachers')} onClick={() => setActiveTab('teachers')}>المعلمين 👨‍🏫</button>
            )}
            
            {(currentUser?.permissions?.finance || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'accounts')} onClick={() => setActiveTab('accounts')}>الحسابات 💰</button>
            )}

            {(currentUser?.permissions?.results || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'results')} onClick={() => setActiveTab('results')}>النتيجة 📋</button>
            )}

            {(currentUser?.permissions?.transport || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'transport')} onClick={() => setActiveTab('transport')}>التراحيل 🚌</button>
            )}

            {(currentUser?.permissions?.supervisors || currentUser?.permissions?.admin) && (
              <button style={navBtnStyle(activeTab === 'supervisors')} onClick={() => setActiveTab('supervisors')}>المشرفات 👩‍💼</button>
            )}
            
            <button onClick={handleLogout} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px', marginRight: 'auto' }}>خروج 🚪</button>
          </div>
        )}
      </header>

      {/* الجسم الرئيسي للغلاف المحتوي */}
      <main style={{ padding: '15px 3%', flex: '1', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}>
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 🌟 البنّر الترحيبي الملموم والمعدل بذوق عالي (مساحة أقل) 🌟 */}
            <div style={{ 
              background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)', 
              color: '#ffffff', 
              padding: '16px 20px', 
              borderRadius: '16px', 
              boxShadow: '0 4px 15px rgba(4,120,87,0.12)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }}>
              
              {/* ترويسة البنّر */}
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: 'clamp(18px, 3.2vw, 24px)', fontWeight: '900', color: '#ffffff' }}>
                  مرحباً بكم في صرح الشروق التعليمي 🏫
                </h2>
                <p style={{ margin: '0 auto', fontSize: '13px', color: '#d1fae5', maxWidth: '650px', lineHeight: '1.4' }}>
                  بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز
                </p>
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
                  <span style={{ backgroundColor: 'rgba(245,158,11,0.2)', color: '#fef08a', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(245,158,11,0.4)' }}>✨ توكل نجاح تفوق</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#a7f3d0', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>📚 المنهج السوداني المطور</span>
                </div>
              </div>

              {/* قسم مجلس الإدارة المضغوط والمنسق */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)', 
                padding: '10px 12px', 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.12)' 
              }}>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#fef08a', fontSize: '11px', fontWeight: 'bold', tracking: '0.5px' }}>🏛️ مجلس إدارة المدرسة</span>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                  gap: '8px', 
                  width: '100%' 
                }}>
                  <div style={compactGlassCard}>
                    <img src="manager1.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={compactAvatar('#f59e0b')} />
                    <span style={compactBadge('#fef08a', 'rgba(245, 158, 11, 0.25)', '#f59e0b')}>رئيس مجلس الإدارة</span>
                    <h5 style={compactNameStyle}>الأستاذ كمال الدين مجذوب</h5>
                  </div>

                  <div style={compactGlassCard}>
                    <img src="mother.png" alt="الأم التربوية" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={compactAvatar('#f472b6')} />
                    <span style={compactBadge('#fbcfe8', 'rgba(244, 114, 182, 0.25)', '#f472b6')}>الأم التربوية</span>
                    <h5 style={compactNameStyle}>ماما هند عبد الرازق</h5>
                  </div>

                  <div style={compactGlassCard}>
                    <img src="admin_manager.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={compactAvatar('#34d399')} />
                    <span style={compactBadge('#a7f3d0', 'rgba(52, 211, 153, 0.25)', '#34d399')}>المدير العام</span>
                    <h5 style={compactNameStyle}>الأستاذ محمد كمال الدين</h5>
                  </div>

                  <div style={compactGlassCard}>
                    <img src="admin_manager2.png" alt="مديرة إدارية" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={compactAvatar('#a78bfa')} />
                    <span style={compactBadge('#ddd6fe', 'rgba(167, 139, 250, 0.25)', '#a78bfa')}>مديرة إدارية</span>
                    <h5 style={compactNameStyle}>الأستاذة لينا كمال الدين</h5>
                  </div>
                </div>
              </div>

            </div>

            {/* 📰 قسم أحدث الأخبار الإعلانات */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: 'clamp(16px, 3vw, 19px)' }}>📰 آخر الأخبار والإعلانات</h3>
                {isLoggedIn && (
                  <button onClick={() => setShowAddNewsModal(true)} style={{ backgroundColor: '#047857', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>+ إضافة خبر</button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {newsList.map(news => (
                  <div key={news.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRight: '4px solid #047857' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>📅 {news.date}</span>
                    <h4 style={{ color: '#065f46', margin: '4px 0', fontSize: '15px', fontWeight: '800' }}>{news.title}</h4>
                    <p style={{ color: '#334155', fontSize: '12.5px', margin: 0, lineHeight: '1.4' }}>{news.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🌟 1. متفوقو المرحلة الابتدائية (10 طلاب) */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ color: '#f59e0b', margin: 0, fontWeight: '900', fontSize: 'clamp(16px, 3vw, 19px)' }}>🏆 متفوقو المرحلة الابتدائية (الأوائل 10)</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '10px' }}>
                {primaryTopStudents.map((student) => (
                  <div key={student.id} style={{ background: '#fffbe6', border: '1.5px solid #fef08a', borderRadius: '12px', padding: '10px 6px', textAlign: 'center' }}>
                    <img src={student.image} alt={student.name} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #f59e0b', marginBottom: '6px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/150"; }} />
                    <h5 style={{ margin: '0 0 4px 0', color: '#064e3b', fontWeight: '900', fontSize: '12px' }}>{student.name}</h5>
                    <span style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block' }}>{student.score}</span>
                    
                    {isLoggedIn && (
                      <button onClick={() => openEditModal('primary_top', student)} style={{ marginTop: '6px', width: '100%', padding: '3px', background: '#047857', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>✏️ تعديل</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 🌟 2. متفوقو المرحلة المتوسطة (10 طلاب) */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: 'clamp(16px, 3vw, 19px)' }}>🎓 متفوقو المرحلة المتوسطة (الأوائل 10)</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '10px' }}>
                {middleTopStudents.map((student) => (
                  <div key={student.id} style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '10px 6px', textAlign: 'center' }}>
                    <img src={student.image} alt={student.name} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #047857', marginBottom: '6px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/150"; }} />
                    <h5 style={{ margin: '0 0 4px 0', color: '#064e3b', fontWeight: '900', fontSize: '12px' }}>{student.name}</h5>
                    <span style={{ backgroundColor: '#047857', color: '#fff', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block' }}>{student.score}</span>
                    
                    {isLoggedIn && (
                      <button onClick={() => openEditModal('middle_top', student)} style={{ marginTop: '6px', width: '100%', padding: '3px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>✏️ تعديل</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 👨‍🏫 3. قسم هيئة التدريس والمعلمين (20 معلم) */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: 'clamp(16px, 3vw, 19px)' }}>👨‍🏫 كادر هيئة التدريس (20 معلماً)</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '10px' }}>
                {teachersList.map((teacher) => (
                  <div key={teacher.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '10px 6px', textAlign: 'center' }}>
                    <img src={teacher.image} alt={teacher.name} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #10b981', marginBottom: '6px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/150"; }} />
                    <h5 style={{ margin: '0 0 2px 0', color: '#0f172a', fontWeight: '800', fontSize: '11px' }}>{teacher.name}</h5>
                    <span style={{ color: '#047857', fontSize: '10px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📖 {teacher.subject}</span>
                    
                    {isLoggedIn && (
                      <button onClick={() => openEditModal('teacher', teacher)} style={{ width: '100%', padding: '3px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>✏️ تعديل</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* بطاقات التعريف */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
              <div style={cardInfoStyle('#047857')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ fontSize: '18px' }}>📖</span><h4 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '16px' }}>مَن نحن؟</h4></div>
                <p style={{ color: '#064e3b', lineHeight: '1.6', fontSize: '13px', margin: 0, fontWeight: '600' }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة عالية عبر جميع المراحل.</p>
              </div>

              <div style={cardInfoStyle('#065f46')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ fontSize: '18px' }}>🎯</span><h4 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: '16px' }}>أهدافنا ورسالتنا</h4></div>
                <ul style={{ color: '#064e3b', lineHeight: '1.6', fontSize: '12.5px', paddingRight: '16px', margin: 0, fontWeight: '600' }}>
                  <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة.</li>
                  <li>تعزيز القيم الأخلاقية والوطنية الراسخة في الطلاب.</li>
                </ul>
              </div>

              <div style={cardInfoStyle('#f59e0b')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ fontSize: '18px' }}>💼</span><h4 style={{ color: '#f59e0b', margin: 0, fontWeight: '900', fontSize: '16px' }}>الحلول الرقمية الذكية</h4></div>
                <p style={{ color: '#064e3b', lineHeight: '1.6', fontSize: '13px', margin: 0, fontWeight: '600' }}>بوابة إلكترونية متقدمة تتضمن لوحة تحكم سحابية مخصصة لإدارة شؤون الطلاب، المعلمين، الحسابات، والنتائج بسهولة وموثوقية.</p>
              </div>
            </div>

          </div>
        )}

        {/* عرض نوافذ الأقسام الداخلية */}
        {isLoggedIn && activeTab !== 'landing' && (
          <div style={{ background: '#ffffff', padding: '15px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', width: '100%', overflowX: 'auto' }}>
            {activeTab === 'students' && <StudentsSection />}
            {activeTab === 'classes' && <ClassesSection />}
            {activeTab === 'teachers' && <TeachersSection />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'results' && <ResultsSection />}
            {activeTab === 'transport' && <TransportSection />}
            {activeTab === 'supervisors' && <SupervisorsSection />}
            {activeTab === 'dashboard' && <DashboardSection onBack={() => setActiveTab('dashboard')} />}
          </div>
        )}
      </main>

      {/* ✏️ نافذة التعديل السريع متجاوبة */}
      {editingItem && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleSaveEdit} style={modalBoxStyle}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '15px' }}>تعديل البيانات من الرئيسية</h4>
            
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>الاسم:</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} required />

            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>{editType === 'teacher' ? 'المادة الدراسية:' : 'الدرجة المحرزة:'}</label>
            <input type="text" value={editExtra} onChange={e => setEditExtra(e.target.value)} style={inputStyle} required />

            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>رابط الصورة:</label>
            <input type="text" value={editImage} onChange={e => setEditImage(e.target.value)} style={inputStyle} required />

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '8px', background: '#047857', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>حفظ التعديل</button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ flex: 1, padding: '8px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* ➕ نافذة إضافة خبر */}
      {showAddNewsModal && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleAddNews} style={modalBoxStyle}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '15px' }}>إضافة خبر جديد</h4>
            <input type="text" placeholder="عنوان الخبر" value={newNewsTitle} onChange={e => setNewNewsTitle(e.target.value)} style={inputStyle} required />
            <textarea placeholder="تفاصيل الخبر" value={newNewsContent} onChange={e => setNewNewsContent(e.target.value)} style={{ ...inputStyle, minHeight: '70px' }} required />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '8px', background: '#047857', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>حفظ الخبر</button>
              <button type="button" onClick={() => setShowAddNewsModal(false)} style={{ flex: 1, padding: '8px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* نافذة تسجيل الدخول */}
      {showLoginModal && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleLogin} style={{ ...modalBoxStyle, borderTop: '5px solid #f59e0b' }}>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '12px', left: '12px', border: 'none', background: 'none', fontSize: '16px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            <h3 style={{ textAlign: 'center', color: '#047857', margin: '0 0 4px 0', fontSize: '18px', fontWeight: '900' }}>تسجيل دخول الإدارة</h3>
            <p style={{ textAlign: 'center', color: '#475569', fontSize: '11px', margin: '0 0 16px 0', fontWeight: 'bold' }}>الوصول الآمن لنظام مدرسة الشروق</p>
            
            <div style={{ marginBottom: '12px' }}>
              <input type="text" placeholder="اسم الدخول المخصص" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {loading ? "جاري الدخول..." : "دخول النظام 🔓"}
            </button>
          </form>
        </div>
      )}

      {/* التذييل */}
      <footer style={{ textAlign: 'center', padding: '14px 10px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', color: '#064e3b', fontSize: '13px', fontWeight: '900', width: '100%', boxSizing: 'border-box' }}>
        ✨ من تصميم : <span style={{ color: '#f59e0b', textDecoration: 'underline' }}>الأستاذ عثمان صديق ( أبو حلا )</span> | 📱 <span style={{ color: '#047857' }}>01149169346</span>
      </footer>

    </div>
  );
}

// 🎨 الأنماط البرمجية الموحدة المتجاوبة
const navBtnStyle = (isActive) => ({
  padding: '5px 10px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '11px',
  backgroundColor: isActive ? '#f59e0b' : '#ffffff',
  color: isActive ? '#ffffff' : '#047857',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  whiteSpace: 'nowrap'
});

// الأنماط المدمجة الجديدة لمنطقة مجلس الإدارة
const compactGlassCard = {
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '10px',
  padding: '8px 4px',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const compactAvatar = (borderColor) => ({
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `2px solid ${borderColor}`,
  marginBottom: '4px'
});

const compactBadge = (textColor, bgColor, borderColor) => ({
  backgroundColor: bgColor,
  color: textColor,
  padding: '2px 6px',
  borderRadius: '8px',
  fontSize: '9px',
  fontWeight: 'bold',
  marginBottom: '3px',
  border: `1px solid ${borderColor}`,
  whiteSpace: 'nowrap'
});

const compactNameStyle = {
  margin: '0',
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: '11px',
  lineHeight: '1.2'
};

const cardInfoStyle = (borderColor) => ({
  background: '#ffffff',
  padding: '16px',
  borderRadius: '14px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  borderTop: `4px solid ${borderColor}`,
  borderLeft: '1px solid #e2e8f0',
  borderRight: '1px solid #e2e8f0',
  borderBottom: '1px solid #e2e8f0'
});

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.55)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 3000,
  padding: '15px',
  backdropFilter: 'blur(3px)'
};

const modalBoxStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '14px',
  width: '100%',
  maxWidth: '340px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  position: 'relative',
  boxSizing: 'border-box'
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  fontSize: '12px'
};
