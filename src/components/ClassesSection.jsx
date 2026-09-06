import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// 🎨 أنماط التصميم (مُعرفة في البداية لضمان الوضوح وإعادة الاستخدام)
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

const filterBtnStyle = (isActive) => ({
  padding: '5px 10px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: isActive ? '#047857' : 'transparent',
  color: isActive ? '#ffffff' : '#475569'
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
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🌟 حالات الفلترة والتعديل
  const [genderFilter, setGenderFilter] = useState('all');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', parent_phone: '', payment_status: 'غير مكتمل', notes: '' });

  // 🌟 هيكلية الفصول والتخصصات لكل مرحلة
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
        { id: 's3_sci_eng', name: 'ثالث ثانوي - علمي (هندسية)' },
        { id: 's3_lit_islamic', name: 'ثالث ثانوي - أدبي (دراسات إسلامية)' },
        { id: 's3_lit_english', name: 'ثالث ثانوي - أدبي (الأدب الإنجليزي)' },
        { id: 's3_lit_arts', name: 'ثالث ثانوي - أدبي (الفنون)' },
        { id: 's3_lit_other', name: 'ثالث ثانوي - أدبي (تخصصات أخرى)' }
      ]
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass.name);
    }
  }, [selectedClass]);

  const fetchClassStudents = async (className) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_class', className)
        .order('name', { ascending: true });

      if (!error && data) {
        setStudents(data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 فلترة الطلاب حسب الجنس
  const filteredStudents = students.filter(student => {
    if (genderFilter === 'male') return student.gender === 'ذكر' || student.gender === 'ولد';
    if (genderFilter === 'female') return student.gender === 'أنثى' || student.gender === 'بنت';
    return true;
  });

  // 🌟 بدء تعديل طالب
  const handleStartEdit = (student) => {
    setEditingStudentId(student.id);
    setEditFormData({
      name: student.name || '',
      parent_phone: student.parent_phone || '',
      payment_status: student.payment_status || 'غير مكتمل',
      notes: student.notes || ''
    });
  };

  // 🌟 حفظ تعديل الطالب في Supabase
  const handleSaveEdit = async (id) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: editFormData.name,
          parent_phone: editFormData.parent_phone,
          payment_status: editFormData.payment_status,
          notes: editFormData.notes
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

  // 🌟 طباعة القائمة / PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // 🌟 تصدير ملف Excel (CSV)
  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      alert('لا توجد بيانات للتصدير!');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'الاسم,رقم ولي الأمر,الجنس,حالة السداد,ملاحظات\n';

    filteredStudents.forEach(s => {
      csvContent += `"${s.name || ''}","${s.parent_phone || ''}","${s.gender || ''}","${s.payment_status || ''}","${s.notes || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `قائمة_طلاب_${selectedClass.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '10px', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* 🌟 أزرار التنقل بين المراحل 🌟 */}
      <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => { setActiveStage('kindergarten'); setSelectedClass(null); }} style={stageBtnStyle(activeStage === 'kindergarten', '#be123c', '#ffe4e6')}>
          🧸 مرحلة الروضة
        </button>
        <button onClick={() => { setActiveStage('primary'); setSelectedClass(null); }} style={stageBtnStyle(activeStage === 'primary', '#b45309', '#fef3c7')}>
          🏫 المرحلة الابتدائية
        </button>
        <button onClick={() => { setActiveStage('middle'); setSelectedClass(null); }} style={stageBtnStyle(activeStage === 'middle', '#047857', '#d1fae5')}>
          🎒 المرحلة المتوسطة
        </button>
        <button onClick={() => { setActiveStage('secondary'); setSelectedClass(null); }} style={stageBtnStyle(activeStage === 'secondary', '#6d28d9', '#ede9fe')}>
          🎓 المرحلة الثانوية
        </button>
      </div>

      {/* 🌟 شبكة عرض الفصول 🌟 */}
      <div className="no-print" style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
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
                  justifyInContent: 'space-between'
                }}
              >
                <span style={{ fontWeight: '800', fontSize: '13px', color: isSelected ? '#047857' : '#334155' }}>
                  📖 {cls.name}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', background: '#ffffff', padding: '2px 8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>عرض 👈</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🌟 عرض الفصل المختار والخيارات والجدول 🌟 */}
      {selectedClass ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
          
          {/* شريط الأدوات والفلترة والطباعة */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '16px', fontWeight: '900' }}>
              📋 قوائم طلاب: <span style={{ color: '#d97706' }}>{selectedClass.name}</span>
            </h4>

            {/* أزرار اختيار الجنس */}
            <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              <button onClick={() => setGenderFilter('all')} style={filterBtnStyle(genderFilter === 'all')}>👥 الجميع</button>
              <button onClick={() => setGenderFilter('male')} style={filterBtnStyle(genderFilter === 'male')}>👦 أولاد</button>
              <button onClick={() => setGenderFilter('female')} style={filterBtnStyle(genderFilter === 'female')}>👧 بنات</button>
            </div>

            {/* أزرار الطباعة والتصدير */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handlePrintPDF} style={{ padding: '7px 14px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                🖨️ طباعة / PDF
              </button>
              <button onClick={handleExportExcel} style={{ padding: '7px 14px', backgroundColor: '#15803d', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                📊 تصدير Excel
              </button>
            </div>
          </div>

          {/* الجدول */}
          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>جاري تحميل البيانات...</p>
          ) : filteredStudents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#334155' }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>اسم الطالب</th>
                    <th style={thStyle}>رقم ولي الأمر</th>
                    <th style={thStyle}>حالة السداد</th>
                    <th style={thStyle}>ملاحظات</th>
                    <th className="no-print" style={thStyle}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => {
                    const isEditing = editingStudentId === student.id;
                    return (
                      <tr key={student.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={tdStyle}>{idx + 1}</td>
                        
                        {/* الاسم */}
                        <td style={tdStyle}>
                          {isEditing ? (
                            <input type="text" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} style={inputInlineStyle} />
                          ) : (
                            <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{student.name}</span>
                          )}
                        </td>

                        {/* رقم هاتف ولي الأمر */}
                        <td style={tdStyle}>
                          {isEditing ? (
                            <input type="text" value={editFormData.parent_phone} onChange={e => setEditFormData({ ...editFormData, parent_phone: e.target.value })} style={inputInlineStyle} />
                          ) : (
                            student.parent_phone || 'غير مسجل'
                          )}
                        </td>

                        {/* حالة السداد */}
                        <td style={tdStyle}>
                          {isEditing ? (
                            <select value={editFormData.payment_status} onChange={e => setEditFormData({ ...editFormData, payment_status: e.target.value })} style={inputInlineStyle}>
                              <option value="مكتمل">مكتمل</option>
                              <option value="غير مكتمل">غير مكتمل</option>
                              <option value="مُعفى">مُعفى</option>
                            </select>
                          ) : (
                            <span style={{
                              padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
                              backgroundColor: student.payment_status === 'مكتمل' ? '#d1fae5' : '#fee2e2',
                              color: student.payment_status === 'مكتمل' ? '#047857' : '#dc2626'
                            }}>
                              {student.payment_status || 'غير محدد'}
                            </span>
                          )}
                        </td>

                        {/* ملاحظات */}
                        <td style={tdStyle}>
                          {isEditing ? (
                            <input type="text" value={editFormData.notes} onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })} style={inputInlineStyle} />
                          ) : (
                            student.notes || '-'
                          )}
                        </td>

                        {/* أزرار التعديل والحفظ */}
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
            <p style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>لا يوجد طلاب مطابقين للخيارات المختارة.</p>
          )}
        </div>
      ) : (
        <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>💡 اختر فضلاً لعرض الطلاب والبدء بالإدارة.</p>
      )}

      {/* 🎨 تنسيق إخفاء الأزرار عند الطباعة */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
