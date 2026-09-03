import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function ResultsSection({ onBack }) {
  const [grades, setGrades] = useState([]);
  const [classesList] = useState(['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس']);
  const [selectedClass, setSelectedClass] = useState('الصف الأول');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [loading, setLoading] = useState(false);

  // حالة عرض الشهادة وطباعتها + التحكم بتفاصيلها
  const [activeCertificateStudent, setActiveCertificateStudent] = useState(null);
  const [isBlankCertificate, setIsBlankCertificate] = useState(false);
  
  // بيانات الشهادة القابلة للتعديل أثناء العرض
  const [certSchoolName, setCertSchoolName] = useState('مدرسة الشروق السودانية بأسوان');
  const [certYear, setCertYear] = useState('2025/2026');
  const [certClass, setCertClass] = useState('الصف الأول');
  const [certExamName, setCertExamName] = useState('نتيجة إمتحانات الفترة النهائية للمرحلة المتوسطة');
  const [certDate, setCertDate] = useState('2026 / 6 / 7');

  // حقول نموذج الإضافة
  const [studentName, setStudentName] = useState('');
  const [subjectName, setSubjectName] = useState('التربية الإسلامية');
  const [month1, setMonth1] = useState('');
  const [month2, setMonth2] = useState('');
  const [month3, setMonth3] = useState('');
  const [term1, setTerm1] = useState('');
  const [term2, setTerm2] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchGrades();
    setCertClass(selectedClass);
    setCertYear(academicYear);
  }, [selectedClass, academicYear]);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_grades')
        .select('*')
        .eq('class_name', selectedClass)
        .eq('academic_year', academicYear)
        .order('id', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (grades.length === 0) {
      alert('لا توجد بيانات متاحة للتصدير في هذا الفصل حالياً.');
      return;
    }

    const exportData = grades.map(row => ({
      'اسم الطالب': row.student_name,
      'الصف الدراسي': row.class_name,
      'العام الدراسي': row.academic_year,
      'المادة': row.subject_name,
      'شهر 1': row.month_1 || 0,
      'شهر 2': row.month_2 || 0,
      'شهر 3': row.month_3 || 0,
      'الفترة الأولى': row.term_1 || 0,
      'الفترة الثانية': row.term_2 || 0,
      'النتيجة النهائية': (parseFloat(row.term_1) || 0) + (parseFloat(row.term_2) || 0)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedClass);
    XLSX.writeFile(workbook, `نتائج_${selectedClass}_${academicYear.replace('/', '-')}.xlsx`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setLoading(true);
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          alert('الملف فارغ أو صيغته غير صحيحة.');
          setLoading(false);
          return;
        }

        const rowsToInsert = data.map(item => ({
          student_name: item['اسم الطالب'] || item['Student Name'] || item['student_name'] || 'طالب جديد',
          class_name: selectedClass,
          academic_year: academicYear,
          subject_name: item['المادة'] || item['Subject'] || subjectName,
          month_1: parseFloat(item['شهر 1'] || item['Month 1'] || 0),
          month_2: parseFloat(item['شهر 2'] || item['Month 2'] || 0),
          month_3: parseFloat(item['شهر 3'] || item['Month 3'] || 0),
          term_1: parseFloat(item['الفترة الأولى'] || item['Term 1'] || 0),
          term_2: parseFloat(item['الفترة الثانية'] || item['Term 2'] || 0)
        }));

        const { error } = await supabase.from('student_grades').insert(rowsToInsert);
        if (error) throw error;

        alert(`تم رفع واستيراد ${rowsToInsert.length} سجل بنجاح 🚀`);
        fetchGrades();
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء قراءة ملف الإكسيل.');
      } finally {
        setLoading(false);
        e.target.value = null;
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('يرجى كتابة اسم الطالب');
      return;
    }

    const payload = {
      student_name: studentName.trim(),
      class_name: selectedClass,
      subject_name: subjectName,
      academic_year: academicYear,
      month_1: parseFloat(month1) || 0,
      month_2: parseFloat(month2) || 0,
      month_3: parseFloat(month3) || 0,
      term_1: parseFloat(term1) || 0,
      term_2: parseFloat(term2) || 0
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('student_grades').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('student_grades').insert([payload]);
        if (error) throw error;
      }
      resetForm();
      fetchGrades();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ!');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setStudentName(item.student_name);
    setSubjectName(item.subject_name);
    setMonth1(item.month_1 ?? '');
    setMonth2(item.month_2 ?? '');
    setMonth3(item.month_3 ?? '');
    setTerm1(item.term_1 ?? '');
    setTerm2(item.term_2 ?? '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه النتيجة؟')) {
      try {
        const { error } = await supabase.from('student_grades').delete().eq('id', id);
        if (error) throw error;
        fetchGrades();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setStudentName('');
    setMonth1('');
    setMonth2('');
    setMonth3('');
    setTerm1('');
    setTerm2('');
  };

  const getStudentCertificateData = (targetStudentName) => {
    const defaultSubjects = [
      { name: "التربية الإسلامية", max: 30, score: "" },
      { name: "اللغة العربية", max: 40, score: "" },
      { name: "اللغة الانجليزية", max: 40, score: "" },
      { name: "الرياضيات", max: 30, score: "" },
      { name: "العلوم", max: 30, score: "" },
      { name: "الجغرافيا", max: 30, score: "" },
      { name: "التاريخ", max: 30, score: "" },
      { name: "التكنولوجيا", max: 20, score: "" },
      { name: "التقنية", max: 20, score: "" },
    ];

    if (!targetStudentName || isBlankCertificate) {
      return {
        studentName: "....................................................",
        schoolName: certSchoolName,
        className: certClass,
        academicYear: certYear,
        examName: certExamName,
        issueDate: certDate,
        subjects: defaultSubjects
      };
    }

    const studentRows = grades.filter(g => g.student_name === targetStudentName);
    
    const mappedSubjects = defaultSubjects.map(sub => {
      const match = studentRows.find(r => r.subject_name === sub.name);
      if (match) {
        const scoreVal = (parseFloat(match.term_1) || 0) + (parseFloat(match.term_2) || 0);
        return { ...sub, score: scoreVal > 0 ? scoreVal : "" };
      }
      return sub;
    });

    return {
      studentName: targetStudentName,
      schoolName: certSchoolName,
      className: certClass,
      academicYear: certYear,
      examName: certExamName,
      issueDate: certDate,
      subjects: mappedSubjects
    };
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif', padding: '10px' }}>
      
      {/* 1️⃣ معاينة والتحكم الكامل بالشهادة */}
      {activeCertificateStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
          
          {/* شريط التحكم بالتفاصيل قبل الطباعة */}
          <div style={{ maxWidth: '820px', margin: '0 auto 15px auto', backgroundColor: '#ffffff', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#047857', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>⚙️ تحرير تفاصيل الشهادة قبل الطباعة:</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold' }}>اسم المدرسة:</label>
                <input type="text" value={certSchoolName} onChange={e => setCertSchoolName(e.target.value)} style={certControlInput} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold' }}>الصف الدراسي:</label>
                <input type="text" value={certClass} onChange={e => setCertClass(e.target.value)} style={certControlInput} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold' }}>العام الدراسي:</label>
                <input type="text" value={certYear} onChange={e => setCertYear(e.target.value)} style={certControlInput} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold' }}>عنوان النتيجة / الامتحان:</label>
                <input type="text" value={certExamName} onChange={e => setCertExamName(e.target.value)} style={certControlInput} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold' }}>تاريخ الإصدار:</label>
                <input type="text" value={certDate} onChange={e => setCertDate(e.target.value)} style={certControlInput} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={() => window.print()} style={{ padding: '8px 25px', backgroundColor: '#047857', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                🖨️ طباعة الشهادة
              </button>
              <button onClick={() => { setActiveCertificateStudent(null); setIsBlankCertificate(false); }} style={{ padding: '8px 20px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                ❌ إغلاق
              </button>
            </div>
          </div>

          <CertificateComponent data={getStudentCertificateData(activeCertificateStudent)} />
        </div>
      )}

      {/* 2️⃣ الهيدر الرئيسي مع تنظيف التداخل */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontSize: '20px', fontWeight: 'bold' }}>📋 إدارة نتائج الامتحانات والدرجات</h2>
          <p style={{ margin: '3px 0 0 0', color: '#64748b', fontSize: '12px' }}>رصد واستيراد وتصدير الدرجات وطباعة الشهادات</p>
        </div>

        {/* أزرار العمليات السريعة */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={exportToExcel} style={{ padding: '8px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
            📊 تصدير Excel
          </button>

          <label style={{ padding: '8px 12px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'inline-block' }}>
            📥 استيراد Excel
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button onClick={() => { setIsBlankCertificate(true); setActiveCertificateStudent('blank'); }} style={{ padding: '8px 12px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
            📄 نتيجة فارغة
          </button>

          {onBack && (
            <button onClick={onBack} style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
              ⬅️ رجوع
            </button>
          )}
        </div>
      </div>

      {/* 3️⃣ شريط الفلترة واختيار الفصل والسنة */}
      <div style={{ backgroundColor: '#f8fafc', padding: '12px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>🏛️ عرض صف محدد:</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={selectFilterStyle}>
            {classesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>📅 العام الدراسي:</label>
          <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={selectFilterStyle}>
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
          </select>
        </div>
      </div>

      {/* 4️⃣ تقسيم الشاشة بين الإدخال والجدول */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2.5fr', gap: '20px' }}>
        
        {/* نموذج الإدخال */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}>
            {editingId ? '✏️ تعديل الدرجات' : '➕ رصد درجات جديدة'}
          </h3>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>اسم الطالب:</label>
            <input type="text" placeholder="اسم الطالب كامل" value={studentName} onChange={e => setStudentName(e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>المادة الدراسية:</label>
            <select value={subjectName} onChange={e => setSubjectName(e.target.value)} style={inputStyle}>
              <option value="التربية الإسلامية">التربية الإسلامية</option>
              <option value="اللغة العربية">اللغة العربية</option>
              <option value="اللغة الانجليزية">اللغة الانجليزية</option>
              <option value="الرياضيات">الرياضيات</option>
              <option value="العلوم">العلوم</option>
              <option value="الجغرافيا">الجغرافيا</option>
              <option value="التاريخ">التاريخ</option>
              <option value="التكنولوجيا">التكنولوجيا</option>
              <option value="التقنية">التقنية</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
            <div>
              <label style={labelStyle}>ش 1:</label>
              <input type="number" step="0.5" value={month1} onChange={e => setMonth1(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>ش 2:</label>
              <input type="number" step="0.5" value={month2} onChange={e => setMonth2(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>ش 3:</label>
              <input type="number" step="0.5" value={month3} onChange={e => setMonth3(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>الفترة 1:</label>
              <input type="number" step="0.5" value={term1} onChange={e => setTerm1(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>الفترة 2:</label>
              <input type="number" step="0.5" value={term2} onChange={e => setTerm2(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="submit" style={{ flex: 1, padding: '9px', backgroundColor: editingId ? '#3b82f6' : '#047857', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
              {editingId ? 'تحديث' : 'حفظ الدرجات 💾'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '9px 12px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>إلغاء</button>
            )}
          </div>
        </form>

        {/* الجدول السلس للمشاهدة */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '12px' }}>
                  <th style={thStyle}>اسم الطالب</th>
                  <th style={thStyle}>المادة</th>
                  <th style={thStyle}>ش 1</th>
                  <th style={thStyle}>ش 2</th>
                  <th style={thStyle}>ش 3</th>
                  <th style={{ ...thStyle, backgroundColor: '#0284c7' }}>فترة 1</th>
                  <th style={{ ...thStyle, backgroundColor: '#0284c7' }}>فترة 2</th>
                  <th style={{ ...thStyle, backgroundColor: '#047857' }}>النهائية</th>
                  <th style={thStyle}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>⏳ جاري تحميل الدرجات...</td></tr>
                ) : grades.length > 0 ? (
                  grades.map((row, index) => {
                    const finalScore = (parseFloat(row.term_1) || 0) + (parseFloat(row.term_2) || 0);

                    return (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0f172a', textAlign: 'right' }}>{row.student_name}</td>
                        <td style={tdStyle}>{row.subject_name}</td>
                        <td style={tdStyle}>{row.month_1}</td>
                        <td style={tdStyle}>{row.month_2}</td>
                        <td style={tdStyle}>{row.month_3}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0284c7' }}>{row.term_1}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0284c7' }}>{row.term_2}</td>
                        <td style={{ ...tdStyle, fontWeight: '900', color: '#047857', backgroundColor: '#ecfdf5' }}>
                          {finalScore}
                        </td>
                        <td style={tdStyle}>
                          <button onClick={() => { setIsBlankCertificate(false); setActiveCertificateStudent(row.student_name); }} style={{ padding: '3px 6px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '4px', cursor: 'pointer', marginLeft: '3px', fontSize: '10px', fontWeight: 'bold' }} title="طباعة الشهادة">🎓 شهادة</button>
                          <button onClick={() => handleEdit(row)} style={{ padding: '3px 6px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '4px', cursor: 'pointer', marginLeft: '3px', fontSize: '10px', fontWeight: 'bold' }}>✏️</button>
                          <button onClick={() => handleDelete(row.id)} style={{ padding: '3px 6px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>🗑️</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>لا توجد درجات مرصودة لهذا الفصل حالياً.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// قالب الشهادة المحدث القابل للتحكم
function CertificateComponent({ data }) {
  const totalMax = data.subjects.reduce((sum, s) => sum + (Number(s.max) || 0), 0);
  const totalScore = data.subjects.reduce((sum, s) => sum + (Number(s.score) || 0), 0);
  const percentageVal = totalScore > 0 ? ((totalScore / totalMax) * 100).toFixed(1) + '%' : '';

  return (
    <div className="printable-certificate" style={certStyles.container}>
      <div style={certStyles.headerSection}>
        <div style={certStyles.headerTop}>
          <div style={certStyles.logoBox}>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ</div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Coat_of_arms_of_Sudan.svg" alt="شعار السودان" style={{ height: '40px', margin: '3px 0' }} />
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>القنصلية العامة لجمهورية السودان بمحافظات جنوب مصر – أسوان</div>
          </div>

          <div style={certStyles.schoolLogoBox}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '18px' }}>☀️</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#000', marginTop: '2px' }}>مدرسة الشروق السودانية</div>
            <div style={{ fontSize: '9px', color: '#333' }}>توكل - نجاح - تفوق</div>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '14px', marginTop: '-8px', paddingRight: '10px' }}>
          {data.schoolName}
        </div>

        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <h3 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
            {data.examName} {data.className}
          </h3>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '2px' }}>
            العام الدراسي {data.academicYear}
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '12px', fontSize: '13px', fontWeight: 'bold' }}>
          الاسم : <span style={{ textDecoration: 'underline black', paddingRight: '5px' }}>{data.studentName}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>تفاصيل نتيجة المقررات الدراسية</div>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>النسبة المئوية {percentageVal || '.........%'}</div>
      </div>

      <table style={certStyles.table}>
        <thead>
          <tr style={{ backgroundColor: '#fff' }}>
            <th style={certStyles.thTd}>المادة</th>
            {data.subjects.map((sub, index) => (
              <th key={index} style={certStyles.thTd}>{sub.name}</th>
            ))}
            <th style={certStyles.thTd}>المجموع</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...certStyles.thTd, fontWeight: 'bold' }}>الدرجة القصوي</td>
            {data.subjects.map((sub, index) => (
              <td key={index} style={certStyles.thTd}>{sub.max}</td>
            ))}
            <td style={{ ...certStyles.thTd, fontWeight: 'bold' }}>{totalMax}</td>
          </tr>
          <tr>
            <td style={{ ...certStyles.thTd, fontWeight: 'bold' }}>الدرجة المتحصلة</td>
            {data.subjects.map((sub, index) => (
              <td key={index} style={certStyles.thTd}>{sub.score || ''}</td>
            ))}
            <td style={{ ...certStyles.thTd, fontWeight: 'bold' }}>{totalScore || ''}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        <div style={{ width: '48%', borderRight: '1px solid #000', paddingRight: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={certStyles.signatureRow}>
              <span>مدير المدرسة : أ / كمال الدين مجذوب الطيب</span>
              <span>التوقيع : ....................</span>
            </div>
            <div style={certStyles.signatureRow}>
              <span>المدير الأكاديمي : أ / هند عبدالرازق ماهر</span>
              <span>التوقيع : ....................</span>
            </div>
          </div>
          <div style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '11px', marginTop: '10px' }}>
            تاريخ الإصدار : {data.issueDate}
          </div>
        </div>

        <div style={{ width: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '2px' }}>القيم والسلوك والملاحظات العامة</div>
            <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
              طالب مهذب ومجتهد ، مشارك ومنضبط<br />
              نتمني له مزيداً من التفوق .
            </div>
          </div>

          <div style={{ marginTop: '6px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>
              التقدير : <span style={{ textDecoration: 'underline' }}>...............</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold' }}>
              <span>مرشد الصف / ياسر عبدالقادر</span>
              <span>التوقيع / ....................</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-certificate, .printable-certificate * {
            visibility: visible !important;
          }
          .printable-certificate {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const certControlInput = { width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px', marginTop: '2px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '3px', textAlign: 'right' };
const inputStyle = { width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff', textAlign: 'center' };
const selectFilterStyle = { padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '13px', backgroundColor: '#fff' };
const thStyle = { padding: '8px 6px', fontWeight: 'bold', fontSize: '11px' };
const tdStyle = { padding: '8px 6px', fontSize: '12px' };

const certStyles = {
  container: {
    width: '100%',
    maxWidth: '820px',
    margin: '0 auto',
    padding: '15px',
    backgroundColor: '#fff',
    border: '8px double #047857',
    boxSizing: 'border-box',
    direction: 'rtl',
    fontFamily: "'Cairo', 'Segoe UI', sans-serif",
    color: '#000',
    borderRadius: '4px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
  },
  headerSection: { borderBottom: '1px solid #000', paddingBottom: '6px', marginBottom: '6px' },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  logoBox: { textAlign: 'center', width: '55%' },
  schoolLogoBox: { textAlign: 'center', width: '35%' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '10px', margin: '4px 0' },
  thTd: { border: '1px solid #000', padding: '4px 2px', fontWeight: 'bold' },
  signatureRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }
};
