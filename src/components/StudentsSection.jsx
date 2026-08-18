import React, { useState, useEffect } from 'react';
import { db } from '../db';
import AddStudentModal from './AddStudentModal'; 

export default function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuerySection, setShowQuerySection] = useState(false);

  const [selectedViewClass, setSelectedViewClass] = useState('الثالث ثانوي - المساق العلمي');
  const [selectedViewGender, setSelectedViewGender] = useState('ذكور');

  useEffect(() => {
    loadStudentsData();
  }, []);

  const loadStudentsData = async () => {
    try {
      const data = await db.getData("الطلاب");
      setStudents(data || []);
    } catch (error) {
      console.error("فشل تحميل البيانات من السحابة:", error);
    }
  };

  const handleSaveStudent = async (newStudent) => {
    try {
      const result = await db.insertData("الطلاب", newStudent);
      if (result && result.status !== "error") {
        await loadStudentsData();
        setIsModalOpen(false);
        alert("تم حفظ بيانات الطالب بنجاح في قاعدة البيانات وتحديث المساق الدراسي السحابي 💾");
      } else {
        alert("حدث خطأ أثناء محاولة الحفظ في سحابة جوجل.");
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاتصال بالسيرفر السحابي");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      alert("تم الحذف بنجاح من الشاشة المزامنة.");
    }
  };

  const displayedStudents = students.filter(s => 
    String(s.class) === selectedViewClass && String(s.gender) === selectedViewGender
  );

  const classOptions = [
    { group: "المرحلة الابتدائية", items: ["الأول ابتدائي", "الثاني ابتدائي", "الثالث ابتدائي", "الرابع ابتدائي", "الخامس ابتدائي", "السادس ابتدائي"] },
    { group: "المرحلة المتوسطة", items: ["الأول متوسط", "الثاني متوسط", "الثالث متوسط"] },
    { group: "المرحلة الثانوية", items: ["الأول ثانوي", "الثاني ثانوي", "الثالث ثانوي - المساق العلمي", "الثالث ثانوي - المساق الأدبي"] }
  ];

  return (
    <div className="section-container" style={{ padding: '30px 20px', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      <div className="main-buttons-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px', marginTop: '20px' }}>
        <button onClick={() => setIsModalOpen(true)} style={{ padding: '15px 35px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          ➕ إضافة طالب جديد
        </button>
        <button onClick={() => setShowQuerySection(!showQuerySection)} style={{ padding: '15px 35px', cursor: 'pointer', backgroundColor: showQuerySection ? '#dc3545' : '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {showQuerySection ? '❌ إغلاق شاشة الاستعلام' : '🔍 فتح شاشة الاستعلام والفرز'}
        </button>
      </div>

      {showQuerySection && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, color: '#1e3a8a', marginBottom: '20px' }}>🔍 فلترة وبحث مخصص في قوائم الطلاب</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>اختر الصف الدراسي:</label>
              <select value={selectedViewClass} onChange={(e) => setSelectedViewClass(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                {classOptions.map((g, idx) => (
                  <optgroup key={idx} label={g.group}>
                    {g.items.map((item, i) => <option key={i} value={item}>{item}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>النوع:</label>
              <select value={selectedViewGender} onChange={(e) => setSelectedViewGender(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="ذكور">👦 بنين</option>
                <option value="إناث">👧 بنات</option>
              </select>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }} border="1" cellPadding="10" borderColor="#e5e7eb">
            <thead>
              <tr style={{ backgroundColor: '#1e3a8a', color: '#fff' }}>
                <th>اسم الطالب كاملاً</th>
                <th>الفصل الدراسي</th>
                <th>الجنس</th>
                <th>إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.length > 0 ? displayedStudents.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '15px' }}>{s.name}</td>
                  <td style={{ color: '#d97706', fontWeight: 'bold' }}>{s.class}</td>
                  <td>{s.gender === 'ذكور' ? '👦 بنين' : '👧 بنات'}</td>
                  <td>
                    <button onClick={() => handleDelete(s.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>حذف 🗑️</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', color: '#888', fontStyle: 'italic' }}>لا يوجد طلاب مقيدين في هذا البحث حالياً بسحابة جوجل.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <AddStudentModal classOptions={classOptions} onSave={handleSaveStudent} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
