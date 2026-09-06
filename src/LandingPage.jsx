import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ currentUser, onLoginSuccess, onOpenAdmin, onLogout }) {
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------------- بيانات الأخبار ----------------
  const [newsList, setNewsList] = useState([]);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');

  // ---------------- بيانات مجلس الإدارة ----------------
  const [boardList, setBoardList] = useState([]);

  // ---------------- بيانات المتفوقين ----------------
  const [primaryTopStudents, setPrimaryTopStudents] = useState([]);
  const [middleTopStudents, setMiddleTopStudents] = useState([]);

  // ---------------- بيانات هيئة التدريس ----------------
  const [teachersList, setTeachersList] = useState([]);

  // ---------------- حالات التعديل السريع ----------------
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('');
  const [editName, setEditName] = useState('');
  const [editExtra, setEditExtra] = useState('');
  const [editImage, setEditImage] = useState('');

  useEffect(() => {
    fetchNews();
    fetchBoardMembers();
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

  const fetchBoardMembers = async () => {
    try {
      const { data } = await supabase.from('board_members').select('*').order('id', { ascending: true });
      if (data && data.length > 0) {
        setBoardList(data);
      } else {
        setBoardList([
          { id: 1, name: 'الأستاذ كمال الدين مجذوب', role: 'رئيس مجلس الإدارة', image: 'manager1.png', color: '#0f766e', bg: '#ccfbf1', border: '#99f6e4' },
          { id: 2, name: 'ماما هند عبد الرازق', role: 'الأم التربوية', image: 'mother.png', color: '#be185d', bg: '#fce7f3', border: '#fbcfe8' },
          { id: 3, name: 'الأستاذ محمد كمال الدين', role: 'المدير العام', image: 'admin_manager.png', color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' },
          { id: 4, name: 'الأستاذة لينا كمال الدين', role: 'مديرة إدارية', image: 'admin_manager2.png', color: '#6d28d9', bg: '#ede9fe', border: '#ddd6fe' }
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

        const stages = {
          preschool: user.stage_preschool ?? true,
          primary: user.stage_primary ?? true,
          middle: user.stage_middle ?? true,
          secondary: user.stage_secondary ?? true,
        };

        const userData = {
          id: user.id,
          name: user.full_name || 'حنين عثمان',
          role: user.role,
          permissions: permissions,
          stages: stages
        };

        setShowLoginModal(false);
        onLoginSuccess(userData);

      } else {
        alert('اسم المستخدم أو رمز الدخول غير صحيح!');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالنظام!');
    } finally {
      setLoading(false);
    }
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
    setEditExtra(
      type === 'teacher' 
        ? (item?.subject || '') 
        : type === 'board' 
        ? (item?.role || '') 
        : (item?.score || '')
    );
    setEditImage(item?.image || item?.image_url || '');
  };

  const handleDeleteBoardMember = async (id) => {
    if (!window.confirm('هل أنت تأكد من رغبتك في حذف هذا العضو؟')) return;
    try {
      await supabase.from('board_members').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
    setBoardList(boardList.filter(b => b.id !== id));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (editType === 'board') {
      const updatedMember = {
        name: editName,
        role: editExtra,
        image: editImage || 'manager1.png',
        color: '#0f766e',
        bg: '#ccfbf1',
        border: '#99f6e4'
      };

      try {
        if (editingItem.id && !editingItem.isNew) {
          await supabase.from('board_members').update(updatedMember).eq('id', editingItem.id);
        } else {
          const { data } = await supabase.from('board_members').insert([updatedMember]).select();
          if (data && data[0]) updatedMember.id = data[0].id;
        }
      } catch (err) {
        console.error(err);
      }

      const list = [...boardList];
      const idx = list.findIndex(b => b.id === editingItem.id);
      if (idx >= 0) list[idx] = { ...list[idx], ...updatedMember };
      else list.push(updatedMember);
      setBoardList(list);

    } else if (editType === 'primary_top' || editType === 'middle_top') {
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

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalBoxStyle = {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    position: 'relative'
  };

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #cbd5e1',
    fontSize: '13px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border 0.2s'
  };

  const renderFixedSlots = (dataList, totalSlots, typeLabel, editTypeTag, cardBg, borderColor, badgeBg) => {
    const slots = Array.from({ length: totalSlots }, (_, index) => dataList[index] || null);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
        {slots.map((item, index) => (
          <div key={index} style={{ 
            background: cardBg, 
            border: `1.5px solid ${borderColor}`, 
            borderRadius: '16px', 
            padding: '14px 10px', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)'
          }}>
            {item ? (
              <>
                <img src={item.image || item.image_url || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: '64px', height: '64px', borderRadius: '50%', border: `3px solid ${badgeBg}`, marginBottom: '8px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} />
                <h5 style={{ margin: '0 0 4px 0', color: '#0f172a', fontWeight: '800', fontSize: '12px' }}>{item.name}</h5>
                {editTypeTag === 'teacher' ? (
                  <span style={{ color: '#0f766e', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📖 {item.subject}</span>
                ) : (
                  <span style={{ backgroundColor: badgeBg, color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' }}>{item.score}</span>
                )}
              </>
            ) : (
              <div style={{ padding: '10px 0', opacity: 0.6 }}>
                <div style={{ fontSize: '26px' }}>👤</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginTop: '2px' }}>{typeLabel} #{index + 1}</div>
              </div>
            )}

            {currentUser && (
              <button onClick={() => openEditModal(editTypeTag, item, index)} style={{ marginTop: '8px', width: '100%', padding: '5px', background: badgeBg, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                ✏️ {item ? 'تعديل' : 'إضافة'}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f1f5f9', direction: 'rtl', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      <style>{`
        @keyframes marqueeRTL {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .ticker-wrap {
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(15, 118, 110, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.15);
          margin-bottom: 20px;
          padding: 6px;
        }

        .ticker-title {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 13px;
          white-space: nowrap;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ticker-content-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .ticker-move {
          display: inline-block;
          white-space: nowrap;
          animation: marqueeRTL 25s linear infinite;
          padding-right: 100%;
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
          margin-right: 30px;
          background: rgba(255, 255, 255, 0.12);
          padding: 6px 16px;
          border-radius: 20px;
        }

        .glass-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      {/* الشريط العلوي الهيدر */}
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '12px 5%', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderBottom: '3px solid #f59e0b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="logo.png" alt="الشعار" onError={(e) => { e.target.src = "https://via.placeholder.com/100"; }} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #f59e0b', objectFit: 'cover' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: 'clamp(16px, 3.5vw, 21px)', letterSpacing: '0.5px' }}>مدرسة الشروق السودانية</span>
            <span style={{ color: '#f59e0b', fontSize: 'clamp(10px, 2.2vw, 12px)', fontWeight: 'bold' }}>روضة | ابتدائي | متوسط | ثانوي</span>
          </div>
        </div>
        
        {!currentUser ? (
          <button style={{ padding: '8px 22px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#f59e0b', color: '#ffffff', fontSize: '13px', boxShadow: '0 4px 14px rgba(245,158,11,0.4)', transition: 'transform 0.2s' }} onClick={() => setShowLoginModal(true)}>🔐 بوابة النظام</button>
        ) : (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#fef08a', fontWeight: 'bold', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}>
              👤 {currentUser?.name || 'حنين عثمان'}
            </span>
            <button onClick={onOpenAdmin} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', backgroundColor: '#0f766e', color: '#ffffff' }}>⚙️ لوحة الإدارة</button>
            <button onClick={onLogout} style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>خروج 🚪</button>
          </div>
        )}
      </header>

      {/* جسم الصفحة الرئيسي */}
      <main style={{ padding: '20px 4%', flex: '1', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* شريط الإعلانات والأخبار */}
          <div className="ticker-wrap">
            <div className="ticker-title">
              <span>آخر الأخبار</span> 📢
            </div>
            <div className="ticker-content-container">
              <div className="ticker-move">
                {newsList.map((news, idx) => (
                  <span key={news.id || idx} className="ticker-item">
                    <span style={{ color: '#f59e0b' }}>[{news.title}]:</span>
                    <span>{news.content}</span>
                  </span>
                ))}
              </div>
            </div>
            {currentUser && (
              <button onClick={() => setShowAddNewsModal(true)} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap', marginLeft: '8px', borderRadius: '8px' }}>+ خبر</button>
            )}
          </div>

          {/* الهيدر الترحيبي مع مجلس الإدارة */}
          <div className="glass-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: '900', color: '#0f172a' }}>
                مرحباً بكم في صرح الشروق التعليمي 🏫
              </h2>
              <p style={{ margin: '0 auto 12px auto', fontSize: '14px', color: '#64748b', maxWidth: '650px', fontWeight: '600' }}>
                بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #fde68a' }}>✨ توكل • نجاح • تفوق</span>
                <span style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #99f6e4' }}>📚 المنهج السوداني المطور</span>
              </div>
            </div>

            {/* مجلس الإدارة */}
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: '#0f172a', fontSize: '16px', fontWeight: '900' }}>🏛️ مجلس إدارة المدرسة</span>
                {currentUser && (
                  <button onClick={() => openEditModal('board', null, boardList.length)} style={{ padding: '6px 14px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                    + عضو إدارة
                  </button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {boardList.map((member, index) => (
                  <div key={member.id || index} style={{
                    background: '#ffffff',
                    border: `1.5px solid ${member.border || '#cbd5e1'}`,
                    borderRadius: '16px',
                    padding: '16px 12px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                  }}>
                    <img src={member.image || member.image_url || 'https://via.placeholder.com/150'} alt={member.name} onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} style={{ width: '70px', height: '70px', borderRadius: '50%', border: `3px solid ${member.color || '#0f766e'}`, marginBottom: '10px', objectFit: 'cover' }} />
                    <span style={{ backgroundColor: member.bg || '#ccfbf1', color: member.color || '#0f766e', border: `1px solid ${member.border || '#99f6e4'}`, padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>{member.role}</span>
                    <h5 style={{ margin: 0, color: '#0f172a', fontWeight: '800', fontSize: '13px' }}>{member.name}</h5>

                    {currentUser && (
                      <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: '10px' }}>
                        <button onClick={() => openEditModal('board', member, index)} style={{ flex: 1, padding: '4px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>✏️ تعديل</button>
                        <button onClick={() => handleDeleteBoardMember(member.id)} style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>🗑️</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* قسم المتفوقين ابتدائي */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ color: '#d97706', margin: '0 0 14px 0', fontWeight: '900', fontSize: '18px' }}>🏆 المتفوقين في امتحان الشهادة الابتدائية</h3>
            {renderFixedSlots(primaryTopStudents, 5, 'مكان شاغر', 'primary_top', '#fffbe6', '#fde68a', '#d97706')}
          </div>

          {/* قسم المتفوقين متوسط */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ color: '#0f766e', margin: '0 0 14px 0', fontWeight: '900', fontSize: '18px' }}>🎓 المتفوقين في امتحان الشهادة المتوسطة</h3>
            {renderFixedSlots(middleTopStudents, 5, 'مكان شاغر', 'middle_top', '#f0fdf4', '#bbf7d0', '#0f766e')}
          </div>

          {/* هيئة التدريس */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ color: '#1e293b', margin: '0 0 14px 0', fontWeight: '900', fontSize: '18px' }}>👨‍🏫 كادر هيئة التدريس (20 معلماً)</h3>
            {renderFixedSlots(teachersList, 20, 'معلم', 'teacher', '#f8fafc', '#cbd5e1', '#2563eb')}
          </div>

        </div>
      </main>

      {/* المودالات والنافذة المنبثقة */}
      {editingItem && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleSaveEdit} style={modalBoxStyle}>
            <h4 style={{ margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '800' }}>
              {editType === 'teacher' ? 'تعديل بيانات المعلم' : editType === 'board' ? 'تعديل عضو مجلس الإدارة' : 'تعديل بيانات المتفوق'}
            </h4>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>الاسم:</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} required />
            
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>
              {editType === 'teacher' ? 'المادة الدراسية:' : editType === 'board' ? 'المسمى الوظيفي:' : 'الدرجة:'}
            </label>
            <input type="text" value={editExtra} onChange={e => setEditExtra(e.target.value)} style={inputStyle} required />
            
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>رابط أو اسم الصورة:</label>
            <input type="text" value={editImage} onChange={e => setEditImage(e.target.value)} style={inputStyle} placeholder="manager1.png أو رابط صريحة" />
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>حفظ التعديل</button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', color: '#475569' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {showAddNewsModal && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleAddNews} style={modalBoxStyle}>
            <h4 style={{ margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '800' }}>إضافة خبر جديد</h4>
            <input type="text" placeholder="عنوان الخبر" value={newNewsTitle} onChange={e => setNewNewsTitle(e.target.value)} style={inputStyle} required />
            <textarea placeholder="تفاصيل الخبر" value={newNewsContent} onChange={e => setNewNewsContent(e.target.value)} style={{ ...inputStyle, minHeight: '80px' }} required />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>حفظ الخبر</button>
              <button type="button" onClick={() => setShowAddNewsModal(false)} style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {showLoginModal && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleLogin} style={{ ...modalBoxStyle, borderTop: '6px solid #f59e0b' }}>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '14px', left: '14px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            <h3 style={{ textAlign: 'center', color: '#0f172a', margin: '0 0 4px 0', fontSize: '18px', fontWeight: '900' }}>تسجيل دخول الإدارة</h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', margin: '0 0 16px 0' }}>الوصول الآمن لنظام مدرسة الشروق</p>
            
            <input type="text" placeholder="اسم الدخول" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
            
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '6px' }}>
              {loading ? "جاري الدخول..." : "دخول النظام 🔓"}
            </button>
          </form>
        </div>
      )}

      {/* التذييل الخفي والتوقيع المدمج للمصممين */}
      <footer style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '20px 15px',
        textAlign: 'center',
        fontSize: '13px',
        borderTop: '1px solid #1e293b',
        marginTop: '30px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div>جميع الحقوق محفوظة © {new Date().getFullYear()} مدرسة الشروق السودانية المتكاملة</div>
          
          {/* توقيع واسم المصممين ورقم التواصل */}
          <div style={{ 
            marginTop: '6px', 
            fontSize: '12px', 
            color: '#f59e0b', 
            fontWeight: 'bold',
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '8px 18px',
            borderRadius: '20px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <span>💻 من تصميم وتطوير:</span>
            <span style={{ color: '#ffffff' }}>أستاذ عثمان صديق (أبو حلا) - 01149169346</span>
            <span>|</span> ✨
          </div>
        </div>
      </footer>

    </div>
  );
}
