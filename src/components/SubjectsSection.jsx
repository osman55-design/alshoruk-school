import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SubjectsSection({ onBack }) {
  const [subjects, setSubjects] = useState([]);
  const [classesList, setClassesList] = useState([
    'الصف الأول',
    'الصف الثاني',
    'الصف الثالث',
    'الصف الرابع',
    'الصف الخامس',
    'الصف السادس',
    'الصف السابع',
    'الصف الثامن'
  ]);
  const [selectedClassFilter, setSelectedClassFilter] = useState('الكل');
  const [loading, setLoading] = useState(false);

  // حقول النموذج
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('الصف الأول');
  const [customClass, setCustomClass] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [passScore, setPassScore] = useState(50);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClassesFromDB();
    fetchSubjects();
  }, []);

  // جلب الفصول المضافة في جدول الفصول أو الطلاب إن وجدت ودمجها
  const fetchClassesFromDB = async () => {
    try {
      const { data: stClasses } = await supabase.from('students_list').select('class_name');
      const { data: clsData } = await supabase.from('classes_list').select('class_name');
      
      let allNames = [...classesList];
      if (stClasses) allNames.push(...stClasses.map(c => c.class_name));
      if (clsData) allNames.push(...clsData.map(c => c.class_name));

      const uniqueClasses = [...new Set(allNames.filter(Boolean))];
      setClassesList(uniqueClasses);
      if (uniqueClasses.length > 0) setClassName(uniqueClasses[0]);
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

  // حفظ أو تعديل المادة
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalClassName = className === 'custom' ? customClass.trim() : className;

    if (!subjectName.trim() || !finalClassName) {
      alert('يرجى كتابة اسم المادة واختيار/كتابة الفصل الدراسي');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('subjects_list')
          .update({
            subject_name: subjectName.trim(),
            class_name: finalClassName,
            max_score: Number(maxScore),
            pass_score: Number(passScore)
          })
          .eq('id', editingId);

        if (error) throw error;
        alert('تم تعديل المادة بنجاح ✨');
      } else {
        const { error } = await supabase
          .from('subjects_list')
          .insert([{
            subject_name: subjectName.trim(),
            class_name: finalClassName,
            max_score: Number(maxScore),
            pass_score: Number(passScore)
          }]);

        if (error) throw error;
        alert('تمت إضافة المادة بنجاح 📖');
      }

      // إضافة الفصل للقائمة إذا كان جديداً
      if (!classesList.includes(finalClassName)) {
        setClassesList([...classesList, finalClassName]);
      }

      resetForm();
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ المادة، تأكد من إنشاء جدول subjects_list في Supabase');
    }
  };

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
    setCustomClass('');
    setMaxScore(100);
    setPassScore(50);
  };

  // تصفية المواد حسب الفصل المختار من الشريط العلوي
  const filteredSubjects = selectedClassFilter === 'الكل'
    ? subjects
    : subjects.filter(s => s.class_name === selectedClassFilter);

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

      {/* شريط اختيار وتصفية الفصول */}
      <div style={{ backgroundColor: '#ffffff', padding: '14px 20px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto' }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a', whitespace: 'nowrap' }}>🏫 استعراض حسب الفصل:</span>
        <button 
          onClick={() => setSelectedClassFilter('الكل')}
          style={classTabStyle(selectedClassFilter === 'الكل')}
        >
          عرض الكل ({subjects.length})
        </button>
        {classesList.map((cls, idx) => {
          const count = subjects.filter(s => s.class_name === cls).length;
          return (
            <button 
              key={idx} 
              onClick={() => {
                setSelectedClassFilter(cls);
                setClassName(cls); // ضبط الفصل التلقائي عند الإضافة
              }}
              style={classTabStyle(selectedClassFilter === cls)}
            >
              {cls} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* نموذج الإضافة والتعديل */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '16px', fontWeight: 'bold' }}>
            {editingId ? '✏️ تعديل مادة' : '➕ إضافة مادة جديدة'}
          </h3>

          {/* اختيار الفصل */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>الفصل الدراسي:</label>
            <select 
              value={className} 
              onChange={e => setClassName(e.target.value)} 
              style={inputStyle}
            >
              {classesList.map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
              <option value="custom">➕ كتابة اسم فصل جديد...</option>
            </select>
          </div>

          {/* في حال اختيار كتابة فصل جديد */}
          {className === 'custom' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>اسم الفصل الجديد:</label>
              <input 
                type="text" 
                placeholder="مثال: الصف التاسع" 
                value={customClass} 
                onChange={e => setCustomClass(e.target.value)} 
                style={inputStyle} 
                required 
              />
            </div>
          )}

          {/* اسم المادة */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>اسم المادة:</label>
            <input 
              type="text" 
              placeholder="مثال: الرياضيات، اللغة العربية..." 
              value={subjectName} 
              onChange={e => setSubjectName(e.target.value)} 
              style={inputStyle} 
              required 
            />
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
            <button type="submit" style={{ flex: 1, padding: '11px', backgroundColor: editingId ? '#3b82f6' : '#047857', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {editingId ? 'حفظ التعديلات' : 'حفظ المادة 💾'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '11px 14px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
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
                <th style={thStyle}>الفصل الدراسي</th>
                <th style={thStyle}>الدرجة الكبرى</th>
                <th style={thStyle}>درجة النجاح</th>
                <th style={thStyle}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>⏳ جاري تحميل قائمة المواد...</td></tr>
              ) : filteredSubjects.length > 0 ? (
                filteredSubjects.map((sub, index) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0f172a' }}>{sub.subject_name}</td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                        {sub.class_name}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#047857' }}>{sub.max_score}</td>
                    <td style={{ ...tdStyle, color: '#d97706', fontWeight: 'bold' }}>{sub.pass_score}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleEdit(sub)} style={{ padding: '4px 10px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', marginLeft: '6px', fontSize: '12px', fontWeight: 'bold' }}>✏️ تعديل</button>
                      <button onClick={() => handleDelete(sub.id)} style={{ padding: '4px 10px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🗑️ حذف</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>لا توجد مواد مضافة لهذا الفصل بعد. اختر فصلاً وأضف مواده من النموذج على اليمين.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// التنسيقات
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff', fontWeight: 'bold' };
const thStyle = { padding: '12px 14px', fontWeight: '700' };
const tdStyle = { padding: '12px 14px', fontSize: '13.5px' };

const classTabStyle = (isActive) => ({
  padding: '6px 14px',
  borderRadius: '8px',
  border: isActive ? '1px solid #047857' : '1px solid #cbd5e1',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
  whiteSpace: 'nowrap',
  backgroundColor: isActive ? '#047857' : '#f8fafc',
  color: isActive ? '#ffffff' : '#475569',
  transition: 'all 0.2s'
});
