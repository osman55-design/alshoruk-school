import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات حقول الإدخال
  const [fullName, setFullName] = useState('');
  const [stage, setStage] = useState('ابتدائي');
  const [studentClass, setStudentClass] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fees, setFees] = useState('');

  // خريطة المراحل والصفوف الدراسية الشاملة
  const stageClassesMap = {
    'روضة': ['روضة أولى (تمهيدي)', 'روضة ثانية (روضة)'],
    'ابتدائي': ['الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي', 'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي'],
    'متوسط': ['الصف الأول المتوسط', 'الصف الثاني المتوسط', 'الصف الثالث المتوسط'],
    'ثانوي': ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']
  };

  // جلب قائمة الطلاب من قاعدة البيانات
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('خطأ في جلب الطلاب:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // إضافة طالب جديد
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentClass) {
      alert('يرجى اختيار الصف الدراسي!');
      return;
    }

    try {
      const { error } = await supabase.from('students').insert([
        {
          full_name: fullName,
          stage: stage,
          class: studentClass,
          parent_phone: parentPhone,
          address: address,
          fees: fees ? parseFloat(fees) : 0
        }
      ]);

      if (error) throw error;

      alert('✅ تم تسجيل الطالب بنجاح!');
      // إعادة ضبط الاستمارة
      setFullName('');
      setStudentClass('');
      setParentPhone('');
      setAddress('');
      setFees('');
      fetchStudents();
    } catch (err) {
      alert('حدث خطأ أثناء حفظ البيانات: ' + err.message);
    }
  };

  // حذف طالب
  const handleDeleteStudent = async (id) => {
    if (window.confirm('هل أنت تأكد من حذف هذا الطالب؟')) {
      try {
        const { error } = await supabase.from('students').delete().eq('id', id);
        if (error) throw error;
        fetchStudents();
      } catch (err) {
        alert('خطأ في الحذف: ' + err.message);
      }
    }
  };

  return (
    <div style={{ padding: '10px', direction: 'rtl' }}>
      
      {/* عنوان القسم */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '3px solid #047857', paddingBottom: '10px' }}>
        <span style={{ fontSize: '28px' }}>📚</span>
        <h2 style={{ margin: 0, color: '#047857', fontWeight: '900' }}>إدارة وشؤون الطلاب</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        
        {/* نموذج تسجيل طالب جديد */}
        <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#065f46', fontSize: '18px', fontWeight: 'bold' }}>📝 إضافة طالب جديد</h3>
          
          <form onSubmit={handleAddStudent}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>اسم الطالب بالكامل:</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} placeholder="مثال: أحمد محمد علي" />
            </div>

            {/* 🏛️ اختيار المرحلة الدراسية */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#047857' }}>🏛️ المرحلة الدراسية:</label>
              <select 
                value={stage} 
                onChange={(e) => {
                  setStage(e.target.value);
                  setStudentClass(''); // إعادة ضبط الصف عند تغيير المرحلة
                }} 
                style={inputStyle}
              >
                <option value="روضة">👶 مرحلة الروضة</option>
                <option value="ابتدائي">🌱 المرحلة الابتدائية</option>
                <option value="متوسط">🌿 المرحلة المتوسطة</option>
                <option value="ثانوي">🎓 المرحلة الثانوية</option>
              </select>
            </div>

            {/* 📚 اختيار الصف بناءً على المرحلة */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#047857' }}>📚 الصف الدراسي:</label>
              <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} required style={inputStyle}>
                <option value="">-- اختر الصف الدراسي --</option>
                {stageClassesMap[stage]?.map((cls, index) => (
                  <option key={index} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>رقم هاتف ولي الأمر:</label>
              <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} style={inputStyle} placeholder="01xxxxxxxxx" />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>العنوان:</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} placeholder="مثال: الخرطوم / أم درمان" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>الرسوم المحددة:</label>
              <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} style={inputStyle} placeholder="0.00" />
            </div>

            <button type="submit" style={buttonStyle}>حفظ الطالب ➕</button>
          </form>
        </div>

        {/* جدول عرض الطلاب المسجلين */}
        <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#065f46', fontSize: '18px', fontWeight: 'bold' }}>📋 قائمة الطلاب المسجلين ({students.length})</h3>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>جاري تحميل البيانات...</p>
          ) : students.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>لا يوجد طلاب مسجلين حالياً.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={thStyle}>اسم الطالب</th>
                  <th style={thStyle}>المرحلة والصف</th>
                  <th style={thStyle}>الهاتف</th>
                  <th style={thStyle}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {students.map((std) => (
                  <tr key={std.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={tdStyle}>{std.full_name}</td>
                    <td style={tdStyle}>
                      <span style={badgeStyle}>{std.stage || 'غير محدد'}</span>
                      <br />
                      <small style={{ color: '#475569', fontWeight: 'bold' }}>{std.class}</small>
                    </td>
                    <td style={tdStyle}>{std.parent_phone || '---'}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleDeleteStudent(std.id)} style={deleteButtonStyle}>حذف ❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

// تنسيقات العناصر
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  fontWeight: 'bold',
  color: '#0f172a'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#047857',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '15px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(4,120,87,0.2)'
};

const thStyle = { padding: '12px 8px', color: '#0f172a', fontWeight: 'bold', fontSize: '14px' };
const tdStyle = { padding: '12px 8px', color: '#334155', fontSize: '14px' };

const badgeStyle = {
  backgroundColor: '#d1fae5',
  color: '#047857',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '11px',
  fontWeight: 'bold',
  display: 'inline-block',
  marginBottom: '4px'
};

const deleteButtonStyle = {
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  border: '1px solid #fee2e2',
  padding: '4px 10px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '12px'
};
