import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function StudentsSection({ onBack }) {
  const [students, setStudents] = useState([]);
  const [classesList] = useState(['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس']);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // حقول نموذج الطالب
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('الصف الأول');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  // جلب قائمة الطلاب
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students_list')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // حفظ أو تعديل بيانات الطالب
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('يرجى كتابة اسم الطالب');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        class_name: studentClass,
        academic_year: academicYear,
        parent_phone: parentPhone,
        address: address
      };

      if (editingId) {
        const { error } = await supabase
          .from('students_list')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        alert('تم تعديل بيانات الطالب بنجاح ✨');
      } else {
        const { error } = await supabase
          .from('students_list')
          .insert([payload]);
        if (error) throw error;
        alert('تم تسجل الطالب بنجاح 👏');
      }

      resetForm();
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ! تأكد من وجود حقل academic_year في جدول students_list.');
    }
  };

  // حذف طالب
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت تأكد من حذف بيانات هذا الطالب؟')) {
      try {
        const { error } = await supabase.from('students_list').delete().eq('id', id);
        if (error) throw error;
        fetchStudents();
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء الحذف!');
      }
    }
  };

  // تجهيز النموذج للتعديل
  const handleEdit = (st) => {
    setEditingId(st.id);
    setName(st.name || '');
    setStudentClass(st.class_name || 'الصف الأول');
    setAcademicYear(st.academic_year || '2025/2026');
    setParentPhone(st.parent_phone || '');
    setAddress(st.address || '');
  };

  // إعادة ضبط النموذج
  const resetForm = () => {
    setEditingId(null);
    setName('');
    setStudentClass('الصف الأول');
    setAcademicYear('2025/2026');
    setParentPhone('');
    setAddress('');
  };

  // تصفية الطلاب بالبحث
  const filteredStudents = students.filter(
    (st) =>
      st.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.academic_year?.includes(searchTerm)
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '22px' }}>👨‍🎓 إدارة وتوزيع الطلاب</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>تسجيل وتتبع بيانات الطلاب والعام الدراسي</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ⬅️ رجوع
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '20px' }}>
        
        {/* 1️⃣ نموذج الإضافة والتعديل */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '16px', fontWeight: 'bold' }}>
            {editingId ? '✏️ تعديل بيانات طالب' : '➕ تسجيل طالب جديد'}
          </h3>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>اسم الطالب رباعي:</label>
            <input type="text" placeholder="مثال: أحمد محمد علي حسن" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>الصف / الفصل الدراسي:</label>
            <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} style={inputStyle}>
              {classesList.map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* حقل العام الدراسي الجديد */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>📅 العام الدراسي:</label>
            <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} style={inputStyle}>
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>رقم ولي الأمر (واتساب):</label>
            <input type="text" placeholder="01XXXXXXXXX" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>العنوان / السكن:</label>
            <input type="text" placeholder="مثال: الخرطوم - حي الشروق" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ flex: 1, padding: '11px', backgroundColor: editingId ? '#3b82f6' : '#047857', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {editingId ? 'تحديث البيانات' : 'حفظ الطالب 💾'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '11px 14px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>إلغاء</button>
            )}
          </div>
        </form>

        {/* 2️⃣ شريط البحث والجدول */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <input
            type="text"
            placeholder="🔍 بحث باسم الطالب أو الفصل أو العام الدراسي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', fontWeight: 'bold' }}
          />

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '13px' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>اسم الطالب</th>
                  <th style={thStyle}>الفصل</th>
                  <th style={thStyle}>العام الدراسي</th>
                  <th style={thStyle}>رقم التواصل</th>
                  <th style={thStyle}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>⏳ جاري التحميل...</td></tr>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((st, index) => (
                    <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0f172a' }}>{st.name}</td>
                      <td style={tdStyle}>
                        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                          {st.class_name}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                          📅 {st.academic_year || '2025/2026'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: '#047857', fontWeight: 'bold' }}>{st.parent_phone || 'غير مدخل'}</td>
                      <td style={tdStyle}>
                        <button onClick={() => handleEdit(st)} style={{ padding: '4px 10px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', marginLeft: '6px', fontSize: '12px', fontWeight: 'bold' }}>✏️ تعديل</button>
                        <button onClick={() => handleDelete(st.id)} style={{ padding: '4px 10px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🗑️ حذف</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>لا يوجد طلاب مضافين حتى الآن.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff', fontWeight: 'bold' };
const thStyle = { padding: '12px 14px', fontWeight: '700' };
const tdStyle = { padding: '12px 14px', fontSize: '13.5px' };
