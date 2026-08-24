import React, { useState } from 'react';
import './App.css';

// استدعاء ملف الربط مع قاعدة البيانات سوبابيز من الجذر الرئيسي
import { supabase } from './supabaseClient';

// 🟢 استدعاء كافة المكونات من داخل مجلد components
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import DashboardSection from './components/DashboardSection';
import ResultsSection from './components/ResultsSection';
import TransportSection from './components/TransportsSection';        // ملف التراحيل
import SupervisorsSection from './components/ClassSupervisorsSection'; // ملف المشرفات

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

  // ---------------- بيانات هيئة التدريس والمعلمين (20 معلم) ----------------
  const initialTeachers = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `الأستاذ / المعلم ${i + 1}`,
    subject: i % 2 === 0 ? 'اللغة العربية' : 'الرياضيات',
    image: 'https://placehold.co/150'
  }));

  const [teachersList, setTeachersList] = useState(initialTeachers);

  // ---------------- حالات التعديل السريع (Modals) ----------------
  const [editingItem, setEditingItem] = useState(null); // العنصر قيد التعديل
  const [editType, setEditType] = useState(''); // نوع العنصر: 'primary_top', 'middle_top', 'teacher'
  const [editName, setEditName] = useState('');
  const [editExtra, setEditExtra] = useState(''); // للدرجة المحرزة أو اسم المادة
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
        setActiveTab('landing'); // التوجيه للرئيسية مباشرة

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
      
      {/* الشريط العلوي */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px 5%', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(4,120,87,0.15)', borderBottom: '4px solid #f59e0b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="logo.png" alt="الشعار" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '20px', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>مدرسة الشروق السودانية </span>
            <span style={{ color: '#fef08a', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>روضة   ابتدائي     متوسط  ثانوي </span>
          </div>
        </div>
        
        {!isLoggedIn ? (
          <button style={{ padding: '10px 28px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#f59e0b', color: '#ffffff', fontSize: '14px', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#fef08a', fontWeight: 'bold', marginLeft: '12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px' }}>👤 مرحباً: {currentUser?.name}</span>
            
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'landing' ? '#f59e0b' : '#ffffff', color: activeTab === 'landing' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('landing')}>الرئيسية 🏠</button>

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

            {(currentUser?.permissions?.results || currentUser?.permissions?.admin) && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'results' ? '#f59e0b' : '#ffffff', color: activeTab === 'results' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('results')}>النتيجة 📋</button>
            )}

            {(currentUser?.permissions?.transport || currentUser?.permissions?.admin) && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'transport' ? '#f59e0b' : '#ffffff', color: activeTab === 'transport' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('transport')}>التراحيل 🚌</button>
            )}

            {(currentUser?.permissions?.supervisors || currentUser?.permissions?.admin) && (
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'supervisors' ? '#f59e0b' : '#ffffff', color: activeTab === 'supervisors' ? '#ffffff' : '#047857', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} onClick={() => setActiveTab('supervisors')}>المشرفات 👩‍💼</button>
            )}
            
            <button onClick={handleLogout} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>خروج 🚪</button>
          </div>
        )}
      </div>

      <div style={{ padding: '40px 5%', flex: '1', backgroundColor: '#f8fafc' }}>
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* القسم الترحيبي */}
            <div style={{ background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)', color: '#ffffff', padding: '50px 40px', borderRadius: '24px', boxShadow: '0 12px 35px rgba(4,120,87,0.15)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
              
              <div style={{ textAlign: 'center', padding: '10px', maxWidth: '850px' }}>
                <h1 style={{ margin: '0 0 18px 0', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: '900', color: '#ffffff' }}>مرحباً بكم في صرح الشروق التعليمي </h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(16px, 2vw, 19px)', color: '#d1fae5', lineHeight: '1.7', fontWeight: '500' }}>بوابتكم التعليمية الذكية والعصرية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز ومشرق يليق بأبنائنا</p>
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '8px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #f59e0b' }}>✨ توكل نجاح  تفوق</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#34d399', padding: '8px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>📚 المنهج السوداني المطور</span>
                </div>
              </div>

              {/* قسم مجلس الإدارة */}
              <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', padding: '35px 20px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fef08a', padding: '6px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid rgba(245, 158, 11, 0.3)' }}>القيادة والتميز</span>
                  <h3 style={{ margin: '12px 0 0 0', color: '#ffffff', fontSize: '26px', fontWeight: '900', letterSpacing: '0.5px' }}>🏛️ مجلس إدارة المدرسة</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', width: '100%', direction: 'rtl' }}>
                  <div style={glassCardStyle}>
                    <div style={imageContainerStyle}>
                      <img src="manager1.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co/200"; }} style={avatarStyle('#f59e0b')} />
                      <div style={badgeIconStyle('#f59e0b')}>👑</div>
                    </div>
                    <span style={roleBadgeStyle('#fef08a', 'rgba(245, 158, 11, 0.25)', '#f59e0b')}>رئيس مجلس الإدارة</span>
                    <h4 style={nameTitleStyle}>الأستاذ كمال الدين مجذوب الطيب</h4>
                  </div>

                  <div style={glassCardStyle}>
                    <div style={imageContainerStyle}>
                      <img src="mother.png" alt="الأم التربوية" onError={(e) => { e.target.src = "https://placehold.co/200"; }} style={avatarStyle('#f472b6')} />
                      <div style={badgeIconStyle('#f472b6')}>❤️</div>
                    </div>
                    <span style={roleBadgeStyle('#fbcfe8', 'rgba(244, 114, 182, 0.25)', '#f472b6')}>الأم التربوية الحنون</span>
                    <h4 style={nameTitleStyle}>ماما هند عبد الرازق</h4>
                  </div>

                  <div style={glassCardStyle}>
                    <div style={imageContainerStyle}>
                      <img src="admin_manager.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co/200"; }} style={avatarStyle('#34d399')} />
                      <div style={badgeIconStyle('#34d399')}>⭐</div>
                    </div>
                    <span style={roleBadgeStyle('#a7f3d0', 'rgba(52, 211, 153, 0.25)', '#34d399')}>المدير العام</span>
                    <h4 style={nameTitleStyle}>الأستاذ محمد كمال الدين مجذوب</h4>
                  </div>

                  <div style={glassCardStyle}>
                    <div style={imageContainerStyle}>
                      <img src="admin_manager2.png" alt="مديرة إدارية" onError={(e) => { e.target.src = "https://placehold.co/200"; }} style={avatarStyle('#a78bfa')} />
                      <div style={badgeIconStyle('#a78bfa')}>💎</div>
                    </div>
                    <span style={roleBadgeStyle('#ddd6fe', 'rgba(167, 139, 250, 0.25)', '#a78bfa')}>مديرة إدارية</span>
                    <h4 style={nameTitleStyle}>الأستاذة لينا كمال الدين مجذوب</h4>
                  </div>
                </div>
              </div>

            </div>

            {/* 📰 قسم أحدث أخبار وإعلانات المدرسة */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>📰 آخر أخبار المدرسة والإعلانات</h3>
                {isLoggedIn && (
                  <button onClick={() => setShowAddNewsModal(true)} style={{ backgroundColor: '#047857', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ إضافة خبر جديد</button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {newsList.map(news => (
                  <div key={news.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', backgroundColor: '#f9fafb', borderRight: '5px solid #047857' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>📅 {news.date}</span>
                    <h4 style={{ color: '#065f46', margin: '8px 0', fontSize: '18px', fontWeight: '800' }}>{news.title}</h4>
                    <p style={{ color: '#334155', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{news.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🌟 1. قسم لوحة المتفوقين - المرحلة الابتدائية (10 طلاب) */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#f59e0b', margin: 0, fontWeight: '900', fontSize: '24px' }}>🏆 متفوقو المرحلة الابتدائية (الأوائل الـ 10)</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '5px 0 0 0' }}>لوحة الشرف الخاصة بطلاب المرحلة الابتدائية</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                {primaryTopStudents.map((student) => (
                  <div key={student.id} style={{ background: '#fffbe6', border: '2px solid #fef08a', borderRadius: '20px', padding: '15px', textAlign: 'center', position: 'relative' }}>
                    <img src={student.image} alt={student.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #f59e0b', marginBottom: '10px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/150"; }} />
                    <h5 style={{ margin: '0 0 5px 0', color: '#064e3b', fontWeight: '900', fontSize: '15px' }}>{student.name}</h5>
                    <span style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>الدرجة: {student.score}</span>
                    
                    {isLoggedIn && (
                      <button onClick={() => openEditModal('primary_top', student)} style={{ marginTop: '10px', width: '100%', padding: '6px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>✏️ تعديل البيانات</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 🌟 2. قسم لوحة المتفوقين - المرحلة المتوسطة (10 طلاب) */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '24px' }}>🎓 متفوقو المرحلة المتوسطة (الأوائل الـ 10)</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '5px 0 0 0' }}>لوحة الشرف الخاصة بطلاب المرحلة المتوسطة</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                {middleTopStudents.map((student) => (
                  <div key={student.id} style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', borderRadius: '20px', padding: '15px', textAlign: 'center', position: 'relative' }}>
                    <img src={student.image} alt={student.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #047857', marginBottom: '10px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/150"; }} />
                    <h5 style={{ margin: '0 0 5px 0', color: '#064e3b', fontWeight: '900', fontSize: '15px' }}>{student.name}</h5>
                    <span style={{ backgroundColor: '#047857', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>الدرجة: {student.score}</span>
                    
                    {isLoggedIn && (
                      <button onClick={() => openEditModal('middle_top', student)} style={{ marginTop: '10px', width: '100%', padding: '6px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>✏️ تعديل البيانات</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 👨‍🏫 3. قسم كادر هيئة التدريس والمعلمين (20 معلم) */}
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: '24px' }}>👨‍🏫 هيئة التدريس والنخبة التعليمية (20 معلماً)</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '5px 0 0 0' }}>نخبة من أساتذة الكادر التعليمي بالمدرسة</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                {teachersList.map((teacher) => (
                  <div key={teacher.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '15px', textAlign: 'center' }}>
                    <img src={teacher.image} alt={teacher.name} style={{ width: '85px', height: '85px', borderRadius: '50%', border: '3px solid #10b981', marginBottom: '10px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/150"; }} />
                    <h5 style={{ margin: '0 0 4px 0', color: '#0f172a', fontWeight: '800', fontSize: '14px' }}>{teacher.name}</h5>
                    <span style={{ color: '#047857', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📖 {teacher.subject}</span>
                    
                    {isLoggedIn && (
                      <button onClick={() => openEditModal('teacher', teacher)} style={{ width: '100%', padding: '6px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>✏️ تعديل المعلم</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* بطاقات التعريف */}
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

        {/* عرض نوافذ الأقسام الأخرى */}
        {isLoggedIn && activeTab !== 'landing' && (
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
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
      </div>

      {/* ✏️ نافذة التعديل السريع (الاسم، الصورة، الدرجة/المادة) */}
      {editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <form onSubmit={handleSaveEdit} style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ margin: 0, color: '#047857' }}>تعديل البيانات من الصفحة الرئيسية</h4>
            
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>الاسم:</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />

            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{editType === 'teacher' ? 'المادة الدراسية:' : 'الدرجة المحرزة:'}</label>
            <input type="text" value={editExtra} onChange={e => setEditExtra(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />

            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>رابط الصورة:</label>
            <input type="text" value={editImage} onChange={e => setEditImage(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ التعديل</button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* ➕ نافذة إضافة خبر */}
      {showAddNewsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <form onSubmit={handleAddNews} style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ margin: 0, color: '#047857' }}>إضافة خبر جديد</h4>
            <input type="text" placeholder="عنوان الخبر" value={newNewsTitle} onChange={e => setNewNewsTitle(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} required />
            <textarea placeholder="تفاصيل الخبر" value={newNewsContent} onChange={e => setNewNewsContent(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px' }} required />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>حفظ</button>
              <button type="button" onClick={() => setShowAddNewsModal(false)} style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* نافذة تسجيل الدخول */}
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

      {/* التذييل */}
      <footer style={{ textAlign: 'center', padding: '25px', backgroundColor: '#ffffff', borderTop: '2px solid #e2e8f0', color: '#064e3b', fontSize: '16px', fontWeight: '900', width: '100%', boxSizing: 'border-box' }}>
        ✨ من تصميم : <span style={{ color: '#f59e0b', fontSize: '18px', textDecoration: 'underline' }}>الأستاذ عثمان صديق ( أبو حلا )</span> | 📱  <span style={{ color: '#047857' }}>01149169346</span>
      </footer>

    </div>
  );
}

const glassCardStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(12px)',
  borderRadius: '20px',
  padding: '22px 15px',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const imageContainerStyle = {
  position: 'relative',
  marginBottom: '15px',
  display: 'inline-block'
};

const avatarStyle = (borderColor) => ({
  width: '110px',
  height: '110px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `3px solid ${borderColor}`,
  padding: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  boxShadow: `0 0 20px ${borderColor}40`
});

const badgeIconStyle = (color) => ({
  position: 'absolute',
  bottom: '2px',
  right: '2px',
  backgroundColor: color,
  color: '#ffffff',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justify: 'center',
  fontSize: '14px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  border: '2px solid #ffffff'
});

const roleBadgeStyle = (textColor, bgColor, borderColor) => ({
  backgroundColor: bgColor,
  color: textColor,
  padding: '5px 14px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  marginBottom: '10px',
  border: `1px solid ${borderColor}`
});

const nameTitleStyle = {
  margin: '0',
  color: '#ffffff',
  fontWeight: '900',
  fontSize: '15px',
  lineHeight: '1.4',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
};
