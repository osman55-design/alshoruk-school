import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ClassesSection() {
  const [students, setStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('الابتدائية');
  const [selectedClass, setSelectedClass] = useState('الكل');
  const [loading, setLoading] = useState(true);

  // دالة ذكية لجلب بيانات الطلاب وتحديث الفصول تلقائياً فوراً دون تدخل يدوي
  const fetchStudentsForClasses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students_list')
        .select('*')
        .order('student_name', { ascending: true });
        
      if (error) throw error;
      if (data) setStudents(data);
    } catch (error) {
      console.error("خطأ في جلب بيانات الفصول التلقائية:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsForClasses();
  }, []);

  // تصفية وقفر الطلاب أوتوماتيكياً بناءً على المرحلة والصف المختار في لوحة العرض
  const displayedStudents = students.filter(s => {
    const matchesLevel = s.academic_level === selectedLevel;
    const matchesClass = selectedClass === 'الكل' || s.class_name.trim() === selectedClass.trim();
    return matchesLevel && matchesClass;
  });

  // حساب إحصائيات الطلاب الحية في كل مرحلة ديناميكياً
  const totalInLevel = students.filter(s => s.academic_level === selectedLevel).length;
  return (
    <div style={{ direction: 'rtl', padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* شريط العناوين الملكي والفرز التلقائي */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '3px solid #f59e0b', paddingBottom: '15px', gap: '15px' }}>
        <div>
          <h2 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '24px' }}>🏛️ المراقبة والفرز التلقائي للفصول الدراسية</h2>
          <p style={{ color: '#064e3b', margin: '5px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>توزيع أوتوماتيكي ذكي يفرز الطلاب داخل صفوفهم فور قيدهم بملف شؤون الطلاب</p>
        </div>

        {/* أزرار اختيار المراحل التعليمية الثلاث الكبرى */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['الابتدائية', 'المتوسطة', 'الثانوية'].map(level => (
            <button 
              key={level} 
              onClick={() => { setSelectedLevel(level); setSelectedClass('الكل'); }}
              style={{ padding: '10px 22px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13.5px', backgroundColor: selectedLevel === level ? '#f59e0b' : '#047857', color: '#ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
            >
              {level === 'الابتدائية' ? '🎒 المرحلة الابتدائية' : level === 'المتوسطة' ? '📚 المرحلة المتوسطة' : '🦅 المرحلة الثانوية'}
            </button>
          ))}
        </div>
      </div>

      {/* لوحة بطاقة الإحصائيات وعينات الفرز العصرية البارزة */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '25px' }}>
        
        {/* بطاقة إجمالي طلاب المرحلة الحية */}
        <div style={{ flex: '1', minWidth: '240px', background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)', color: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(4,120,87,0.15)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d1fae5' }}>📊 إجمالي قوة القيد الحالية بالمرحلة</div>
          <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '10px', color: '#fef08a' }}>{loading ? '...' : `${totalInLevel} طالباً`}</div>
        </div>

        {/* لوحة اختيار الفرز الفرعي للصفوف داخل المرحلة المختارة */}
        <div style={{ flex: '2', minWidth: '300px', background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '900', color: '#047857', marginBottom: '10px' }}>🔍 فحص صف دراسي محدد داخل مرحلة ({selectedLevel}):</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['الكل', 'الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'].map(cls => {
              // إخفاء الصفوف من الرابع للسادس لو كنا في المتوسطة أو الثانوية لعدم تشتيت المدير
              if ((selectedLevel === 'المتوسطة' || selectedLevel === 'الثانوية') && ['الصف الرابع', 'الصف الخامس', 'الصف السادس'].includes(cls)) return null;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 'bold', fontSize: '12.5px', backgroundColor: selectedClass === cls ? '#ecfdf5' : '#ffffff', color: selectedClass === cls ? '#047857' : '#475569', border: selectedClass === cls ? '2px solid #047857' : '1px solid #cbd5e1', transition: 'all 0.1s' }}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>

      </div>
      {/* جدول عرض قوائم الطلاب الموزعين أوتوماتيكياً */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#047857', color: '#ffffff', borderBottom: '3px solid #f59e0b' }}>
                <th style={{ padding: '15px 20px', fontWeight: '900' }}>اسم الطالـب الفعّـال بجدول القيد</th>
                <th style={{ padding: '15px 20px', fontWeight: '900' }}>المرحلة الموزع بها</th>
                <th style={{ padding: '15px 20px', fontWeight: '900' }}>الصف الدراسي الحالي</th>
                <th style={{ padding: '15px 20px', fontWeight: '900' }}>رقم هاتف الطوارئ لولي الأمر</th>
                <th style={{ padding: '15px 20px', fontWeight: '900', textAlign: 'center' }}>حالة الحساب المالي</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px 10px', textAlign: 'center', color: '#047857', fontWeight: 'bold' }}>
                    ⏳ جاري فرز وتوزيع الطلاب سحابياً...
                  </td>
                </tr>
              ) : displayedStudents.length > 0 ? (
                displayedStudents.map((student, idx) => (
                  <tr 
                    key={student.id} 
                    style={{ 
                      borderBottom: '1px solid #cbd5e1', 
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'all 0.2s'
                    }}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: '700', color: '#064e3b' }}>{student.student_name}</td>
                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: 'bold' }}>{student.academic_level}</td>
                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: 'bold' }}>{student.class_name}</td>
                    <td style={{ padding: '14px 20px', color: '#047857', fontWeight: 'bold', fontFamily: 'monospace' }}>{student.parent_phone || '—'}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          backgroundColor: student.tuition_status === 'مسدد' ? '#d1fae5' : '#fee2e2',
                          color: student.tuition_status === 'مسدد' ? '#065f46' : '#991b1b',
                        }}
                      >
                        {student.tuition_status === 'مسدد' ? '✅ معتمد مالياً' : '❌ متبقي رسوم'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '40px 10px', textAlign: 'center', color: '#64748b', fontWeight: 'bold', fontSize: '14px' }}>
                    💡 لا يوجد طلاب مقيدين حالياً في ({selectedClass}) للمرحلة ({selectedLevel}).. أي طالب تسجله بقسم الطلاب سينزل هنا تلقائياً!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
