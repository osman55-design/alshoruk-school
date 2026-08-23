import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SchedulesSection({ onBack }) {
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' أو 'exams'
  const [classesList] = useState(['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس']);
  const [selectedClass, setSelectedClass] = useState('الصف الأول');
  const [academicYear, setAcademicYear] = useState('2025/2026');

  // بيانات جدول الحصص
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const periods = ['الحصة 1', 'الحصة 2', 'الحصة 3', 'الحصة 4', 'الحصة 5'];
  const [scheduleData, setScheduleData] = useState({});

  // بيانات جدول الامتحانات
  const [examSchedules, setExamSchedules] = useState([]);
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examTerm, setExamTerm] = useState('الفترة الأولى');

  useEffect(() => {
    if (activeTab === 'classes') {
      fetchClassSchedules();
    } else {
      fetchExamSchedules();
    }
  }, [selectedClass, academicYear, activeTab]);

  // جلب جدول الحصص للفصل المحدد
  const fetchClassSchedules = async () => {
    const { data } = await supabase
      .from('class_schedules')
      .select('*')
      .eq('class_name', selectedClass);

    const formatted = {};
    (data || []).forEach((item) => {
      formatted[`${item.day_name}_${item.period_number}`] = item.subject_name;
    });
    setScheduleData(formatted);
  };

  // حفظ حصة في جدول الحصص
  const handleCellChange = async (day, periodIndex, subjectName) => {
    const periodNumber = periodIndex + 1;
    const updated = { ...scheduleData, [`${day}_${periodNumber}`]: subjectName };
    setScheduleData(updated);

    // تحديث البيانات في Supabase
    await supabase.from('class_schedules').upsert([
      {
        class_name: selectedClass,
        day_name: day,
        period_number: periodNumber,
        subject_name: subjectName
      }
    ]);
  };

  // جلب جدول الامتحانات
  const fetchExamSchedules = async () => {
    const { data } = await supabase
      .from('exam_schedules')
      .select('*')
      .eq('class_name', selectedClass)
      .eq('academic_year', academicYear);
    setExamSchedules(data || []);
  };

  // إضافة امتحان جديد
  const handleAddExam = async (e) => {
    e.preventDefault();
    if (!examSubject || !examDate) return alert('يرجى اختيار المادة وتاريخ الامتحان');

    const { error } = await supabase.from('exam_schedules').insert([
      {
        class_name: selectedClass,
        academic_year: academicYear,
        exam_term: examTerm,
        subject_name: examSubject,
        exam_date: examDate,
        exam_time: examTime
      }
    ]);

    if (!error) {
      alert('تم إدراج الامتحان بالجدول بنجاح ✨');
      setExamSubject('');
      setExamDate('');
      setExamTime('');
      fetchExamSchedules();
    }
  };

  // حذف امتحان
  const handleDeleteExam = async (id) => {
    if (window.confirm('هل تريد حذف هذا الامتحان من الجدول؟')) {
      await supabase.from('exam_schedules').delete().eq('id', id);
      fetchExamSchedules();
    }
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '22px' }}>🗓️ إدارة جداول الحصص والامتحانات</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>إعداد الحصص الأسبوعية وجداول الاختبارات لكل فصل على حدة</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ⬅️ رجوع
          </button>
        )}
      </div>

      {/* أزرار التبديل وشريط الفلترة */}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('classes')} style={tabButtonStyle(activeTab === 'classes')}>
            📅 جدول الحصص الأسبوعي
          </button>
          <button onClick={() => setActiveTab('exams')} style={tabButtonStyle(activeTab === 'exams')}>
            📝 جدول الامتحانات
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={selectStyle}>
            {classesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
          <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} style={selectStyle}>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
          </select>
        </div>
      </div>

      {/* 1️⃣ عرض جدول الحصص الأسبوعي */}
      {activeTab === 'classes' ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>📌 جدول حصص: <span style={{ color: '#047857' }}>{selectedClass}</span></h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  <th style={thStyle}>اليوم / الحصة</th>
                  {periods.map((p, i) => <th key={i} style={thStyle}>{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ ...tdStyle, fontWeight: 'bold', backgroundColor: '#f8fafc', width: '120px' }}>{day}</td>
                    {periods.map((_, pIdx) => {
                      const key = `${day}_${pIdx + 1}`;
                      return (
                        <td key={pIdx} style={tdStyle}>
                          <input
                            type="text"
                            placeholder="اسم المادة..."
                            value={scheduleData[key] || ''}
                            onChange={(e) => handleCellChange(day, pIdx, e.target.value)}
                            style={tableInputStyle}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2️⃣ عرض جدول الامتحانات */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          
          {/* نموذج إضافة امتحان */}
          <form onSubmit={handleAddExam} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0f172a', fontSize: '15px' }}>➕ إضافة موعد امتحان</h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>الفترة / النوع:</label>
              <select value={examTerm} onChange={(e) => setExamTerm(e.target.value)} style={inputStyle}>
                <option value="الفترة الأولى">الفترة الأولى</option>
                <option value="الفترة الثانية">الفترة الثانية</option>
                <option value="اختبار شهري">اختبار شهري</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>المادة الدراسية:</label>
              <input type="text" placeholder="مثال: القرآن الكريم" value={examSubject} onChange={(e) => setExamSubject(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>تاريخ الامتحان:</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>زمن الامتحان (الوقت):</label>
              <input type="text" placeholder="مثال: 08:00 ص - 10:00 ص" value={examTime} onChange={(e) => setExamTime(e.target.value)} style={inputStyle} />
            </div>

            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              إدراج في الجدول 💾
            </button>
          </form>

          {/* جدول الامتحانات المضافة */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#fff' }}>
                  <th style={thStyle}>المادة</th>
                  <th style={thStyle}>النوع / الفترة</th>
                  <th style={thStyle}>التاريخ</th>
                  <th style={thStyle}>الزمن</th>
                  <th style={thStyle}>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {examSchedules.length > 0 ? (
                  examSchedules.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0f172a' }}>{row.subject_name}</td>
                      <td style={tdStyle}>{row.exam_term}</td>
                      <td style={{ ...tdStyle, color: '#047857', fontWeight: 'bold' }}>{row.exam_date}</td>
                      <td style={tdStyle}>{row.exam_time || '—'}</td>
                      <td style={tdStyle}>
                        <button onClick={() => handleDeleteExam(row.id)} style={{ padding: '4px 8px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>حذف 🗑️</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{ padding: '25px', color: '#94a3b8' }}>لا توجد امتحانات مضافة لهذا الفصل بعد.</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}

const tabButtonStyle = (active) => ({
  padding: '10px 18px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: active ? '#047857' : '#f1f5f9',
  color: active ? '#ffffff' : '#475569',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s'
});

const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '13px' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' };
const tableInputStyle = { width: '90%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' };
const thStyle = { padding: '12px 10px', fontSize: '13px' };
const tdStyle = { padding: '10px 8px', fontSize: '13px', border: '1px solid #f1f5f9' };
