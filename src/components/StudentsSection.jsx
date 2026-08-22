import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [academicLevel, setAcademicLevel] = useState('الابتدائية');
  const [className, setClassName] = useState('الصف الأول');
  const [parentPhone, setParentPhone] = useState('');
  const [tuitionStatus, setTuitionStatus] = useState('غير مسدد');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('الكل');
  const [loading, setLoading] = useState(false);

  // دالة جلب قائمة الطلاب من قاعدة البيانات الحية فور فتح الصفحة
  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students_list')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) throw error;
      if (data) setStudents(data);
    } catch (error) {
      console.error("خطأ في جلب بيانات الطلاب:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // دالة حفظ طالب جديد في قاعدة بيانات سوبابيز مباشرة لمنع أخطاء CORS
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !className.trim()) {
      alert("الرجاء إدخال اسم الطالب والصف الدراسي بشكل صحيح");
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('students_list')
        .insert([{
          student_name: studentName.trim(),
          academic_level: academicLevel,
          class_name: className.trim(),
          parent_phone: parentPhone.trim(),
          tuition_status: tuitionStatus
        }]);

      if (error) throw error;

      alert(`✅ تم حفظ الطالب ${studentName} في قاعدة البيانات بنجاح!`);
      setStudentName('');
      setParentPhone('');
      fetchStudents(); // تحديث القائمة مرئياً فوراً

    } catch (error) {
      console.error("حدث خطأ أثناء حفظ الطالب:", error);
      alert("❌ فشل حفظ بيانات الطالب في السحابة: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطالب نهائياً من سجلات المدرسة؟")) {
      try {
        const { error } = await supabase
          .from('students_list')
          .delete()
          .eq('id', studentId);

        if (error) throw error;

        alert("تم حذف سجل الطالب بنجاح.");
        fetchStudents();
      } catch (error) {
        console.error("خطأ في الحذف:", error);
        alert("❌ فشل حذف سجل الطالب: " + error.message);
      }
    }
  };

  const handleToggleTuition = async (studentId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'مسدد' ? 'غير مسدد' : 'مسدد';
      const { error } = await supabase
        .from('students_list')
        .update({ tuition_status: newStatus })
        .eq('id', studentId);

      if (error) throw error;
      fetchStudents();
    } catch (error) {
      console.error("خطأ في تحديث الرسوم:", error);
      alert("❌ فشل تحديث الموقف المالي: " + error.message);
    }
  };

  // تصفية وقفر البيانات بناءً على كلمة البحث والمرحلة الدراسية المحددة
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.parent_phone && s.parent_phone.includes(searchTerm));
    const matchesLevel = filterLevel === 'الكل' || s.academic_level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div style={{ direction: 'rtl', padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* شريط العنوان الملكي الفاخر بالأخضر المشرق */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '3px solid #f59e0b', paddingBottom: '15px', gap: '15px' }}>
        <div>
          <h2 style={{ color: '#047857', margin: 0, fontWeight: '900', fontSize: '24px' }}>📚 إدارة شؤون سجلات وقوائم الطلاب</h2>
          <p style={{ color: '#064e3b', margin: '5px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>البحث الفرعي، تسجيل الجدد، ومتابعة الموقف المالي للرسوم المدرسية تلقائياً</p>
        </div>
        
        {/* أزرار الفرز السريع للمراحل الثلاثة */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['الكل', 'الابتدائية', 'المتوسطة', 'الثانوية'].map(level => (
            <button 
              key={level} 
              onClick={() => setFilterLevel(level)}
              style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: filterLevel === level ? '#f59e0b' : '#047857', color: '#ffffff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
            >
              {level === 'الكل' ? '🌍 جميع المراحل' : level}
            </button>
          ))}
        </div>
      </div>

      {/* نموذج إضافة الطلاب المطور ذو الخلفية البيضاء الناصعة والخطوط البارزة */}
      <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', border: '1px solid #cbd5e1', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <h4 style={{ marginTop: 0, color: '#047857', marginBottom: '15px', fontWeight: '900', fontSize: '16px' }}>➕ تسجيل وقيد طالب جديد بالمدرسة</h4>
        <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" placeholder="اسم الطالب الكامل ثلاثي" value={studentName} onChange={e => setStudentName(e.target.value)} 
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', flex: '2', textAlign: 'right', fontWeight: 'bold', color: '#064e3b' }} required 
          />
          <input 
            type="text" placeholder="الصف الدراسي (مثل: الأول)" value={className} onChange={e => setClassName(e.target.value)} 
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', flex: '1', textAlign: 'right', fontWeight: 'bold', color: '#064e3b' }} required 
          />
          <input 
            type="text" placeholder="رقم هاتف ولي الأمر الدائم" value={parentPhone} onChange={e => setParentPhone(e.target.value)} 
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', flex: '1', textAlign: 'right', fontWeight: 'bold', color: '#064e3b' }} 
          />
          
          <select value={academicLevel} onChange={e => setAcademicLevel(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '130px', fontWeight: 'bold', color: '#047857', cursor: 'pointer' }}>
            <option value="الابتدائية">الابتدائية</option>
            <option value="المتوسطة">المتوسطة</option>
            <option value="الثانوية">الثانوية</option>
          </select>

          <select value={tuitionStatus} onChange={e => setTuitionStatus(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '130px', fontWeight: 'bold', color: tuitionStatus === 'مسدد' ? '#10b981' : '#dc2626', cursor: 'pointer' }}>
            <option value="غير مسدد">❌ غير مسدد</option>
            <option value="مسدد">✅ مسدد</option>
          </select>

          <button type="submit" disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#047857', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(4,120,87,0.2)' }}>
            {loading ? "جاري الحفظ..." : "قيد الطالب 💾"}
          </button>
        </form>
      </div>

      {/* شريط البحث المشرق العالي التباين */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" placeholder="🔍 ابحث عن طالب بالاسم أو برقم هاتف ولي الأمر للوصول الفوري لسجله الدراسي..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
          style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '2px solid #047857', boxSizing: 'border-box', textAlign: 'right', fontWeight: 'bold', fontSize: '15px', color: '#064e3b', boxShadow: '0 4px 10px rgba(4,120,87,0.03)' }} 
        />
      </div>
      {/* جدول السجلات وعرض قوائم الطلاب */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#047857', color: '#ffffff', borderBottom: '3px solid #f59e0b' }}>
                <th style={{ padding: '15px 20px', fontWeight: '900' }}>اسم الطالـب ثنائـي / ثلاثـي</th>
                <th style={{ padding: '15px 20px', fontWeight: '900' }}>المرحلة التعليمية</th>
                <th style={{ padding: '15px 20px', fontWeight: '900' }}>الصف الدراسي</th>
                <th style={{ padding: '15px 20px', fontWeight: '900' }}>هاتف ولي الأمر</th>
                <th style={{ padding: '15px 20px', fontWeight: '900', textAlign: 'center' }}>موقف الرسوم المالية</th>
                <th style={{ padding: '15px 20px', fontWeight: '900', textAlign: 'center' }}>إجراءات السجل</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <tr 
                    key={student.id} 
                    style={{ 
                      borderBottom: '1px solid #cbd5e1', 
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* اسم الطالب بخط بارز وزيتي ملكي مريح */}
                    <td style={{ padding: '14px 20px', fontWeight: '700', color: '#064e3b' }}>{student.student_name}</td>
                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: 'bold' }}>{student.academic_level}</td>
                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: 'bold' }}>{student.class_name}</td>
                    <td style={{ padding: '14px 20px', color: '#047857', fontWeight: 'bold', fontFamily: 'monospace' }}>{student.parent_phone || '—'}</td>
                    
                    {/* زر تبديل الرسوم المالي التفاعلي الفوري */}
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleTuition(student.id, student.tuition_status)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '12.5px',
                          backgroundColor: student.tuition_status === 'مسدد' ? '#d1fae5' : '#fee2e2',
                          color: student.tuition_status === 'مسدد' ? '#065f46' : '#991b1b',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                          transition: 'all 0.2s'
                        }}
                        title="انقر لتبديل وتحديث الموقف المالي فوراً"
                      >
                        {student.tuition_status === 'مسدد' ? '✅ مسدد بالكامل' : '❌ غير مسدد'}
                      </button>
                    </td>

                    {/* أزرار حذف سجلات الطلاب */}
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '15px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          transition: 'all 0.2s'
                        }}
                        title="حذف الطالب نهائياً من قاعدة البيانات"
                      >
                        🗑️ حذف السجل
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 10px', textAlign: 'center', color: '#64748b', fontWeight: 'bold', fontSize: '14px' }}>
                    💡 لا توجد سجلات طلاب مطابقة لعملية الفرز أو البحث حالياً.. يرجى إضافة طلاب جدد لتفعيل القائمة!
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
