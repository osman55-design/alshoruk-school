import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SubjectsSection({ onBack }) {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // حقول النموذج
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [passScore, setPassScore] = useState(50);
  const [editingId, setEditingId] = useState(null);

  // جلب الفصول المتاحة من جدول الطلاب
  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase.from('students_list').select('class_name');
      if (error) throw error;
      if (data) {
        const uniqueClasses = [...new Set(data.map(i => i.class_name).filter(Boolean))];
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) setClassName(uniqueClasses[0]);
      }
    } catch (err) {
      console.error("خطأ في جلب الفصول:", err);
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects_list')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setSubjects(data || []);
    } catch (err) {
      console.error("خطأ في جلب المواد:", err);
    } finally {
      setLoading(false);
    }
  };

  // إضافة أو تحديث مادة
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectName.trim() || !className) {
      alert('يرجى كتابة اسم المادة واختيار الفصل الدراسي');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('subjects_list')
          .update({
            subject_name: subjectName.trim(),
            class_name: className,
            max_score: Number(maxScore),
            pass_score: Number(passScore)
          })
          .eq('id', editingId);

        if (error) throw error;
        alert('تم تعديل بيانات المادة بنجاح ✨');
      } else {
        const { error } = await supabase
          .from('subjects_list')
          .insert([{
            subject_name: subjectName.trim(),
            class_name: className,
            max_score: Number(maxScore),
            pass_score: Number(passScore)
          }]);

        if (error) throw error;
        alert('تمت إضافة المادة بنجاح 📖');
      }

      resetForm();
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ المادة!');
    }
  };

  // حذف مادة
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذه المادة؟')) {
      try {
        const { error } = await supabase.from('subjects_list').delete().eq('id', id);
        if (error) throw error;
        fetchSubjects();
      } catch (err) {
        console.error(err);
        alert('خطأ في الحذف!');
      }
    }
  };

  // تجهيز للتعديل
  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setSubjectName(sub.subject_name);
    setClassName(sub.class_name);
    setMaxScore(sub.max_score);
    setPassScore(sub.pass_score);
  };

  const resetForm = () => {
    setEditingId(null);
    setSubjectName('');
    setMaxScore(100);
    setPassScore(50);
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* الهيدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '22px' }}>📖 إدارة المواد الدراسية</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>إضافة وتخصيص المواد لكل فصل مع تحديد الدرجات الكبرى والصغرى</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ⬅️ رجوع
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* نموذج الإضافة والتعديل */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '16px', fontWeight: 'bold' }}>
            {editingId ? '✏️ تعديل مادة' : '➕ إضافة مادة جديدة'}
          </h3>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>اسم المادة:</label>
            <input 
              type="text" 
              placeholder="مثال: الرياضيات" 
              value={subjectName} 
              onChange={e => setSubjectName(e.target.value)} 
              style={inputStyle} 
              required 
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>الفصل الدراسي:</label>
            <select value={className} onChange={e => setClassName(e.target.value)} style={inputStyle}>
              {classes.length > 0 ? (
                classes.map((cls, idx) => <option key={idx} value={cls}>{cls}</option>)
              ) : (
                <option value="">لا توجد فصول مضافة بعد</option>
              )}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>الدرجة الكبرى:</label>
              <input 
                type="number" 
                value={maxScore} 
                onChange={e => setMaxScore(e.target.value)} 
                style={inputStyle} 
                required 
              />
            </div>
            <div>
              <label style={labelStyle}>درجة النجاح:</label>
              <input 
                type="number" 
                value={passScore} 
                onChange={e => setPassScore(e.target.value)} 
                style={inputStyle} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: editingId ? '#3b82f6' : '#047857', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {editingId ? 'حفظ التعديلات' : 'حفظ المادة'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '10px 14px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                إلغاء
              </button>
            )}
          </div>
        </form>

        {/* جدول عرض المواد المضافة */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '13px' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>اسم المادة</th>
                <th style={thStyle}>الفصل</th>
                <th style={thStyle}>الدرجة الكبرى</th>
                <th style={thStyle}>درجة النجاح</th>
                <th style={thStyle}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>⏳ جاري تحميل قائمة المواد...</td></tr>
              ) : subjects.length > 0 ? (
                subjects.map((sub, index) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0f172a' }}>{sub.subject_name}</td>
                    <td style={tdStyle}><span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{sub.class_name}</span></td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#047857' }}>{sub.max_score}</td>
                    <td style={{ ...tdStyle, color: '#d97706', fontWeight: 'bold' }}>{sub.pass_score}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleEdit(sub)} style={{ padding: '4px 10px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', marginLeft: '6px', fontSize: '12px', fontWeight: 'bold' }}>✏️ تعديل</button>
                      <button onClick={() => handleDelete(sub.id)} style={{ padding: '4px 10px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🗑️ حذف</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>لا توجد مواد دراسية مضافة حتى الآن.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' };
const thStyle = { padding: '12px 14px', fontWeight: '700' };
const tdStyle = { padding: '12px 14px', fontSize: '13.5px' };
