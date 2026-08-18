import React, { useState, useEffect } from 'react';
import { getAllStudents } from '../db'; 

export default function ClassesSection() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  // هيكلة المراحل والفصول لتطابق المساقات السودانية الجديدة بدقة
  const stages = [
    {
      title: "المرحلة الابتدائية",
      color: "#0284c7",
      items: ["الأول ابتدائي", "الثاني ابتدائي", "الثالث ابتدائي", "الرابع ابتدائي", "الخامس ابتدائي", "السادس ابتدائي"]
    },
    {
      title: "المرحلة المتوسطة",
      color: "#059669",
      items: ["الأول متوسط", "الثاني متوسط", "الثالث متوسط"]
    },
    {
      title: "المرحلة الثانوية",
      color: "#dc2626",
      items: ["الأول ثانوي", "الثاني ثانوي", "الثالث ثانوي - المساق العلمي", "الثالث ثانوي - المساق الأدبي"]
    }
  ];

  useEffect(() => {
    loadStudentsData();
  }, []);

  const loadStudentsData = async () => {
    try {
      const list = await getAllStudents();
      setStudents(list || []);
    } catch (error) {
      console.error("خطأ في تحميل قوائم فصول الطلاب:", error);
    }
  };

  // دالة ذكية لحساب عدد الطلاب المقيدين في كل صف حياً ومباشرة
  const getStudentCount = (className) => {
    return students.filter(s => s.class === className).length;
  };

  // فلترة الطلاب المعروضين في الجدول بالأسفل بناءً على الزر المضغوط
  const classStudents = students.filter(s => s.class === selectedClass);

  return (
    <div style={{ direction: 'rtl', padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* عنوان التبويب الرئيسي */}
      <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px solid #e5e7eb', paddingBottom: '15px' }}>
        <h2 style={{ color: '#1e3a8a', margin: 0 }}>🏫 نظام إدارة وتوزيع الصفوف الدراسية</h2>
        <p style={{ color: '#555', marginTop: '5px', fontSize: '14px' }}>هذا القسم يعرض الفصول بشكل ديناميكي مرتبط بقاعدة البيانات وموزع حسب المساقات الجديدة</p>
      </div>

      {/* عرض المراحل والفصول على شكل بطاقات أنيقة مطابقة لتصميمك الأصلي */}
      {stages.map((stage, sIdx) => (
        <div key={sIdx} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: stage.color, marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #f3f4f6', paddingBottom: '5px' }}>{stage.title}</h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {stage.items.map((cls, cIdx) => {
              const count = getStudentCount(cls);
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cIdx}
                  onClick={() => setSelectedClass(cls)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #007bff' : '1px solid #d1d5db',
                    backgroundColor: isSelected ? '#007bff' : '#fff',
                    color: isSelected ? '#fff' : '#1f2937',
                    cursor: 'pointer',
                    minWidth: '220px',
                    flex: '1 1 200px',
                    boxShadow: isSelected ? '0 4px 6px rgba(0,123,255,0.2)' : 'none',
                    fontWeight: 'bold'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>🏫 {cls}</span>
                  <span style={{
                    backgroundColor: isSelected ? '#fff' : '#f3f4f6',
                    color: isSelected ? '#007bff' : '#4b5563',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {count} طلاب
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* جدول كشف حساب حصر الطلاب المنتمين للفصل المختار بالأسفل */}
      {selectedClass && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f3f4f6', paddingBottom: '10px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#1f2937' }}>📋 كشف طلاب صف: <span style={{ color: '#007bff' }}>{selectedClass}</span></h3>
            <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => window.print()} style={{ backgroundColor: '#1e3a8a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ طباعة الكشف</button>
              <button onClick={() => setSelectedClass('')} style={{ backgroundColor: '#6b7280', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>❌ إغلاق القائمة</button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }} border="1" cellPadding="12" borderColor="#e5e7eb">
            <thead>
              <tr style={{ backgroundColor: '#1e3a8a', color: '#fff' }}>
                <th style={{ width: '60%' }}>اسم الطالب ثلاثي كامل</th>
                <th style={{ width: '20%' }}>الجنس</th>
                <th style={{ width: '20%' }}>حالة القيد</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.length > 0 ? classStudents.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '20px' }}>{s.name}</td>
                  <td>{s.gender === 'ذكور' ? '👦 بنين' : '👧 بنات'}</td>
                  <td style={{ color: '#16a34a', fontWeight: 'bold' }}>✓ مقيد ونشط</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" style={{ padding: '25px', color: '#888', fontStyle: 'italic' }}>لا يوجد طلاب مسجلون في هذا الصف حالياً.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
