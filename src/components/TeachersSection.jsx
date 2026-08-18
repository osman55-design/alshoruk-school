import React, { useState, useEffect } from 'react';
import { db } from '../db';
import AddTeacherModal from './AddTeacherModal';

const querySubjectsList = [
  "التربية الإسلامية", "التربية المسيحية", "اللغة العربية", "الرياضيات", "اللغة الإنجليزية",
  "العلوم", "التاريخ", "الجغرافيا", "تكنولوجيا المعلومات والحاسوب", "الرياضيات المتقدمة",
  "اللغة الإنجليزية المتقدمة", "العلوم والتقنية العامة", "الدراسات الاجتماعية والوطنية",
  "التربية الوطنية", "الفيزياء", "الكيمياء", "الأحياء", "علوم الحاسوب", "العلوم الهندسية",
  "العلوم الإضافية والمواد الأدبية الأخرى"
];

export default function TeachersSection() {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuerySection, setShowQuerySection] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);

  useEffect(() => {
    loadTeachersData();
  }, []);

  const loadTeachersData = async () => {
    try {
      // جلب البيانات حياً من تبويب "المعلمين" في جدول جوجل السحابي
      const data = await db.getData("المعلمين");
      setTeachers(data || []);
    } catch (error) {
      console.error("فشل تحميل بيانات المعلمين من السحابة:", error);
    }
  };

  const handleSaveTeacher = async (teacherData) => {
    try {
      const newTeacher = {
        ...teacherData,
        id: Date.now(), // تعيين معرف فريد للمعلم
        createdAt: new Date().toLocaleDateString('ar-EG')
      };

      // حفظ المعلم مباشرة في سحابة جوجل تلقائياً
      const result = await db.insertData("المعلمين", newTeacher);
      
      if (result && result.status !== "error") {
        await loadTeachersData(); // إعادة تحديث القائمة السحابية فوراً
        setIsModalOpen(false);
        alert("تم حفظ بيانات المعلم بنجاح في قاعدة البيانات وتحديث السجل السحابي 💾");
      } else {
        alert("حدث خطأ أثناء محاولة الحفظ في سحابة جوجل.");
      }
    } catch (error) {
      alert("حدث خطأ أثناء حفظ البيانات والاتصال بالسحابة");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المعلم؟")) {
      // الحذف محلياً لتحديث الواجهة فوراً لحين ربط حذفه من السطر بالجدول
      setTeachers(prev => prev.filter(t => t.id !== id));
      alert("تم الحذف بنجاح من الشاشة المزامنة.");
    }
  };

  const getTeacherCount = (subjectName) => {
    return teachers.filter(t => String(t.subject) === subjectName).length;
  };

  const displayedTeachers = activeSubject 
    ? teachers.filter(t => String(t.subject) === activeSubject)
    : teachers;

  return (
    <div className="section-container" style={{ padding: '30px 20px', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      
      {/* صف الأزرار الرئيسي لإدارة قسم المعلمين */}
      <div className="main-buttons-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px', marginTop: '20px' }}>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '15px 35px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          ➕ إضافة معلم جديد
        </button>

        <button 
          onClick={() => setShowQuerySection(!showQuerySection)}
          style={{ padding: '15px 35px', cursor: 'pointer', backgroundColor: showQuerySection ? '#dc3545' : '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          {showQuerySection ? '❌ إغلاق شاشة الفرز والمواد' : '🔍 فتح فرز المعلمين حسب المادة'}
        </button>
      </div>

      {/* قسم التصفية حسب المادة الأكاديمية والجدول التفاعلي */}
      {showQuerySection && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, color: '#1e3a8a', marginBottom: '20px' }}>🔍 تصفية المعلمين حسب التخصص والمواد</h3>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
            <button 
              onClick={() => setActiveSubject(null)}
              style={{ padding: '8px 15px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: activeSubject === null ? '#1e3a8a' : '#fff', color: activeSubject === null ? '#fff' : '#333', fontWeight: 'bold' }}
            >
              الكل ({teachers.length})
            </button>
            {querySubjectsList.map((sub, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveSubject(sub)}
                style={{ padding: '8px 15px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: activeSubject === sub ? '#1e3a8a' : '#fff', color: activeSubject === sub ? '#fff' : '#333' }}
              >
                {sub} ({getTeacherCount(sub)})
              </button>
            ))}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }} border="1" cellPadding="10" borderColor="#e5e7eb">
            <thead>
              <tr style={{ backgroundColor: '#1e3a8a', color: '#fff' }}>
                <th>اسم المعلم كاملاً</th>
                <th>المادة الأساسية</th>
                <th>رقم الهاتف</th>
                <th>إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody>
              {displayedTeachers.length > 0 ? displayedTeachers.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '15px' }}>{t.name}</td>
                  <td style={{ color: '#d97706', fontWeight: 'bold' }}>{t.subject}</td>
                  <td>{t.phone || 'غير مسجل'}</td>
                  <td>
                    <button onClick={() => handleDelete(t.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>حذف 🗑️</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', color: '#888', fontStyle: 'italic' }}>لا يوجد معلمين مقيدين في هذا التخصص حالياً بسحابة جوجل.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* المودال المنبثق لإضافة المعلم */}
      {isModalOpen && (
        <AddTeacherModal onSave={handleSaveTeacher} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
