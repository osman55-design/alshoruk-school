import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ClassDistributionSection({ onBack }) {
  const [students, setStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('الابتدائية');
  const [selectedGrade, setSelectedGrade] = useState('الكل');
  const [selectedSubTrack, setSelectedSubTrack] = useState('الكل');
  const [selectedGender, setSelectedGender] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const gradesByLevel = {
    'الابتدائية': ['الكل', 'الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المتوسطة': ['الكل', 'الصف الأول متوسط', 'الصف الثاني متوسط', 'الصف الثالث متوسط'],
    'الثانوية': ['الكل', 'الصف الأول ثانوي', 'الصف الثاني ثانوي', 'الصف الثالث ثانوي']
  };

  const thirdSecondaryTracks = [
    'الكل',
    'علمي - أحياء',
    'علمي - حاسوب',
    'علمي - هندسية',
    'أدبي - دراسات إسلامية',
    'أدبي - فنون',
    'أدبي - الأدب الإنجليزي',
    'أدبي - أخرى'
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students_list')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setStudents(data);
    } catch (err) {
      console.error("خطأ جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setSelectedGrade('الكل');
    setSelectedSubTrack('الكل');
  };

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setSelectedSubTrack('الكل');
  };

  const filteredStudents = students.filter(st => {
    const matchesLevel = st.academic_level === selectedLevel;
    const matchesGrade = selectedGrade === 'الكل' || (st.class_name && st.class_name.includes(selectedGrade));
    const matchesSubTrack = selectedSubTrack === 'الكل' || (st.class_name && st.class_name.includes(selectedSubTrack));
    const matchesGender = selectedGender === 'الكل' || st.gender === selectedGender;
    const matchesSearch = 
      (st.student_name && st.student_name.includes(searchTerm)) ||
      (st.parent_phone && st.parent_phone.includes(searchTerm));

    return matchesLevel && matchesGrade && matchesSubTrack && matchesGender && matchesSearch;
  });

  const exportToExcel = () => {
    if (filteredStudents.length === 0) {
      alert("لا يوجد بيانات لتصديرها!");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "اسم الطالب,النوع,المرحلة,الصف والتخصص,رقم الهاتف,موقف الرسوم\n";

    filteredStudents.forEach(st => {
      const row = `"${st.student_name || ''}","${st.gender || ''}","${st.academic_level || ''}","${st.class_name || ''}","${st.parent_phone || ''}","${st.payment_status || ''}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `طلاب_${selectedLevel}_${selectedGrade}_${selectedSubTrack}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={containerStyle}>
      {/* 🌟 الشريط العلوي */}
      <div style={headerContainerStyle}>
        <div>
          <h2 style={titleStyle}>
            <span>🏛️</span> المراقبة والفرز التلقائي للفصول الدراسية
          </h2>
          <p style={subtitleStyle}>توزيع وفرز ذكي لصفوف الطلاب وتخصصات الفرع العلمي والأدبي</p>
        </div>

        {onBack && (
          <button onClick={onBack} style={glassBtnSecondary}>
            ↩️ العودة للرئيسية
          </button>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 📚 أزرار اختيار المرحلة التعليمية */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['الابتدائية', 'المتوسطة', 'الثانوية'].map((lvl) => {
            const isActive = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                style={{
                  ...levelTabStyle,
                  backgroundColor: isActive ? 'rgba(13, 148, 136, 0.85)' : 'rgba(255, 255, 255, 0.6)',
                  color: isActive ? '#ffffff' : '#334155',
                  boxShadow: isActive ? '0 10px 20px rgba(13, 148, 136, 0.25)' : '0 4px 10px rgba(0,0,0,0.03)',
                  border: isActive ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.7)'
                }}
              >
                {lvl === 'الابتدائية' && '📕 '}
                {lvl === 'المتوسطة' && '📚 '}
                {lvl === 'الثانوية' && '🎓 '}
                المرحلة {lvl}
              </button>
            );
          })}
        </div>

        {/* 📊 بطاقات الفلترة والأرقام */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* كارت الفلترة المتقدمة */}
          <div style={glassCardStyle}>
            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>🔎 فحص الصف الدراسي داخل ({selectedLevel}):</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                {gradesByLevel[selectedLevel].map((g) => {
                  const isActive = selectedGrade === g;
                  return (
                    <button
                      key={g}
                      onClick={() => handleGradeChange(g)}
                      style={{
                        ...chipButtonStyle,
                        backgroundColor: isActive ? '#0f766e' : 'rgba(241, 245, 249, 0.8)',
                        color: isActive ? '#ffffff' : '#334155',
                        border: isActive ? '1px solid #0f766e' : '1px solid #cbd5e1'
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* تفريعات الصف الثالث ثانوي */}
            {selectedLevel === 'الثانوية' && selectedGrade === 'الصف الثالث ثانوي' && (
              <div style={subTrackCardStyle}>
                <label style={{ ...labelStyle, color: '#b45309' }}>🧬 تصفية الفرع والتخصص الفرعي:</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {thirdSecondaryTracks.map((tr) => {
                    const isActive = selectedSubTrack === tr;
                    return (
                      <button
                        key={tr}
                        onClick={() => setSelectedSubTrack(tr)}
                        style={{
                          ...chipButtonStyle,
                          fontSize: '12px',
                          padding: '5px 10px',
                          backgroundColor: isActive ? '#d97706' : '#ffffff',
                          color: isActive ? '#ffffff' : '#b45309',
                          border: '1px solid #f59e0b'
                        }}
                      >
                        {tr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* فلترة النوع */}
            <div style={{ marginTop: '15px' }}>
              <label style={labelStyle}>👥 تصفية حسب النوع:</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'الكل', label: '🌐 الكل' },
                  { id: 'ذكر', label: '👦 بنين' },
                  { id: 'أنثى', label: '👧 بنات' }
                ].map((item) => {
                  const isActive = selectedGender === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedGender(item.id)}
                      style={{
                        ...chipButtonStyle,
                        backgroundColor: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.8)',
                        color: isActive ? '#ffffff' : '#475569',
                        border: isActive ? '1px solid #f59e0b' : '1px solid #cbd5e1'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 📈 كارت عداد الطلاب الزجاجي الملون */}
          <div style={counterGlassCardStyle}>
            <span style={{ fontSize: '15px', fontWeight: '700', opacity: 0.9 }}>📊 إجمالي قوة القيد الحالية</span>
            <div style={{ fontSize: '46px', fontWeight: '900', margin: '8px 0' }}>
              {filteredStudents.length} <span style={{ fontSize: '20px', fontWeight: '600' }}>طالباً</span>
            </div>
            <div style={badgeDetailStyle}>
              {selectedLevel} - {selectedGrade} {selectedSubTrack !== 'الكل' ? `(${selectedSubTrack})` : ''} • ({selectedGender === 'الكل' ? 'بنين وبنات' : selectedGender})
            </div>
          </div>

        </div>

        {/* 🔍 شريط البحث والأزرار */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="🔍 ابحث عن طالب برقم الهاتف أو الاسم..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportToExcel} style={glassBtnSuccess}>
              📊 تصدير Excel
            </button>
            <button onClick={handlePrint} style={glassBtnPrimary}>
              🖨️ طباعة / PDF
            </button>
          </div>
        </div>

        {/* 📋 الجدول الزجاجي المبتكر */}
        <div style={tableWrapperStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={tableHeaderStyle}>
                <th style={thStyle}>اسم الطالب الفعّال</th>
                <th style={thStyle}>النوع</th>
                <th style={thStyle}>المرحلة</th>
                <th style={thStyle}>الصف والتخصص</th>
                <th style={thStyle}>رقم ولي الأمر</th>
                <th style={thStyle}>حالة الحساب المالي</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '35px', textAlign: 'center', color: '#64748b' }}>
                    ✨ جاري تحميل البيانات بسلاسة...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id} style={tableRowStyle}>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{st.student_name}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...statusTagStyle,
                        backgroundColor: st.gender === 'أنثى' ? 'rgba(252, 231, 243, 0.9)' : 'rgba(224, 242, 254, 0.9)',
                        color: st.gender === 'أنثى' ? '#be185d' : '#0369a1'
                      }}>
                        {st.gender === 'أنثى' ? '👧 أنثى' : '👦 ذكر'}
                      </span>
                    </td>
                    <td style={tdStyle}>{st.academic_level}</td>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#0f766e' }}>{st.class_name}</td>
                    <td style={tdStyle}>{st.parent_phone || '---'}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...statusTagStyle,
                        backgroundColor: st.payment_status === 'مسدد بالكامل' ? 'rgba(220, 252, 231, 0.9)' : st.payment_status === 'مسدد جزئياً' ? 'rgba(254, 243, 199, 0.9)' : 'rgba(254, 226, 226, 0.9)',
                        color: st.payment_status === 'مسدد بالكامل' ? '#15803d' : st.payment_status === 'مسدد جزئياً' ? '#b45309' : '#b91c1c'
                      }}>
                        {st.payment_status || 'غير مسدد'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    🔍 لا توجد نتائج تطابق خيارات التصفية الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// 💎 التنسيقات والأنماط الزجاجية (Glassmorphism Styles)
// ----------------------------------------------------

const containerStyle = {
  direction: 'rtl',
  padding: '30px 20px',
  fontFamily: "'Segoe UI', Roboto, sans-serif",
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  minHeight: '100vh'
};

const headerContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto 24px auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px'
};

const titleStyle = {
  margin: 0,
  color: '#0f172a',
  fontSize: '24px',
  fontWeight: '800',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const subtitleStyle = {
  margin: '4px 0 0 0',
  color: '#64748b',
  fontSize: '14px'
};

const glassCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '20px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
};

const counterGlassCardStyle = {
  ...glassCardStyle,
  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.95) 100%)',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  boxShadow: '0 15px 30px rgba(16, 185, 129, 0.25)'
};

const badgeDetailStyle = {
  fontSize: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(4px)',
  padding: '6px 14px',
  borderRadius: '20px'
};

const levelTabStyle = {
  padding: '12px 24px',
  borderRadius: '14px',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)'
};

const chipButtonStyle = {
  padding: '6px 14px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const subTrackCardStyle = {
  marginBottom: '10px',
  backgroundColor: 'rgba(254, 243, 199, 0.6)',
  backdropFilter: 'blur(8px)',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(251, 191, 36, 0.5)'
};

const searchInputStyle = {
  flex: '1',
  minWidth: '260px',
  padding: '12px 18px',
  borderRadius: '14px',
  border: '1px solid rgba(203, 213, 225, 0.8)',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  outline: 'none',
  fontSize: '14px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
};

const glassBtnSecondary = {
  padding: '10px 18px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(8px)',
  color: '#475569',
  border: '1px solid #cbd5e1',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700'
};

const glassBtnSuccess = {
  padding: '10px 18px',
  backgroundColor: '#16a34a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  boxShadow: '0 6px 16px rgba(22, 163, 74, 0.25)'
};

const glassBtnPrimary = {
  padding: '10px 18px',
  backgroundColor: '#0284c7',
  color: '#ffffff',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  boxShadow: '0 6px 16px rgba(2, 132, 199, 0.25)'
};

const tableWrapperStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
};

const tableHeaderStyle = {
  backgroundColor: 'rgba(15, 118, 110, 0.95)',
  color: '#ffffff',
  fontSize: '14px'
};

const tableRowStyle = {
  borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
  transition: 'background-color 0.2s ease'
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#475569',
  display: 'block'
};

const thStyle = {
  padding: '16px',
  fontWeight: '700'
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '14px'
};

const statusTagStyle = {
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '700'
};
