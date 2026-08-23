import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ClassDistributionSection({ onBack }) {
  const [students, setStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('الابتدائية');
  const [selectedGrade, setSelectedGrade] = useState('الكل');
  const [selectedSubTrack, setSelectedSubTrack] = useState('الكل'); // للفرع والتخصص
  const [selectedGender, setSelectedGender] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // قوائم الصفوف لكل مرحلة
  const gradesByLevel = {
    'الابتدائية': ['الكل', 'الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المتوسطة': ['الكل', 'الصف الأول متوسط', 'الصف الثاني متوسط', 'الصف الثالث متوسط'],
    'الثانوية': ['الكل', 'الصف الأول ثانوي', 'الصف الثاني ثانوي', 'الصف الثالث ثانوي']
  };

  // تفريعات الصف الثالث ثانوي
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

  // تغيير المرحلة وتصفير الصف والتخصص
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setSelectedGrade('الكل');
    setSelectedSubTrack('الكل');
  };

  // تغيير الصف
  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setSelectedSubTrack('الكل');
  };

  // الفلترة والفرز الذكي
  const filteredStudents = students.filter(st => {
    const matchesLevel = st.academic_level === selectedLevel;
    const matchesGrade = selectedGrade === 'الكل' || (st.class_name && st.class_name.includes(selectedGrade));
    
    // فلترة الفرع/التخصص الخاص بالصف الثالث
    const matchesSubTrack = selectedSubTrack === 'الكل' || (st.class_name && st.class_name.includes(selectedSubTrack));

    const matchesGender = selectedGender === 'الكل' || st.gender === selectedGender;
    const matchesSearch = 
      (st.student_name && st.student_name.includes(searchTerm)) ||
      (st.parent_phone && st.parent_phone.includes(searchTerm));

    return matchesLevel && matchesGrade && matchesSubTrack && matchesGender && matchesSearch;
  });

  // تصدير البيانات إلى Excel (CSV)
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

  // الطباعة وحفظ PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ direction: 'rtl', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* الشريط العلوي */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🏛️ المراقبة والفرز التلقائي للفصول الدراسية
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>توزيع وفرز ذكي لصفوف الطلاب وتخصصات الفرع العلمي والأدبي</p>
        </div>

        {onBack && (
          <button onClick={onBack} style={btnSecondaryStyle}>
            ↩️ عودة للوحة الرئيسية
          </button>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* أزرار اختيار المرحلة التعليمية */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['الابتدائية', 'المتوسطة', 'الثانوية'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedLevel === lvl ? '#0d9488' : '#ffffff',
                color: selectedLevel === lvl ? '#ffffff' : '#475569',
                boxShadow: selectedLevel === lvl ? '0 4px 12px rgba(13, 148, 136, 0.3)' : '0 2px 4px rgba(0,0,0,0.03)',
                border: selectedLevel === lvl ? 'none' : '1px solid #e2e8f0'
              }}
            >
              {lvl === 'الابتدائية' && '📕 '}
              {lvl === 'المتوسطة' && '📚 '}
              {lvl === 'الثانوية' && '🎓 '}
              المرحلة {lvl}
            </button>
          ))}
        </div>

        {/* كارت الإحصائيات وفلترة الصفوف والنوع */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* كارت الفلترة المتقدمة */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>🔎 فحص الصف الدراسي داخل ({selectedLevel}):</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {gradesByLevel[selectedLevel].map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGradeChange(g)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backgroundColor: selectedGrade === g ? '#0f766e' : '#f8fafc',
                      color: selectedGrade === g ? '#ffffff' : '#334155'
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* تفريعات الصف الثالث ثانوي (تظهر تلقائياً إذا كان الاختيار الثالث ثانوي) */}
            {selectedLevel === 'الثانوية' && selectedGrade === 'الصف الثالث ثانوي' && (
              <div style={{ marginBottom: '15px', background: '#fffbeb', padding: '10px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                <label style={{ ...labelStyle, color: '#b45309' }}>🧬 تصفية الفرع والتخصص الفرعي:</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {thirdSecondaryTracks.map((tr) => (
                    <button
                      key={tr}
                      onClick={() => setSelectedSubTrack(tr)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #f59e0b',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        backgroundColor: selectedSubTrack === tr ? '#d97706' : '#ffffff',
                        color: selectedSubTrack === tr ? '#ffffff' : '#b45309'
                      }}
                    >
                      {tr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* فلترة حسب النوع (بنين / بنات) */}
            <div>
              <label style={labelStyle}>👥 تصفية حسب النوع:</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                {[
                  { id: 'الكل', label: '🌐 الكل (أولاد وبنات)' },
                  { id: 'ذكر', label: '👦 بنين فقط' },
                  { id: 'أنثى', label: '👧 بنات فقط' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGender(item.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      backgroundColor: selectedGender === item.id ? '#f59e0b' : '#ffffff',
                      color: selectedGender === item.id ? '#ffffff' : '#475569'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* كارت عداد الطلاب والقوة الفعلية */}
          <div style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justify: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '15px', fontWeight: '600', opacity: 0.9 }}>📊 إجمالي قوة القيد الحالية بالمحدّد</span>
            <div style={{ fontSize: '42px', fontWeight: '900', margin: '10px 0' }}>
              {filteredStudents.length} <span style={{ fontSize: '20px', fontWeight: '600' }}>طالباً</span>
            </div>
            <span style={{ fontSize: '13px', opacity: 0.8 }}>
              {selectedLevel} - {selectedGrade} {selectedSubTrack !== 'الكل' ? `(${selectedSubTrack})` : ''} ({selectedGender === 'الكل' ? 'بنين وبنات' : selectedGender})
            </span>
          </div>

        </div>

        {/* شريط البحث وتصدر البيانات */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="🔍 ابحث بالاسم أو برقم الهاتف..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: '1',
              minWidth: '260px',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '14px',
              backgroundColor: '#ffffff'
            }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportToExcel} style={btnSuccessStyle}>
              📊 تصدير Excel
            </button>
            <button onClick={handlePrint} style={btnPrintStyle}>
              🖨️ طباعة / PDF
            </button>
          </div>
        </div>

        {/* جدول العرض العصري */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f766e', color: '#ffffff', fontSize: '14px' }}>
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
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>جاري تحميل البيانات...</td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#1e293b' }}>{st.student_name}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: st.gender === 'أنثى' ? '#fce7f3' : '#e0f2fe',
                        color: st.gender === 'أنثى' ? '#be185d' : '#0369a1'
                      }}>
                        {st.gender === 'أنثى' ? '👧 أنثى' : '👦 ذكر'}
                      </span>
                    </td>
                    <td style={tdStyle}>{st.academic_level}</td>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#0d9488' }}>{st.class_name}</td>
                    <td style={tdStyle}>{st.parent_phone || '---'}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: st.payment_status === 'مسدد بالكامل' ? '#dcfce7' : st.payment_status === 'مسدد جزئياً' ? '#fef3c7' : '#fee2e2',
                        color: st.payment_status === 'مسدد بالكامل' ? '#15803d' : st.payment_status === 'مسدد جزئياً' ? '#b45309' : '#b91c1c'
                      }}>
                        {st.payment_status || 'غير مسدد'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '35px', textAlign: 'center', color: '#94a3b8' }}>
                    💡 لا يوجد طلاب مقيدين حالياً يطابقون خيارات الفلترة أو التخصص المختارة!
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

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#475569',
  display: 'block'
};

const thStyle = {
  padding: '14px 16px',
  fontWeight: '700'
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '14px'
};

const btnSecondaryStyle = {
  padding: '10px 18px',
  backgroundColor: '#ffffff',
  color: '#475569',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600'
};

const btnSuccessStyle = {
  padding: '10px 18px',
  backgroundColor: '#16a34a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '700'
};

const btnPrintStyle = {
  padding: '10px 18px',
  backgroundColor: '#0284c7',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '700'
};
