import React, { useState } from 'react';

export default function AddStudentModal({ onClose, onSave, classOptions }) {
  const [studentName, setStudentName] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  
  // تحديث القيمة الافتراضية برمجياً لتتوافق مع بداية خيارات فصولك المقترحة
  const [studentClass, setStudentClass] = useState(
    classOptions && classOptions[0] ? classOptions[0].items[0] : 'الأول ابتدائي'
  );
  
  const [studentGender, setStudentGender] = useState('ذكور');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentWhatsapp, setStudentWhatsapp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    onSave({
      name: studentName.trim(),
      address: studentAddress.trim(),
      class: studentClass,
      gender: studentGender,
      phone: studentPhone.trim(),
      whatsapp: studentWhatsapp.trim()
    });
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
      <div className="modal-content" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', direction: 'rtl' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#007bff' }}>نافذة إضافة طالب جديدة</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>اسم الطالب ثلاثي:</label>
            <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>السكن:</label>
            <input type="text" value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', textAlign: 'right' }}>الفصل الدراسي:</label>
                <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  {classOptions.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', textAlign: 'right' }}>الجنس:</label>
                <select value={studentGender} onChange={(e) => setStudentGender(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="ذكور">ذكور (بنين)</option>
                  <option value="إناث">إناث (بنات)</option>
                </select>
              </div>
            </div>

            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>رقم الهاتف:</label>
            <input type="tel" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>رقم واتس:</label>
            <input type="tel" value={studentWhatsapp} onChange={(e) => setStudentWhatsapp(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>إلغاء</button>
              <button type="submit" style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ البيانات</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
