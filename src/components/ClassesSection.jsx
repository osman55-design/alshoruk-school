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

const thStyle = { padding: '12px', fontWeight: 'bold', borderBottom: '2px solid #cbd5e1', textAlign: 'right' };
const tdStyle = { padding: '12px', textAlign: 'right' };

export default function ClassesSection() {
  const [activeStage, setActiveStage] = useState('kindergarten');
  const [selectedClass, setSelectedClass] = useState(null);
  
  // 🌟 حالة تصفية الطلاب (الجميع / بنين / بنات)
  const [genderFilter, setGenderFilter] = useState('all');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // 🌟 جلب الطلاب المرتبطين بالفصل المحدد من جدول الطلاب الرئيسي
  const fetchClassStudents = async (className, currentGenderFilter) => {
    setLoading(true);
    try {
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

  // 🌟 طباعة الكشف
  const handlePrintPDF = () => {
    window.print();
  };

  // 🌟 تصدير كشف الفصل إلى Excel
  const handleExportExcel = () => {
    if (!students.length) {
      alert('لا توجد بيانات لتصديرها!');
      return;
    }

    const dataToExport = students.map((s, index) => ({
      'م': index + 1,
      'اسم الطالب': s.student_name || s.full_name || '',
      'المرحلة': s.stage || activeStage,
      'الفصل': s.class_name || selectedClass.name,
      'الجنس': s.gender || '',
      'رقم هاتف ولي الأمر': s.parent_phone || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'طلاب_الفصل');
    XLSX.writeFile(workbook, `كشف_${selectedClass.name}.xlsx`);
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
          {stagesStructure[activeStage].name} - اختر الفصل لعرض الكشف:
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
                <span style={{ fontSize: '11px', color: '#64748b', background: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>عرض الكشف 👈</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🌟 جدول عرض كشف الطلاب المرتبط بالفصل */}
      {selectedClass ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
          
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h4 style={{ margin: 0, color: '#047857', fontSize: '16px', fontWeight: '900' }}>
              📋 كشف طلاب: <span style={{ color: '#d97706' }}>{selectedClass.name}</span>
            </h4>

            {/* 🌟 تصفية (الجميع / بنين / بنات) */}
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

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={handlePrintPDF} style={{ padding: '7px 14px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>🖨️ طباعة الكشف</button>
              <button onClick={handleExportExcel} style={{ padding: '7px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>📤 تصدير Excel</button>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>جاري جلب الكشف من سجل الطلاب...</p>
          ) : students.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#334155' }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>اسم الطالب</th>
                    <th style={thStyle}>المرحلة</th>
                    <th style={thStyle}>الفصل</th>
                    <th style={thStyle}>الجنس</th>
                    <th style={thStyle}>رقم هاتف ولي الأمر</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={tdStyle}>{idx + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0f172a' }}>{student.student_name || student.full_name}</td>
                      <td style={tdStyle}>{student.stage || activeStage}</td>
                      <td style={tdStyle}>{student.class_name}</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: student.gender === 'بنات' ? '#ffe4e6' : '#e0f2fe', color: student.gender === 'بنات' ? '#be123c' : '#0369a1' }}>
                          {student.gender || 'غير محدد'}
                        </span>
                      </td>
                      <td style={tdStyle}>{student.parent_phone || 'غير مسجل'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '25px', color: '#94a3b8' }}>لا توجد أسماء مسجلة لهذا الفصل في قاعدة البيانات حتى الآن.</p>
          )}
        </div>
      ) : (
        <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>💡 اختر فصلاً من القائمة أعلاه لعرض الكشف الخاص به تلقائياً.</p>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
