import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

// 🎨 أنماط التصميم
const stageBtnStyle = (isActive, activeColor, activeBg) => ({
  padding: '10px 18px',
  borderRadius: '25px',
  border: isActive ? `2px solid ${activeColor}` : '1px solid #cbd5e1',
  cursor: 'pointer',
  fontWeight: '900',
  fontSize: '13px',
  backgroundColor: isActive ? activeBg : '#ffffff',
  color: isActive ? activeColor : '#475569',
  transition: 'all 0.2s ease'
});

const inputInlineStyle = {
  width: '100%',
  padding: '4px 6px',
  borderRadius: '4px',
  border: '1px solid #047857',
  fontSize: '12px',
  outline: 'none'
};

const thStyle = { padding: '10px', fontWeight: 'bold', borderBottom: '2px solid #cbd5e1' };
const tdStyle = { padding: '10px' };

export default function ClassesSection() {
  const [activeStage, setActiveStage] = useState('kindergarten');
  const [selectedClass, setSelectedClass] = useState(null);
  
  // 🌟 حالة تصفية الطلاب (الجميع / بنين / بنات)
  const [genderFilter, setGenderFilter] = useState('all');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 🌟 حالات التعديل (مطابقة لأعمدة جدول Supabase الظاهرة)
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({ 
    student_name: '', 
    parent_phone: '', 
    tuition_status: '', 
    gender: 'بنين' 
  });

  // 🌟 هيكلية الفصول والمراحل
  const stagesStructure = {
    kindergarten: {
      name: 'مرحلة الروضة 🧸',
      classes: [
        { id: 'kg_listener', name: 'روضة - فصل مستمع' },
        { id: 'kg_1', name: 'روضة - الصف الأول' },
        { id: 'kg_2', name: 'روضة - الصف الثاني' }
      ]
    },
    primary: {
      name: 'المرحلة الابتدائية 🏫',
      classes: [
        { id: 'p1', name: 'الابتدائي - الصف الأول' },
        { id: 'p2', name: 'الابتدائي - الصف الثاني' },
        { id: 'p3', name: 'الابتدائي - الصف الثالث' },
        { id: 'p4', name: 'الابتدائي - الصف الرابع' },
        { id: 'p5', name: 'الابتدائي - الصف الخامس' },
        { id: 'p6', name: 'الابتدائي - الصف السادس' }
      ]
    },
    middle: {
      name: 'المرحلة المتوسطة 🎒',
      classes: [
        { id: 'm1', name: 'المتوسط - الصف الأول' },
        { id: 'm2', name: 'المتوسط - الصف الثاني' },
        { id: 'm3', name: 'المتوسط - الصف الثالث' }
      ]
    },
    secondary: {
      name: 'المرحلة الثانوية 🎓',
      classes: [
        { id: 's1', name: 'الثانوي - الصف الأول' },
        { id: 's2', name: 'الثانوي - الصف الثاني' },
        { id: 's3_sci_bio', name: 'ثالث ثانوي - علمي (أحياء)' },
        { id: 's3_sci_cs', name: 'ثالث ثانوي - علمي (حاسوب)' },
        { id: 's3_lit_islamic', name: 'ثالث ثانوي - أدبي (دراسات إسلامية)' }
      ]
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass.name, genderFilter);
    }
  }, [selectedClass, genderFilter]);

  const fetchClassStudents = async (className, currentGenderFilter) => {
    setLoading(true);
    try {
      // استخدام العمود الصحيح class_name الموجود في جدول Supabase لديك
      let query = supabase
        .from('students')
        .select('*')
        .eq('class_name', className);

      if (currentGenderFilter !== 'all') {
        query = query.eq('gender', currentGenderFilter);
      }

      const { data, error } = await query.order('student_name', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 بدء تعديل طالب
  const handleStartEdit = (student) => {
    setEditingStudentId(student.id);
    setEditFormData({
      student_name: student.student_name || '',
      parent_phone: student.parent_phone || '',
      tuition_status: student.tuition_status || '',
      gender: student.gender || 'بنين'
    });
  };

  // 🌟 حفظ التعديل في Supabase
  const handleSaveEdit = async (id) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          student_name: editFormData.student_name,
          parent_phone: editFormData.parent_phone,
          tuition_status: editFormData.tuition_status,
          gender: editFormData.gender
        })
        .eq('id', id);

      if (error) throw error;

      setStudents(students.map(s => (s.id === id ? { ...s, ...editFormData } : s)));
      setEditingStudentId(null);
      alert('تم حفظ التعديلات بنجاح ✨');
    } catch (err) {
      console.error('Error updating student:', err);
      alert('حدث خطأ أثناء حفظ البيانات!');
    }
  };

  // 🌟 طباعة / PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // 🌟 تصدير إلى Excel
  const handleExportExcel = () => {
    if (!students.length) {
      alert('لا توجد بيانات لتصديرها!');
      return;
    }

    const dataToExport = students.map((s, index) => ({
      'م': index + 1,
      'اسم الطالب': s.student_name || '',
      'الجنس': s.gender || '',
      'رقم هاتف ولي الأمر': s.parent_phone || '',
      'حالة الرسوم': s.tuition_status || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الطلاب');
    XLSX.writeFile(workbook, `قائمة_طلاب_${selectedClass.name}_${genderFilter}.xlsx`);
  };

  // 🌟 استيراد من Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedClass) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          alert('ملف الإكسيل فارغ أو غير صالح!');
          setUploading(false);
          return;
        }

        const formattedData = data.map(row => ({
          student_name: String(row['اسم الطالب'] || row['student_name'] || row['الاسم'] || '').trim(),
          parent_phone: String(row['رقم هاتف ولي الأمر'] || row['parent_phone'] || row['الهاتف'] || '').trim(),
          tuition_status: String(row['حالة الرسوم'] || row['tuition_status'] || '').trim(),
          gender: String(row['الجنس'] || row['gender'] || (genderFilter !== 'all' ? genderFilter : 'بنين')).trim(),
          class_name: selectedClass.name, // الربط التلقائي بـ class_name
          stage: activeStage
        })).filter(item => item.student_name !== '');

        if (formattedData.length === 0) {
          alert('لم يتم العثور على أسماء طلاب مطابقة في الملف.');
          setUploading(false);
          return;
        }

        const { error } = await supabase.from('students').insert(formattedData);
        if (error) throw error;

        alert(`تم استيراد وإضافة ${formattedData.length} طالب للفصل بنجاح 🚀`);
        fetchClassStudents(selectedClass.name, genderFilter);
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء رفع ملف الإكسيل!');
      } finally {
        setUploading(false);
        e.target.value = null;
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: '10px', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* 🌟 أزرار المراحل */}
      <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => { setActiveStage('kindergarten'); setSelectedClass(null); }} style={stageBtnStyle(activeStage === 'kindergarten', '#be123c', '#ffe4e6')}>🧸 مرحلة الروضة</button>
        <button onClick={() => { setActiveStage('primary'); setSelectedClass(null); }} style={stageBtnStyle(activeStage === 'primary', '#b45309', '#fef3c7')}>🏫 المرحلة الابتدائية</button>
        <button onClick={() => { setActiveStage('middle'); setSelectedClass(null); }} style={stageBtnStyle(activeStage === 'middle', '#047857', '#d1fae5')}>🎒 المرحلة المتوسطة</button>
        <button onClick={() => { setActiveStage('secondary'); setSelectedClass(null); }} style={stageBtnStyle(activeStage === 'secondary', '#6d28d9', '#ede9fe')}>🎓 المرحلة الثانوية</button>
      </div>

      {/* 🌟 قائمة الفصول */}
      <div className="no-print" style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 14px 0', color: '#0f172a', fontSize: '16px', fontWeight: '800' }}>
          {stagesStructure[activeStage].name} - اختر الفصل لعرض الطلاب:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {stagesStructure[activeStage].classes.map((cls) => {
            const isSelected = selectedClass?.id === cls.id;
            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #047857' : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? '#ecfdf5' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontWeight: '800', fontSize: '13px', color: isSelected ? '#047857' : '#334155' }}>📖 {cls.name}</span>
                <span style={{ fontSize: '11px', color: '#64748b', background: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>عرض 👈</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🌟 جدول عرض الطلاب */}
      {selectedClass ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
          
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '16px', fontWeight: '900' }}>
              📋 طلاب: <span style={{ color: '#d97706' }}>{selectedClass.name}</span>
            </h4>

            {/* 🌟 خيارات التصفية (الجميع / بنين / بنات) */}
            <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              <button 
                onClick={() => setGenderFilter('all')} 
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', backgroundColor: genderFilter === 'all' ? '#047857' : 'transparent', color: genderFilter === 'all' ? '#fff' : '#475569' }}
              >
                👥 الجميع
              </button>
              <button 
                onClick={() => setGenderFilter('بنين')} 
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', backgroundColor: genderFilter === 'بنين' ? '#0284c7' : 'transparent', color: genderFilter === 'بنين' ? '#fff' : '#475569' }}
              >
                👦 بنين
              </button>
              <button 
                onClick={() => setGenderFilter('بنات')} 
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', backgroundColor: genderFilter === 'بنات' ? '#be123c' : 'transparent', color: genderFilter === 'بنات' ? '#fff' : '#475569' }}
              >
                👧 بنات
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={handlePrintPDF} style={{ padding: '7px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>🖨️ طباعة</button>
              <button onClick={handleExportExcel} style={{ padding: '7px 12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>📤 تصدير Excel</button>
              <label style={{ backgroundColor: '#d97706', color: '#fff', padding: '7px 12px', borderRadius: '6px', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                {uploading ? '⏳ جاري الرفع...' : '📥 استيراد Excel'}
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>جاري تحميل البيانات...</p>
          ) : students.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#334155' }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>اسم الطالب</th>
                    <th style={thStyle}>الجنس</th>
                    <th style={thStyle}>رقم هاتف ولي الأمر</th>
                    <th style={thStyle}>حالة الرسوم</th>
                    <th className="no-print" style={thStyle}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const isEditing = editingStudentId === student.id;
                    return (
                      <tr key={student.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={tdStyle}>{idx + 1}</td>
                        
                        <td style={tdStyle}>
                          {isEditing ? (
                            <input type="text" value={editFormData.student_name} onChange={e => setEditFormData({ ...editFormData, student_name: e.target.value })} style={inputInlineStyle} />
                          ) : (
                            <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{student.student_name}</span>
                          )}
                        </td>

                        <td style={tdStyle}>
                          {isEditing ? (
                            <select value={editFormData.gender} onChange={e => setEditFormData({ ...editFormData, gender: e.target.value })} style={inputInlineStyle}>
                              <option value="بنين">بنين</option>
                              <option value="بنات">بنات</option>
                            </select>
                          ) : (
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: student.gender === 'بنات' ? '#ffe4e6' : '#e0f2fe', color: student.gender === 'بنات' ? '#be123c' : '#0369a1' }}>
                              {student.gender || 'غير محدد'}
                            </span>
                          )}
                        </td>

                        <td style={tdStyle}>
                          {isEditing ? (
                            <input type="text" value={editFormData.parent_phone} onChange={e => setEditFormData({ ...editFormData, parent_phone: e.target.value })} style={inputInlineStyle} />
                          ) : (
                            student.parent_phone || 'غير مسجل'
                          )}
                        </td>

                        <td style={tdStyle}>
                          {isEditing ? (
                            <input type="text" value={editFormData.tuition_status} onChange={e => setEditFormData({ ...editFormData, tuition_status: e.target.value })} style={inputInlineStyle} />
                          ) : (
                            student.tuition_status || '-'
                          )}
                        </td>

                        <td className="no-print" style={tdStyle}>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => handleSaveEdit(student.id)} style={{ padding: '4px 8px', backgroundColor: '#047857', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>💾 حفظ</button>
                              <button onClick={() => setEditingStudentId(null)} style={{ padding: '4px 8px', backgroundColor: '#94a3b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>إلغاء</button>
                            </div>
                          ) : (
                            <button onClick={() => handleStartEdit(student)} style={{ padding: '4px 8px', backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>✏️ تعديل</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>لا يوجد طلاب مسجلين في هذا الفصل بالتصنيف المختار حتى الآن.</p>
          )}
        </div>
      ) : (
        <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>💡 اختر فصلاً من الأعلى لعرض بيانات الطلاب وإدارتها.</p>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
