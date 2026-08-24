import React, { useState, useEffect } from 'react';
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
  const [newsList, setNewsList] = useState([]);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');

  // ---------------- بيانات المتفوقين (5 طلاب لكل مرحلة) ----------------
  const [primaryTopStudents, setPrimaryTopStudents] = useState([]);
  const [middleTopStudents, setMiddleTopStudents] = useState([]);

  // ---------------- بيانات هيئة التدريس (20 معلم) ----------------
  const [teachersList, setTeachersList] = useState([]);

  // ---------------- حالات التعديل السريع ----------------
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('');
  const [editName, setEditName] = useState('');
  const [editExtra, setEditExtra] = useState('');
  const [editImage, setEditImage] = useState('');

  // جلب الأخبار والمتفوقين والمعلمين عند تحميل الصفحة
  useEffect(() => {
    fetchNews();
    fetchTopStudents();
    fetchTeachers();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await supabase.from('news').select('*').order('id', { ascending: false });
      if (data && data.length > 0) {
        setNewsList(data);
      } else {
        setNewsList([
          { id: 1, title: 'بدء التسجيل للعام الدراسي الجديد', date: '2026-08-01', content: 'نُعلم جميع أولياء الأمور الكرام بفتح باب التسجيل لجميع المراحل الدراسية.' },
          { id: 2, title: 'تكريم الطلاب المتفوقين', date: '2026-08-15', content: 'تم إقامة حفل تكريم متميز للطلاب الأوائل في امتحانات الفترة.' }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTopStudents = async () => {
    try {
      const { data } = await supabase.from('top_students').select('*');
      if (data && data.length > 0) {
        setPrimaryTopStudents(data.filter(s => s.stage === 'primary'));
        setMiddleTopStudents(data.filter(s => s.stage === 'middle'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data } = await supabase.from('teachers').select('*');
      if (data && data.length > 0) {
        setTeachersList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsContent) return;

    const newNewsData = {
      title: newNewsTitle,
      content: newNewsContent,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const { data, error } = await supabase.from('news').insert([newNewsData]).select();
      if (!error && data) {
        setNewsList([data[0], ...newsList]);
      } else {
        setNewsList([{ ...newNewsData, id: Date.now() }, ...newsList]);
      }
    } catch (err) {
      console.error(err);
    }

    setNewNewsTitle('');
    setNewNewsContent('');
    setShowAddNewsModal(false);
  };

  const openEditModal = (type, item, index) => {
    setEditType(type);
    setEditingItem(item || { id: `new_${index}`, isNew: true, index });
    setEditName(item?.name || '');
    setEditExtra(type === 'teacher' ? (item?.subject || '') : (item?.score || ''));
    setEditImage(item?.image || item?.image_url || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (editType === 'primary_top' || editType === 'middle_top') {
      const stage = editType === 'primary_top' ? 'primary' : 'middle';
      const updatedStudent = { name: editName, score: editExtra, image: editImage, stage };

      try {
        if (editingItem.id && !editingItem.isNew) {
          await supabase.from('top_students').update(updatedStudent).eq('id', editingItem.id);
        } else {
          const { data } = await supabase.from('top_students').insert([updatedStudent]).select();
          if (data && data[0]) updatedStudent.id = data[0].id;
        }
      } catch (err) {
        console.error(err);
      }

      if (editType === 'primary_top') {
        const list = [...primaryTopStudents];
        const idx = list.findIndex(s => s.id === editingItem.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...updatedStudent };
        else list.push(updatedStudent);
        setPrimaryTopStudents(list);
      } else {
        const list = [...middleTopStudents];
        const idx = list.findIndex(s => s.id === editingItem.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...updatedStudent };
        else list.push(updatedStudent);
        setMiddleTopStudents(list);
      }

    } else if (editType === 'teacher') {
      const updatedTeacher = { name: editName, subject: editExtra, image: editImage };

      try {
        if (editingItem.id && !editingItem.isNew) {
          await supabase.from('teachers').update(updatedTeacher).eq('id', editingItem.id);
        } else {
          const { data } = await supabase.from('teachers').insert([updatedTeacher]).select();
          if (data && data[0]) updatedTeacher.id = data[0].id;
        }
      } catch (err) {
        console.error(err);
      }

      const list = [...teachersList];
      const idx = list.findIndex(t => t.id === editingItem.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...updatedTeacher };
      } else {
        list.push(updatedTeacher);
      }
      setTeachersList(list);
    }

    setEditingItem(null);
  };

  // 🌟 دالة توليد الخانات الثابتة
  const renderFixedSlots = (dataList, totalSlots, typeLabel, editTypeTag, cardBg, borderColor, badgeBg) => {
    const slots = Array.from({ length: totalSlots }, (_, index) => dataList[index] || null);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
        {slots.map((item, index) => (
          <div key={index} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, borderRadius: '12px', padding: '12px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {item ? (
              <>
                <img src={item.image || item.image_url || 'https://placehold.co/150'} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${badgeBg}`, marginBottom: '6px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/150"; }} />
                <h5 style={{ margin: '0 0 4px 0', color: '#064e3b', fontWeight: '900', fontSize: '11.5px' }}>{item.name}</h5>
                {editTypeTag === 'teacher' ? (
                  <span style={{ color: '#047857', fontSize: '10px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📖 {item.subject}</span>
                ) : (
                  <span style={{ backgroundColor: badgeBg, color: '#fff', padding: '2px 8px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 'bold', display: 'inline-block' }}>{item.score}</span>
                )}
              </>
            ) : (
              <div style={{ padding: '8px 0', opacity: 0.6 }}>
                <div style={{ fontSize: '24px' }}>👤</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginTop: '2px' }}>{typeLabel} #{index + 1}</div>
              </div>
            )}

            {isLoggedIn && (
              <button onClick={() => openEditModal(editTypeTag, item, index)} style={{ marginTop: '6px', width: '100%', padding: '4px', background: badgeBg, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>
                ✏️ {item ? 'تعديل' : 'إضافة'}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* 🌟 أنماط CSS للمحرك والتصميم الزجاجي */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .ticker-wrap {
          display: flex;
          align-items: center;
          background: linear-gradient(90deg, #047857 0%, #065f46 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(4, 120, 87, 0.15);
          border: 1px solid #059669;
          margin-bottom: 16px;
        }
        .ticker-title {
          background: #f59e0b;
          color: #ffffff;
          padding: 10px 18px;
          font-weight: 900;
          font-size: 13px;
          white-space: nowrap;
          z-index: 2;
          box-shadow: 2px 0 10px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ticker-content-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          position: relative;
        }
        .ticker-move {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
          padding-left: 100%;
        }
        .ticker-move:hover {
          animation-play-state: paused;
        }
        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          margin-left: 30px;
        }
        .ticker-logo {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid #f59e0b;
          object-fit: cover;
        }

        /* زجاجي أنيق للتذييل */
        .glass-footer {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.03);
        }
      `}</style>

      {/* الشريط العلوي */}
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

      {/* الجسم الرئيسي */}
      <main style={{ padding: '15px 3%', flex: '1', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}>
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 🌟 شريط الأخبار والإعلانات المتحرك العصري فوق مجلس الإدارة 🌟 */}
            <div className="ticker-wrap">
              <div className="ticker-title">
                <span>إعلان</span> 📢
              </div>
              <div className="ticker-content-container">
                <div className="ticker-move">
                  {newsList.map((news, idx) => (
                    <span key={news.id || idx} className="ticker-item">
                      <img src="logo.png" alt="logo" className="ticker-logo" onError={(e) => { e.target.src = "https://placehold.co/50"; }} />
                      <span style={{ color: '#fef08a' }}>[{news.title}]:</span>
                      <span>{news.content}</span>
                      <img src="logo.png" alt="logo" className="ticker-logo" onError={(e) => { e.target.src = "https://placehold.co/50"; }} />
                    </span>
                  ))}
                </div>
              </div>
              {isLoggedIn && (
                <button onClick={() => setShowAddNewsModal(true)} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap', marginLeft: '8px', borderRadius: '6px' }}>+ خبر</button>
              )}
            </div>

            {/* القسم الترحيبي وبنّر مجلس الإدارة */}
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '24px 20px', 
              borderRadius: '16px', 
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)', 
              border: '1px solid #e2e8f0',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px' 
            }}>
              
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: 'clamp(20px, 3.5vw, 26px)', fontWeight: '900', color: '#047857' }}>
                  مرحباً بكم في صرح الشروق التعليمي 🏫
                </h2>
                <p style={{ margin: '0 auto 10px auto', fontSize: '13.5px', color: '#475569', maxWidth: '650px', fontWeight: '600' }}>
                  بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #fde68a' }}>✨ توكل نجاح تفوق</span>
                  <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #a7f3d0' }}>📚 المنهج السوداني المطور</span>
                </div>
              </div>

              {/* مجلس الإدارة */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px 15px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#0f172a', fontSize: '15px', fontWeight: '800' }}>🏛️ مجلس إدارة المدرسة</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', width: '100%' }}>
                  <div style={cleanCardStyle('#f59e0b')}>
                    <img src="manager1.png" alt="رئيس مجلس الإدارة" onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={cleanAvatarStyle('#f59e0b')} />
                    <span style={cleanBadgeStyle('#b45309', '#fef3c7', '#fde68a')}>رئيس مجلس الإدارة</span>
                    <h5 style={cleanNameStyle}>الأستاذ كمال الدين مجذوب</h5>
                  </div>

                  <div style={cleanCardStyle('#ec4899')}>
                    <img src="mother.png" alt="الأم التربوية" onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={cleanAvatarStyle('#ec4899')} />
                    <span style={cleanBadgeStyle('#be185d', '#fce7f3', '#fbcfe8')}>الأم التربوية</span>
                    <h5 style={cleanNameStyle}>ماما هند عبد الرازق</h5>
                  </div>

                  <div style={cleanCardStyle('#10b981')}>
                    <img src="admin_manager.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={cleanAvatarStyle('#10b981')} />
                    <span style={cleanBadgeStyle('#047857', '#d1fae5', '#a7f3d0')}>المدير العام</span>
                    <h5 style={cleanNameStyle}>الأستاذ محمد كمال الدين</h5>
                  </div>

                  <div style={cleanCardStyle('#8b5cf6')}>
                    <img src="admin_manager2.png" alt="مديرة إدارية" onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={cleanAvatarStyle('#8b5cf6')} />
                    <span style={cleanBadgeStyle('#6d28d9', '#ede9fe', '#ddd6fe')}>مديرة إدارية</span>
                    <h5 style={cleanNameStyle}>الأستاذة لينا كمال الدين</h5>
                  </div>
                </div>
              </div>

            </div>

            {/* متفوقو الابتدائي (5 طلاب ثابتين) */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ color: '#f59e0b', margin: 0, fontWeight: '900', fontSize: 'clamp(16px, 3vw, 19px)' }}>🏆 متفوقو المرحلة الابتدائية (الأوائل 5)</h3>
              </div>
              {renderFixedSlots(primaryTopStudents, 5, 'مكان شاغر', 'primary_top', '#fffbe6', '#fef08a', '#f59e0b')}
            </div>

            {/* متفوقو المتوسطة (5 طلاب ثابتين) */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: 'clamp(16px, 3vw, 19px)' }}>🎓 متفوقو المرحلة المتوسطة (الأوائل 5)</h3>
              </div>
              {renderFixedSlots(middleTopStudents, 5, 'مكان شاغر', 'middle_top', '#ecfdf5', '#a7f3d0', '#047857')}
            </div>

            {/* هيئة التدريس (20 معلماً ثابتين مع تفعيل التعديل والإضافة) */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: 'clamp(16px, 3vw, 19px)' }}>👨‍🏫 كادر هيئة التدريس (20 معلماً)</h3>
              </div>
              {renderFixedSlots(teachersList, 20, 'معلم', 'teacher', '#f8fafc', '#cbd5e1', '#0284c7')}
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

        {/* الأقسام الداخلية */}
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

      {/* مودال التعديل / الإضافة */}
      {editingItem && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleSaveEdit} style={modalBoxStyle}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '15px' }}>{editType === 'teacher' ? 'تعديل بيانات المعلم' : 'تعديل بيانات المتفوق'}</h4>
            
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>الاسم:</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} required />

            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>{editType === 'teacher' ? 'المادة الدراسية:' : 'الدرجة المحرزة:'}</label>
            <input type="text" value={editExtra} onChange={e => setEditExtra(e.target.value)} style={inputStyle} required />

            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>رابط الصورة:</label>
            <input type="text" value={editImage} onChange={e => setEditImage(e.target.value)} style={inputStyle} placeholder="https://..." />

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '8px', background: '#047857', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>حفظ التعديل</button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ flex: 1, padding: '8px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* مودال إضافة خبر */}
      {showAddNewsModal && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleAddNews} style={modalBoxStyle}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '15px' }}>إضافة خبر / إعلان جديد</h4>
            <input type="text" placeholder="عنوان الخبر" value={newNewsTitle} onChange={e => setNewNewsTitle(e.target.value)} style={inputStyle} required />
            <textarea placeholder="تفاصيل الخبر" value={newNewsContent} onChange={e => setNewNewsContent(e.target.value)} style={{ ...inputStyle, minHeight: '70px' }} required />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '8px', background: '#047857', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>حفظ الخبر</button>
              <button type="button" onClick={() => setShowAddNewsModal(false)} style={{ flex: 1, padding: '8px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* مودال الدخول */}
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

      {/* 🌟 التذييل الزجاجي العصري 🌟 */}
      <footer className="glass-footer" style={{ textAlign: 'center', padding: '16px 12px', marginTop: 'auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.6)', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(4, 120, 87, 0.2)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <span style={{ color: '#047857', fontSize: '13px', fontWeight: '700' }}>✨ تصميم وتطوير:</span>
          <span style={{ color: '#d97706', fontSize: '13.5px', fontWeight: '900', letterSpacing: '0.3px' }}>الأستاذ عثمان صديق ( أبو حلا )</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <a href="tel:01149169346" style={{ color: '#059669', textDecoration: 'none', fontSize: '13px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            📱 <span>01149169346</span>
          </a>
        </div>
      </footer>

    </div>
  );
}

// 🎨 الأنماط المساعدة
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

const cleanCardStyle = (accentColor) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '16px 10px',
  textAlign: 'center',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderTop: `4px solid ${accentColor}`
});

const cleanAvatarStyle = (borderColor) => ({
  width: '85px',
  height: '85px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `3px solid ${borderColor}`,
  marginBottom: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
});

const cleanBadgeStyle = (textColor, bgColor, borderColor) => ({
  backgroundColor: bgColor,
  color: textColor,
  padding: '3px 10px',
  borderRadius: '12px',
  fontSize: '11px',
  fontWeight: 'bold',
  marginBottom: '6px',
  border: `1px solid ${borderColor}`
});

const cleanNameStyle = {
  margin: 0,
  fontSize: '13px',
  color: '#0f172a',
  fontWeight: '800'
};

const cardInfoStyle = (borderColor) => ({
  background: '#ffffff',
  padding: '16px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  border: '1px solid #e2e8f0',
  borderTop: `4px solid ${borderColor}`
});

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(3px)'
};

const modalBoxStyle = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '16px',
  width: '90%',
  maxWidth: '380px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  position: 'relative'
};

const inputStyle = {
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '12px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
