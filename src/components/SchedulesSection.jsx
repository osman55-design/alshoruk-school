import React, { useState } from 'react';

export default function SchedulesSection() {
  const [activeSubTab, setActiveSubTab] = useState('classes'); // 'classes' or 'exams'
  const [selectedClass, setSelectedClass] = useState('الصف الأول');
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  return (
    <div style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveSubTab('classes')} style={tabBtnStyle(activeSubTab === 'classes')}>📅 جدول الحصص الأسبوعي</button>
        <button onClick={() => setActiveSubTab('exams')} style={tabBtnStyle(activeSubTab === 'exams')}>📝 جدول الامتحانات</button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginLeft: '10px' }}>اختر الفصل:</label>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
          <option value="الصف الأول">الصف الأول</option>
          <option value="الصف الثاني">الصف الثاني</option>
          <option value="الصف الثالث">الصف الثالث</option>
        </select>
      </div>

      {activeSubTab === 'classes' ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: '#047857', color: '#fff' }}>
                <th style={cellStyle}>اليوم / الحصة</th>
                <th style={cellStyle}>الحصة 1</th>
                <th style={cellStyle}>الحصة 2</th>
                <th style={cellStyle}>الحصة 3</th>
                <th style={cellStyle}>الحصة 4</th>
                <th style={cellStyle}>الحصة 5</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ ...cellStyle, fontWeight: 'bold', backgroundColor: '#f8fafc' }}>{day}</td>
                  <td style={cellStyle}>القرآن الكريم</td>
                  <td style={cellStyle}>الرياضيات</td>
                  <td style={cellStyle}>اللغة العربية</td>
                  <td style={cellStyle}>العلوم</td>
                  <td style={cellStyle}>اللغة الإنجليزية</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h3>📋 جدول امتحانات {selectedClass}</h3>
          <p style={{ color: '#64748b' }}>يمكنك تعيين المادة وتاريخ ووقت الامتحان الخاص بكل فصل.</p>
        </div>
      )}
    </div>
  );
}

const tabBtnStyle = (active) => ({
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: active ? '#047857' : '#e2e8f0',
  color: active ? '#fff' : '#334155',
  fontWeight: 'bold',
  cursor: 'pointer'
});
const cellStyle = { padding: '12px', border: '1px solid #cbd5e1', fontSize: '13px' };
