import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ResultsSection({ onBack }) {
  const [grades, setGrades] = useState([]);
  const [classesList] = useState(['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس']);
  const [selectedClass, setSelectedClass] = useState('الصف الأول');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [loading, setLoading] = useState(false);

  // حقول نموذج إضافة وتعديل الدرجات
  const [studentName, setStudentName] = useState('');
  const [subjectName, setSubjectName] = useState('القرآن الكريم');
  const [month1, setMonth1] = useState('');
  const [month2, setMonth2] = useState('');
  const [month3, setMonth3] = useState('');
  const [term1, setTerm1] = useState('');
  const [term2, setTerm2] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchGrades();
  }, [selectedClass, academicYear]);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_grades')
        .select('*')
        .eq('class_name', selectedClass)
        .eq('academic_year', academicYear)
        .order('id', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('يرجى كتابة اسم الطالب');
      return;
    }

    const payload = {
      student_name: studentName.trim(),
      class_name: selectedClass,
      subject_name: subjectName,
      academic_year: academicYear,
      month_1: parseFloat(month1) || 0,
      month_2: parseFloat(month2) || 0,
      month_3: parseFloat(month3) || 0,
      term_1: parseFloat(term1) || 0,
      term_2: parseFloat(term2) || 0
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('student_grades')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        alert('تم تحديث الدرجات بنجاح ✨');
      } else {
        const { error } = await supabase
          .from('student_grades')
          .insert([payload]);
        if (error) throw error;
        alert('تم حفظ درجات الطالب بنجاح 👏');
      }
      resetForm();
      fetchGrades();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ! تأكد من توافق الحقول في جدول student_grades.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setStudentName(item.student_name);
    setSubjectName(item.subject_name);
    setMonth1(item.month_1 ?? '');
    setMonth2(item.month_2 ?? '');
    setMonth3(item.month_3 ?? '');
    setTerm1(item.term_1 ?? '');
    setTerm2(item.term_2 ?? '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه النتيجة؟')) {
      try {
        const { error } = await supabase.from('student_grades').delete().eq('id', id);
        if (error) throw error;
        fetchGrades();
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء الحذف!');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setStudentName('');
    setMonth1('');
    setMonth2('');
    setMonth3('');
    setTerm1('');
    setTerm2('');
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '22px' }}>📋 إدارة نتائج الامتحانات والدرجات</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>رصد درجات الشهور، الفترات، والنتيجة النهائية للحساب التلقائي</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ⬅️ رجوع
          </button>
        )}
      </div>

      {/* شريط الفلترة (الفصل والعام الدراسي) */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '13px', color: '#475569' }}>🏛️ الفصل الدراسي:</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={selectStyle}>
            {classesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '13px', color: '#475569' }}>📅 العام الدراسي:</label>
          <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={selectStyle}>
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '20px' }}>
        
        {/* نموذج الإدخال والتعديل */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '16px', fontWeight: 'bold' }}>
            {editingId ? '✏️ تعديل درجات الطالب' : '➕ رصد درجات جديدة'}
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>اسم الطالب:</label>
            <input type="text" placeholder="اسم الطالب كامل" value={studentName} onChange={e => setStudentName(e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>المادة الدراسية:</label>
            <select value={subjectName} onChange={e => setSubjectName(e.target.value)} style={inputStyle}>
              <option value="القرآن الكريم">القرآن الكريم</option>
              <option value="اللغة العربية">اللغة العربية</option>
              <option value="الرياضيات">الرياضيات</option>
              <option value="العلوم">العلوم</option>
              <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
              <option value="الدراسات الإسلامية">الدراسات الإسلامية</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>شهر 1:</label>
              <input type="number" step="0.5" value={month1} onChange={e => setMonth1(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>شهر 2:</label>
              <input type="number" step="0.5" value={month2} onChange={e => setMonth2(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>شهر 3:</label>
              <input type="number" step="0.5" value={month3} onChange={e => setMonth3(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>الفترة الأولى:</label>
              <input type="number" step="0.5" value={term1} onChange={e => setTerm1(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>الفترة الثانية:</label>
              <input type="number" step="0.5" value={term2} onChange={e => setTerm2(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ flex: 1, padding: '11px', backgroundColor: editingId ? '#3b82f6' : '#047857', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {editingId ? 'تحديث الدرجات' : 'حفظ ورصد 💾'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '11px 14px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>إلغاء</button>
            )}
          </div>
        </form>

        {/* جدول عرض النتائج */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', height: 'fit-content' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '13px' }}>
                  <th style={thStyle}>اسم الطالب</th>
                  <th style={thStyle}>المادة</th>
                  <th style={thStyle}>ش 1</th>
                  <th style={thStyle}>ش 2</th>
                  <th style={thStyle}>ش 3</th>
                  <th style={{ ...thStyle, backgroundColor: '#0284c7' }}>الفترة 1</th>
                  <th style={{ ...thStyle, backgroundColor: '#0284c7' }}>الفترة 2</th>
                  <th style={{ ...thStyle, backgroundColor: '#047857' }}>النهائية (1+2)</th>
                  <th style={thStyle}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '25px', color: '#64748b' }}>⏳ جاري تحميل الدرجات...</td></tr>
                ) : grades.length > 0 ? (
                  grades.map((row, index) => {
                    const t1 = parseFloat(row.term_1) || 0;
                    const t2 = parseFloat(row.term_2) || 0;
                    const finalScore = t1 + t2; // حساب النتيجة النهائية

                    return (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0f172a', textAlign: 'right' }}>{row.student_name}</td>
                        <td style={tdStyle}>{row.subject_name}</td>
                        <td style={tdStyle}>{row.month_1}</td>
                        <td style={tdStyle}>{row.month_2}</td>
                        <td style={tdStyle}>{row.month_3}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0284c7' }}>{row.term_1}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0284c7' }}>{row.term_2}</td>
                        <td style={{ ...tdStyle, fontWeight: '900', color: '#047857', backgroundColor: '#ecfdf5' }}>
                          {finalScore}
                        </td>
                        <td style={tdStyle}>
                          <button onClick={() => handleEdit(row)} style={{ padding: '4px 8px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', marginLeft: '4px', fontSize: '11px', fontWeight: 'bold' }}>✏️</button>
                          <button onClick={() => handleDelete(row.id)} style={{ padding: '4px 8px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>🗑️</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>لا توجد درجات مرصودة لهذا الفصل حالياً.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', textAlign: 'right' };
const inputStyle = { width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff', fontWeight: 'bold', textAlign: 'center' };
const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '14px', backgroundColor: '#fff' };
const thStyle = { padding: '10px 8px', fontWeight: '700', fontSize: '12px' };
const tdStyle = { padding: '10px 8px', fontSize: '13px' };
