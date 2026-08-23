import React, { useState } from 'react';

// قائمة المواد الصافية والموحدة بدون تكرار
const pureSubjectsList = [
  "التربية الإسلامية",
  "التربية المسيحية",
  "اللغة العربية",
  "الرياضيات",
  "اللغة الإنجليزية",
  "العلوم",
  "التاريخ",
  "الجغرافيا",
  "تكنولوجيا المعلومات والحاسوب",
  "الرياضيات المتقدمة",
  "اللغة الإنجليزية المتقدمة",
  "العلوم والتقنية العامة",
  "الدراسات الاجتماعية والوطنية",
  "التربية الوطنية",
  "الفيزياء",
  "الكيمياء",
  "الأحياء",
  "علوم الحاسوب",
  "العلوم الهندسية",
  "العلوم الإضافية والمواد الأدبية الأخرى"
];

export default function AddTeacherModal({ isOpen, onClose, onSave }) {
  const [teacherName, setTeacherName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState(pureSubjectsList[0]);
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherStatus, setTeacherStatus] = useState('نشط');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teacherName.trim()) return;

    onSave({
      name: teacherName.trim(),
      subject: teacherSubject,
      phone: teacherPhone.trim(),
      status: teacherStatus
    });

    // إعادة ضبط الحقول
    setTeacherName('');
    setTeacherPhone('');
    setTeacherSubject(pureSubjectsList[0]);
    setTeacherStatus('نشط');
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      {/* النافذة المنبثقة بتصميم زجاجي */}
      <div style={glassCardStyle} onClick={(e) => e.stopPropagation()}>
        
        {/* زر الإغلاق الأنيق (X) */}
        <button onClick={onClose} style={closeButtonStyle}>✕</button>

        {/* رأس النافذة */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={iconBadgeStyle}>👨‍🏫</div>
          <h3 style={titleStyle}>إضافة معلم جديد</h3>
          <p style={subtitleStyle}>أدخل بيانات المعلم والتخصص لإدراجه في النظام</p>
        </div>

        {/* نموذج البيانات */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* حقل اسم المعلم */}
          <div>
            <label style={labelStyle}>
              <span>👤</span> اسم المعلم بالكامل:
            </label>
            <input 
              type="text" 
              placeholder="مثال: د. أحمد عبد الله"
              value={teacherName} 
              onChange={(e) => setTeacherName(e.target.value)} 
              required 
              style={inputStyle} 
            />
          </div>

          {/* حقل التخصص */}
          <div>
            <label style={labelStyle}>
              <span>📚</span> المادة والتخصص الدراسي:
            </label>
            <div style={{ position: 'relative' }}>
              <select 
                value={teacherSubject} 
                onChange={(e) => setTeacherSubject(e.target.value)} 
                style={selectStyle}
              >
                {pureSubjectsList.map(sub => (
                  <option key={sub} value={sub} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* حقل رقم الهاتف */}
          <div>
            <label style={labelStyle}>
              <span>📞</span> رقم الهاتف:
            </label>
            <input 
              type="tel" 
              placeholder="01XXXXXXXXX"
              value={teacherPhone} 
              onChange={(e) => setTeacherPhone(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          {/* حقل حالة الدوام */}
          <div>
            <label style={labelStyle}>
              <span>⚡</span> حالة الدوام:
            </label>
            <select 
              value={teacherStatus} 
              onChange={(e) => setTeacherStatus(e.target.value)} 
              style={selectStyle}
            >
              <option value="نشط" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>🟢 نشط (على رأس العمل)</option>
              <option value="إجازة" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>🟡 في إجازة</option>
            </select>
          </div>

          {/* أزرار الإجراءات */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={cancelButtonStyle}
            >
              إلغاء
            </button>

            <button 
              type="submit" 
              style={saveButtonStyle}
            >
              حفظ البيانات ✨
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 💎 التنسيقات العصرية والتأثيرات الزجاجية (Glassmorphism Styles)
// ----------------------------------------------------

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  display: 'flex',
  justify: 'center',
  alignItems: 'center',
  zIndex: 3000,
  direction: 'rtl',
  padding: '16px'
};

const glassCardStyle = {
  position: 'relative',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  padding: '32px 28px',
  borderRadius: '24px',
  width: '100%',
  maxWidth: '460px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
};

const closeButtonStyle = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  background: 'rgba(0, 0, 0, 0.05)',
  border: 'none',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64748b',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: 'all 0.2s'
};

const iconBadgeStyle = {
  width: '56px',
  height: '56px',
  margin: '0 auto 12px auto',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
  color: '#fff'
};

const titleStyle = {
  margin: 0,
  color: '#0f172a',
  fontWeight: '800',
  fontSize: '20px'
};

const subtitleStyle = {
  margin: '4px 0 0 0',
  color: '#64748b',
  fontSize: '13px',
  fontWeight: '500'
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: '700',
  fontSize: '13px',
  color: '#334155',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  fontSize: '14px',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  transition: 'all 0.2s ease-in-out'
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%2364748b" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'left 14px center'
};

const cancelButtonStyle = {
  flex: '1',
  backgroundColor: 'rgba(241, 245, 249, 0.8)',
  color: '#475569',
  border: '1px solid #cbd5e1',
  padding: '12px',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '14px',
  transition: 'all 0.2s'
};

const saveButtonStyle = {
  flex: '2',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: '#ffffff',
  border: 'none',
  padding: '12px',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '14px',
  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)',
  transition: 'all 0.2s'
};
