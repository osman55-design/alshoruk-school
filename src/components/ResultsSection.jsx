import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ResultsSection({ onBack }) {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // الفلاتر المتقدمة للفرز والترتيب
  const [filterLevel, setFilterLevel] = useState('الكل');
  const [filterGrade, setFilterGrade] = useState('الكل');
  const [filterGender, setFilterGender] = useState('الكل');
  const [topCount, setTopCount] = useState('الكل');

  // نموذج رصد الدرجات
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [subject, setSubject] = useState('اللغة العربية');
  const [examType, setExamType] = useState('شهري');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');

  // قائمة المواد الدراسية
  const subjectsList = [
    'التربية الإسلامية', 'التربية المسيحية', 'اللغة العربية', 'الرياضيات',
    'اللغة الإنجليزية', 'العلوم', 'التاريخ', 'الجغرافيا', 'الفيزياء',
    'الكيمياء', 'الأحياء', 'الحاسوب', 'التربية الوطنية'
  ];

  // جلب البيانات من Supabase
  const fetchData = async () => {
    try {
      const { data: stData } = await supabase.from('students_list').select('*').order('student_name');
      if (stData) setStudents(stData);

      const { data: grData } = await supabase.from('student_grades').select('*');
      if (grData) setGrades(grData);
    } catch (err) {
      console.error("خطأ جلب البيانات:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // حفظ درجات الطالب
  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || score === '') {
      alert("يرجى اختيار الطالب وإدخال الدرجة!");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('student_grades').insert([{
        student_id: selectedStudentId,
        subject,
        exam_type: examType,
        score: parseFloat(score),
        max_score: parseFloat(maxScore)
      }]);
      if (error) throw error;
      alert("✅ تم رصد الدرجة بنجاح!");
      setScore('');
      fetchData();
    } catch (err) {
      alert("❌ حدث خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // حساب مجموع الدرجات والنسبة والترتيب التلقائي
  const getRankedStudents = () => {
    const processed = students.map(st => {
      const stGrades = grades.filter(g => String(g.student_id) === String(st.id));
      const totalScore = stGrades.reduce((acc, curr) => acc + (curr.score || 0), 0);
      const totalMax = stGrades.reduce((acc, curr) => acc + (curr.max_score || 100), 0);
      const percentage = totalMax > 0 ? parseFloat(((totalScore / totalMax) * 100).toFixed(2)) : 0;

      return {
        ...st,
        totalScore,
        totalMax,
        percentage,
        subjectCount: stGrades.length
      };
    });

    // تصفية حسب المرحلة والفصل والجنس
    let filtered = processed.filter(st => {
      const matchLevel = filterLevel === 'الكل' || st.academic_level === filterLevel;
      const matchGrade = filterGrade === 'الكل' || (st.class_name && st.class_name.includes(filterGrade));
      const matchGender = filterGender === 'الكل' || st.gender === filterGender;
      return matchLevel && matchGrade && matchGender;
    });

    // الترتيب تنازلياً حسب النسبة والمجموع
    filtered.sort((a, b) => b.percentage - a.percentage || b.totalScore - a.totalScore);

    // إضافة المركز الترتيبي
    const ranked = filtered.map((st, idx) => ({
      ...st,
      rank: idx + 1
    }));

    if (topCount !== 'الكل') {
      return ranked.slice(0, parseInt(topCount));
    }

    return ranked;
  };

  const rankedStudents = getRankedStudents();

  // تصدير النتائج إلى ملف Excel (CSV)
  const exportToExcel = () => {
    if (rankedStudents.length === 0) {
      alert("لا يوجد بيانات لتصديرها!");
      return;
    }

    let csv = "data:text/csv;charset=utf-8,\uFEFF";
    csv += "الترتيب,اسم الطالب,النوع,المرحلة,الفصل والتخصص,المجموع,النسبة المئوية,التقدير\n";

    rankedStudents.forEach(st => {
      const rankText = st.rank === 1 ? "🥇 الأول" : st.rank === 2 ? "🥈 الثاني" : st.rank === 3 ? "🥉 الثالث" : st.rank;
      const evalText = st.percentage >= 90 ? "ممتاز" : st.percentage >= 80 ? "جيد جداً" : st.percentage >= 65 ? "جيد" : st.percentage >= 50 ? "مقبول" : "راسب";
      csv += `"${rankText}","${st.student_name}","${st.gender || ''}","${st.academic_level || ''}","${st.class_name || ''}","${st.totalScore}/${st.totalMax}","${st.percentage}%","${evalText}"\n`;
    });

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `نتائج_وترتيب_${filterLevel}_${filterGrade}.csv`;
    link.click();
  };

  return (
    <div style={{ direction: 'rtl', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* هيدر الصفحة */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>🏆 لوحة ترتيب النتائج وأوائل الفصول</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>فرز تلقائي للأوائل حسب المجموع، الجندر، وفصول الدراسة</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={btnSecondaryStyle}>❌ إغلاق الشاشة</button>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* نموذج إدخال ورصد الدرجات */}
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 14px 0', color: '#0f766e', fontSize: '16px' }}>📝 رصد درجات جديدة:</h4>
          <form onSubmit={handleSaveGrade} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>الطالب *</label>
              <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} required style={inputStyle}>
                <option value="">-- اختر الطالب --</option>
                {students.map(st => <option key={st.id} value={st.id}>{st.student_name} ({st.class_name})</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>المادة *</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}>
                {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>نوع الاختبار</label>
              <select value={examType} onChange={e => setExamType(e.target.value)} style={inputStyle}>
                <option value="شهري">شهري</option>
                <option value="منتصف السنة">منتصف السنة</option>
                <option value="نهائي">نهائي</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>الدرجة *</label>
              <input type="number" step="0.5" value={score} onChange={e => setScore(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>العظمى</label>
              <input type="number" value={maxScore} onChange={e => setMaxScore(e.target.value)} style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
              💾 رصد
            </button>
          </form>
        </div>

        {/* فلاتر التصفية والفرز */}
        <div style={{ ...cardStyle, borderRight: '6px solid #0284c7' }}>
          <h4 style={{ margin: '0 0 14px 0', color: '#1e3a8a', fontSize: '16px' }}>🎯 تصفية وترتيب أوائل الطلاب:</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={labelStyle}>المرحلة التعليمية:</label>
              <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={inputStyle}>
                <option value="الكل">كل المراحل</option>
                <option value="الابتدائية">الابتدائية</option>
                <option value="المتوسطة">المتوسطة</option>
                <option value="الثانوية">الثانوية</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>الفصل الدراسي:</label>
              <input type="text" placeholder="اسم الفصل (مثال: الأول)" value={filterGrade === 'الكل' ? '' : filterGrade} onChange={e => setFilterGrade(e.target.value || 'الكل')} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>الفرز حسب النوع:</label>
              <select value={filterGender} onChange={e => setFilterGender(e.target.value)} style={inputStyle}>
                <option value="الكل">🌐 بنين وبنات</option>
                <option value="ذكر">👦 الأوائل من البنين فقط</option>
                <option value="أنثى">👧 الأوائل من البنات فقط</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>عرض الأوائل فقط:</label>
              <select value={topCount} onChange={e => setTopCount(e.target.value)} style={inputStyle}>
                <option value="الكل">جميع الطلاب بالترتيب</option>
                <option value="3">🥇 الأوائل الـ 3 فقط</option>
                <option value="5">⭐ الأوائل الـ 5 فقط</option>
                <option value="10">🌟 الأوائل الـ 10 فقط</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button onClick={exportToExcel} style={btnSuccessStyle}>📊 تصدير Excel</button>
            <button onClick={() => window.print()} style={btnPrintStyle}>🖨️ طباعة النتيجة / PDF</button>
          </div>
        </div>

        {/* جدول الترتيب والأوائل */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}>
                <th style={thStyle}>المركز</th>
                <th style={thStyle}>اسم الطالب</th>
                <th style={thStyle}>النوع</th>
                <th style={thStyle}>المرحلة والفصل</th>
                <th style={thStyle}>المجموع الكلي</th>
                <th style={thStyle}>النسبة</th>
                <th style={thStyle}>التقدير العام</th>
              </tr>
            </thead>
            <tbody>
              {rankedStudents.length > 0 ? (
                rankedStudents.map((st) => (
                  <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: st.rank === 1 ? '#fefce8' : st.rank === 2 ? '#f8fafc' : st.rank === 3 ? '#fff7ed' : '#ffffff' }}>
                    
                    <td style={tdStyle}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontWeight: '800',
                        fontSize: '13px',
                        backgroundColor: st.rank === 1 ? '#fde047' : st.rank === 2 ? '#e2e8f0' : st.rank === 3 ? '#fdba74' : '#f1f5f9',
                        color: st.rank === 1 ? '#854d0e' : st.rank === 2 ? '#334155' : st.rank === 3 ? '#9a3412' : '#64748b'
                      }}>
                        {st.rank === 1 ? '🥇 الأول' : st.rank === 2 ? '🥈 الثاني' : st.rank === 3 ? '🥉 الثالث' : `المركز ${st.rank}`}
                      </span>
                    </td>

                    <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{st.student_name}</td>
                    <td style={tdStyle}>{st.gender === 'أنثى' ? '👧 أنثى' : '👦 ذكر'}</td>
                    <td style={{ ...tdStyle, color: '#0d9488', fontWeight: '600' }}>{st.academic_level} - {st.class_name}</td>
                    <td style={{ ...tdStyle, fontWeight: '700' }}>{st.totalScore} / {st.totalMax}</td>
                    <td style={{ ...tdStyle, fontWeight: '800', color: '#16a34a' }}>{st.percentage}%</td>
                    
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '12px',
                        backgroundColor: st.percentage >= 90 ? '#dcfce7' : st.percentage >= 75 ? '#e0f2fe' : st.percentage >= 50 ? '#fef3c7' : '#fee2e2',
                        color: st.percentage >= 90 ? '#15803d' : st.percentage >= 75 ? '#0369a1' : st.percentage >= 50 ? '#b45309' : '#b91c1c'
                      }}>
                        {st.percentage >= 90 ? 'ممتاز 🌟' : st.percentage >= 75 ? 'جيد جداً 👍' : st.percentage >= 50 ? 'مقبول 🟡' : 'راسب 🔴'}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '35px', textAlign: 'center', color: '#94a3b8' }}>
                    💡 لا يوجد درجات مرصودة مطابقة لخيارات الفرز الحالية.
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
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: '700',
  color: '#475569'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  fontSize: '14px',
  outline: 'none'
};

const thStyle = { padding: '14px 16px', fontWeight: '700' };
const tdStyle = { padding: '14px 16px', fontSize: '14px' };

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
