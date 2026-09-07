import React from 'react';

export default function LandingPage({
  newsList = [],
  boardList = [],
  primaryTopStudents = [],
  middleTopStudents = [],
  teachersList = [],
  currentUser = null,
  setShowAddNewsModal,
  openEditModal,
  handleDeleteBoardMember,
  renderFixedSlots,
  cardInfoStyle,
  cleanCardStyle,
  cleanAvatarStyle,
  cleanBadgeStyle,
  cleanNameStyle,
  modalOverlayStyle,
  modalBoxStyle,
  inputStyle,
  editingItem,
  setEditingItem,
  editType,
  editName,
  setEditName,
  editExtra,
  setEditExtra,
  editImage,
  setEditImage,
  handleSaveEdit,
  showAddNewsModal,
  newNewsTitle,
  setNewNewsTitle,
  newNewsContent,
  setNewNewsContent,
  handleAddNews,
  showLoginModal,
  setShowLoginModal,
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  loading
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* الشريط العلوي العصري (Navbar) مع زر بوابة النظام */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 5%',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="logo.png" alt="شعار المدرسة" style={{ width: '40px', height: '40px', borderRadius: '8px' }} onError={(e) => { e.target.src = "https://placehold.co/40"; }} />
          <h1 style={{ margin: 0, fontSize: '18px', color: '#047857', fontWeight: '900' }}>مدرسة الشروق التعليمية</h1>
        </div>

        {/* زر بوابة النظام الرئيسي */}
        <button 
          onClick={() => setShowLoginModal(true)}
          style={{
            background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 22px',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)',
            transition: 'all 0.3s ease'
          }}
        >
          🔑 بوابة النظام
        </button>
      </header>

      {/* الجسم الرئيسي */}
      <main style={{ padding: '20px 3%', flex: '1', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* شريط الإعلانات العصري */}
          <div className="ticker-wrap" style={{ borderRadius: '12px', overflow: 'hidden' }}>
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
                  </span>
                ))}
              </div>
            </div>
            {currentUser && (
              <button onClick={() => setShowAddNewsModal(true)} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap', marginLeft: '8px', borderRadius: '10px' }}>+ خبر</button>
            )}
          </div>

          {/* البنّر ومجلس الإدارة */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '28px 24px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
            border: '1px solid #e2e8f0',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: '900', color: '#047857' }}>
                مرحباً بكم في صرح الشروق التعليمي 🏫
              </h2>
              <p style={{ margin: '0 auto 14px auto', fontSize: '14px', color: '#475569', maxWidth: '650px', fontWeight: '600', lineHeight: '1.6' }}>
                بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #fde68a' }}>✨ توكل نجاح تفوق</span>
                <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #a7f3d0' }}>📚 المنهج السوداني المطور</span>
              </div>
            </div>

            {/* قسم مجلس إدارة المدرسة الديناميكي */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px 18px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{ color: '#0f172a', fontSize: '16px', fontWeight: '800' }}>🏛️ مجلس إدارة المدرسة</span>
                {currentUser && (
                  <button onClick={() => openEditModal('board', null, boardList.length)} style={{ padding: '6px 14px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                    + عضو إدارة
                  </button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', width: '100%' }}>
                {boardList.map((member, index) => (
                  <div key={member.id || index} style={cleanCardStyle(member.color || '#047857')}>
                    <img src={member.image || member.image_url || 'https://placehold.co/150'} alt={member.name} onError={(e) => { e.target.src = "https://placehold.co/150"; }} style={cleanAvatarStyle(member.color || '#047857')} />
                    <span style={cleanBadgeStyle(member.color || '#047857', member.bg || '#d1fae5', member.border || '#a7f3d0')}>{member.role}</span>
                    <h5 style={cleanNameStyle}>{member.name}</h5>

                    {currentUser && (
                      <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: '10px' }}>
                        <button onClick={() => openEditModal('board', member, index)} style={{ flex: 1, padding: '4px', background: '#047857', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>✏️ تعديل</button>
                        <button onClick={() => handleDeleteBoardMember(member.id)} style={{ padding: '4px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>🗑️</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* المتفوقين في الابتدائي */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ color: '#f59e0b', margin: 0, fontWeight: '900', fontSize: 'clamp(17px, 3vw, 20px)' }}>🏆 المتفوقين في امتحان الشهادة الابتدائية</h3>
            </div>
            {renderFixedSlots(primaryTopStudents, 5, 'مكان شاغر', 'primary_top', '#fffbe6', '#fef08a', '#f59e0b')}
          </div>

          {/* المتفوقين في المتوسط */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: 'clamp(17px, 3vw, 20px)' }}>🎓 المتفوقين في امتحان الشهادة المتوسطة</h3>
            </div>
            {renderFixedSlots(middleTopStudents, 5, 'مكان شاغر', 'middle_top', '#ecfdf5', '#a7f3d0', '#047857')}
          </div>

          {/* هيئة التدريس */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: 'clamp(17px, 3vw, 20px)' }}>👨‍🏫 كادر هيئة التدريس (20 معلماً)</h3>
            </div>
            {renderFixedSlots(teachersList, 20, 'معلم', 'teacher', '#f8fafc', '#cbd5e1', '#0284c7')}
          </div>

          {/* بطاقات التعريف */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={cardInfoStyle('#047857')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px' }}>📖</span>
                <h4 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '17px' }}>مَن نحن؟</h4>
              </div>
              <p style={{ color: '#064e3b', lineHeight: '1.7', fontSize: '13.5px', margin: 0, fontWeight: '600' }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة عالية عبر جميع المراحل.</p>
            </div>

            <div style={cardInfoStyle('#065f46')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px' }}>🎯</span>
                <h4 style={{ color: '#065f46', margin: 0, fontWeight: '900', fontSize: '17px' }}>أهدافنا ورسالتنا</h4>
              </div>
              <ul style={{ color: '#064e3b', lineHeight: '1.7', fontSize: '13px', paddingRight: '18px', margin: 0, fontWeight: '600' }}>
                <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة.</li>
                <li>تعزيز القيم الأخلاقية والوطنية الراسخة في الطلاب.</li>
              </ul>
            </div>

            <div style={cardInfoStyle('#f59e0b')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px' }}>💼</span>
                <h4 style={{ color: '#f59e0b', margin: 0, fontWeight: '900', fontSize: '17px' }}>الحلول الرقمية الذكية</h4>
              </div>
              <p style={{ color: '#064e3b', lineHeight: '1.7', fontSize: '13.5px', margin: 0, fontWeight: '600' }}>بوابة إلكترونية متتقدمة تتضمن لوحة تحكم سحابية مخصصة لإدارة شؤون الطلاب، المعلمين، الحسابات، والنتائج بسهولة وموثوقية.</p>
            </div>
          </div>

        </div>
      </main>

      {/* مودالات التعديل والدخول */}
      {editingItem && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleSaveEdit} style={modalBoxStyle}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '16px', fontWeight: 'bold' }}>
              {editType === 'teacher' ? 'تعديل بيانات المعلم' : editType === 'board' ? 'تعديل عضو مجلس الإدارة' : 'تعديل بيانات المتفوق'}
            </h4>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>الاسم:</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} required />
            
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {editType === 'teacher' ? 'المادة الدراسية:' : editType === 'board' ? 'المسمى الوظيفي / الصفة:' : 'الدرجة المحرزة:'}
            </label>
            <input type="text" value={editExtra} onChange={e => setEditExtra(e.target.value)} style={inputStyle} required />
            
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>اسم أو رابط الصورة:</label>
            <input type="text" value={editImage} onChange={e => setEditImage(e.target.value)} style={inputStyle} placeholder="manager1.png أو https://..." />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>حفظ التعديل</button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {showAddNewsModal && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleAddNews} style={modalBoxStyle}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '16px', fontWeight: 'bold' }}>إضافة خبر / إعلان جديد</h4>
            <input type="text" placeholder="عنوان الخبر" value={newNewsTitle} onChange={e => setNewNewsTitle(e.target.value)} style={inputStyle} required />
            <textarea placeholder="تفاصيل الخبر" value={newNewsContent} onChange={e => setNewNewsContent(e.target.value)} style={{ ...inputStyle, minHeight: '80px' }} required />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>حفظ الخبر</button>
              <button type="button" onClick={() => setShowAddNewsModal(false)} style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {showLoginModal && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleLogin} style={{ ...modalBoxStyle, borderTop: '5px solid #f59e0b', borderRadius: '16px' }}>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '14px', left: '14px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            <h3 style={{ textAlign: 'center', color: '#047857', margin: '0 0 6px 0', fontSize: '20px', fontWeight: '900' }}>تسجيل دخول الإدارة</h3>
            <p style={{ textAlign: 'center', color: '#475569', fontSize: '12px', margin: '0 0 18px 0', fontWeight: 'bold' }}>الوصول الآمن لنظام مدرسة الشروق</p>
            <div style={{ marginBottom: '14px' }}>
              <input type="text" placeholder="اسم الدخول المخصص" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} required />
            </div>
            <div style={{ marginBottom: '18px' }}>
              <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #047857 0%, #10b981 100%)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              {loading ? "جاري الدخول..." : "دخول النظام 🔓"}
            </button>
          </form>
        </div>
      )}

      {/* التذييل الزجاجي */}
      <footer className="glass-footer" style={{ textAlign: 'center', padding: '18px 12px', marginTop: 'auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.7)', padding: '8px 24px', borderRadius: '30px', border: '1px solid rgba(4, 120, 87, 0.2)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <span style={{ color: '#047857', fontSize: '13px', fontWeight: '700' }}>✨ تصميم وتطوير:</span>
          <span style={{ color: '#d97706', fontSize: '13.5px', fontWeight: '900', letterSpacing: '0.3px' }}>الأستاذ عثمان صديق ( أبو حلا )</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <a href="tel:01149169346" style={{ color: '#047857', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>📱 01149169346</a>
        </div>
      </footer>

    </div>
  );
}
