import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ResultsSection() {
  const [grades, setGrades] = useState([]);
  const [classesList] = useState(['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس']);
  const [selectedClass, setSelectedClass] = useState('الصف الأول');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGrades();
  }, [selectedClass, academicYear]);

  const fetchGrades = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('student_grades')
      .select('*')
      .eq('class_name', selectedClass)
      .eq('academic_year', academicYear);
    setGrades(data || []);
    setLoading(false);
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <h2 style={{ color: '#047857', fontWeight: '900' }}>📋 كشف درجات الامتحانات والنتائج</h2>
      
      {/* شريط الفلترة حسب الفصل والعام الدراسي */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>📅 العام الدراسي:</label>
          <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={selectStyle}>
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>🏛️ الفصل الدراسي:</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={selectStyle}>
            {classesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* جدول النتائج التفصيلي */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}>
              <th style={thStyle}>الطالب</th>
              <th style={thStyle}>المادة</th>
              <th style={thStyle}>شهر 1</th>
              <th style={thStyle}>شهر 2</th>
              <th style={thStyle}>شهر 3</th>
              <th style={{ ...thStyle, backgroundColor: '#0284c7' }}>الفترة الأولى</th>
              <th style={{ ...thStyle, backgroundColor: '#0284c7' }}>الفترة الثانية</th>
              <th style={{ ...thStyle, backgroundColor: '#047857' }}>النتيجة النهائية</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{row.student_name}</td>
                <td style={tdStyle}>{row.subject_name}</td>
                <td style={tdStyle}>{row.month_1}</td>
                <td style={tdStyle}>{row.month_2}</td>
                <td style={tdStyle}>{row.month_3}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0284c7' }}>{row.term_1}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0284c7' }}>{row.term_2}</td>
                <td style={{ ...tdStyle, fontWeight: '900', color: '#047857', backgroundColor: '#ecfdf5' }}>
                  {(Number(row.term_1 || 0) + Number(row.term_2 || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold' };
const thStyle = { padding: '10px', border: '1px solid #334155' };
const tdStyle = { padding: '10px', border: '1px solid #e2e8f0', fontSize: '13px' };
