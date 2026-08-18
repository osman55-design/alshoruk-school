import React, { useState } from 'react';

// قائمة المواد الصافية والموحدة بدون تكرار أو كتابة المرحلة بجانبها
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

    // تصفير النموذج وإعادة الافتراضيات
    setTeacherName('');
    setTeacherPhone('');
    setTeacherSubject(pureSubjectsList[0]);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, direction: 'rtl' }}>
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', fontFamily: 'Arial, sans-serif' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#007bff' }}>إضافة معلم جديد</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>اسم المعلم بالكامل:</label>
            <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>المادة والتخصص الدراسي:</label>
            <select value={teacherSubject} onChange={(e) => setTeacherSubject(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
              {pureSubjectsList.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>رقم الهاتف:</label>
            <input type="tel" value={teacherPhone} onChange={(e) => setTeacherPhone(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>حالة الدوام:</label>
            <select value={teacherStatus} onChange={(e) => setTeacherStatus(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="نشط">نشط (على رأس العمل)</option>
              <option value="إجازة">في إجازة</option>
            </select>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>إلغاء</button>
              <button type="submit" style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ البيانات</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
