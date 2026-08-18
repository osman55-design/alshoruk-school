import React, { useState, useEffect } from 'react';
import { addTeacher, getAllTeachers, deleteTeacher } from '../db';
import AddTeacherModal from './AddTeacherModal';

const querySubjectsList = [
  "التربية الإسلامية", "التربية المسيحية", "اللغة العربية", "الرياضيات", "اللغة الإنجليزية",
  "العلوم", "التاريخ", "الجغرافيا", "تكنولوجيا المعلومات والحاسوب", "الرياضيات المتقدمة",
  "اللغة الإنجليزية المتقدمة", "العلوم والتقنية العامة", "الدراسات الاجتماعية والوطنية",
  "التربية الوطنية", "الفيزياء", "Kيمياء", "الأحياء", "علوم الحاسوب", "العلوم الهندسية",
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
      const data = await getAllTeachers();
      setTeachers(data || []);
    } catch (error) {
      console.error("فشل تحميل بيانات المعلمين:", error);
    }
  };

  const handleSaveTeacher = async (teacherData) => {
    try {
      await addTeacher({
        ...teacherData,
        createdAt: new Date().toISOString()
      });
      await loadTeachersData();
      setIsModalOpen(false);
      alert("تم حفظ بيانات المعلم بنجاح في قاعدة البيانات");
    } catch (error) {
      alert("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المعلم؟")) {
      try {
        await deleteTeacher(id);
        setTeachers(prev => prev.filter(t => t.id !== id));
        if (displayedTeachers.length <= 1) setActiveSubject(null);
      } catch (error) {
        alert("فشل الحذف");
      }
    }
  };

  const getTeacherCount = (subjectName) => {
    return teachers.filter(t => t.subject === subjectName).length;
  };

  const displayedTeachers = teachers.filter(t => t.subject === activeSubject);

  return (
    <div className="section-container" style={{ padding: '30px 20px', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      
      <div className="main-buttons-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px', marginTop: '20px' }}>
        <button 
          style={{ padding: '15px 35px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 10px rgba(40, 167, 69, 0.2)' }}
          onClick={() => setIsModalOpen(true)}
        >
          ➕ إضافة معلم جديد
        </button>

        <button 
          style={{ padding: '15px 35px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)' }}
          onClick={() => {
            setShowQuerySection(!showQuerySection);
            setActiveSubject(null);
          }}
        >
          🔍 {showQuerySection ? "إخفاء لوحة الاستعلام" : "الاستعلام عن معلم"}
        </button>
      </div>

      {showQuerySection && (
        <div className="query-button-dashboard" style={{ borderTop: '2px dashed #ccc', paddingTop: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#007bff', fontWeight: 'bold' }}>قائمة التخصصات والمواد الدراسية:</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
            {querySubjectsList.map(subName => {
              const count = getTeacherCount(subName);
              const isSelected = activeSubject === subName;

              return (
                <button
                  key={subName}
                  onClick={() => setActiveSubject(isSelected ? null : subName)}
                  style={{
                    padding: '12px 15px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#007bff' : '#fff',
                    color: isSelected ? '#fff' : '#333',
                    border: isSelected ? '1px solid #0056b3' : '1px solid #ccc',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>📝 {subName}</span>
                  <span style={{ 
                    backgroundColor: isSelected ? '#fff' : '#eeedf0', 
                    color: isSelected ? '#007bff' : '#555', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }}>
                    {count} معلم
                  </span>
                </button>
              );
            })}
          </div>

          {activeSubject && (
            <div style={{ marginTop: '30px', borderTop: '2px dashed #007bff', paddingTop: '20px' }}>
              <h3 style={{ color: '#222', marginBottom: '15px' }}>
                الطاقم التدريسي لمادة: <span style={{ color: '#007bff' }}>{activeSubject}</span>
              </h3>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                  <tr style={{ backgroundColor: '#343a40', color: '#fff' }}>
                    <th style={{ border: '1px solid #ddd', padding: '12px' }}>اسم المعلم بالكامل</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px' }}>رقم الهاتف</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px' }}>الحالة</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTeachers.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '25px', color: '#888', fontStyle: 'italic', backgroundColor: '#fff' }}>
                        لا يوجد معلم مسجل لهذه المادة حالياً.
                      </td>
                    </tr>
                  ) : (
                    displayedTeachers.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
                        <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>{t.name}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{t.phone || '-'}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <span style={{ color: t.status === 'نشط' ? 'green' : 'red', fontWeight: 'bold' }}>{t.status}</span>
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <button 
                            style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => handleDelete(t.id)}
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <AddTeacherModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTeacher} 
      />

    </div>
  );
}
