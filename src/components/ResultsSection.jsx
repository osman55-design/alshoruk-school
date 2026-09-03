import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function ResultsSection({ onBack }) {
  const [grades, setGrades] = useState([]);
  const [classesList] = useState(['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس']);
  const [selectedClass, setSelectedClass] = useState('الصف الأول');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [loading, setLoading] = useState(false);

  // حالة عرض الشهادة وطباعتها
  const [activeCertificateStudent, setActiveCertificateStudent] = useState(null);
  const [isBlankCertificate, setIsBlankCertificate] = useState(false);

  // حقول نموذج إضافة وتعديل الدرجات
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

  // 1️⃣ إمكانية تصدير نتائج الفصل الحالي إلى ملف Excel
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

  // 2️⃣ إمكانية استيراد وقراءة درجات الطلاب من شيت Excel
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

        // تحويل الصفوف إلى الهيكل المطلوب في Supabase
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
        alert('حدث خطأ أثناء قراءة ملف الإكسيل. يرجى التأكد من تسمية الأعمدة بشكل صحيح.');
      } finally {
        setLoading(false);
        e.target.value = null; // إعادة تعيين قيمة المدخل
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
        const { error } = await supabase
          .from('student_grades')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        alert('تم تحديث الدرجات بنجاح ✨');
      } else {
        const { error } = await supabase
          .from('student_grades')
          .insert([payload]);
        if (error) throw error;
        alert('تم حفظ درجات الطالب بنجاح 👏');
      }
      resetForm();
      fetchGrades();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ! تأكد من توافق الحقول في جدول student_grades.');
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
        alert('حدث خطأ أثناء الحذف!');
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
        className: selectedClass,
        academicYear: academicYear,
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
      className: selectedClass,
      academicYear: academicYear,
      subjects: mappedSubjects
    };
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* معاينة وطباعة الشهادة */}
      {activeCertificateStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
            <button onClick={() => window.print()} style={{ padding: '10px 25px', backgroundColor: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              🖨️ طباعة الشهادة
            </button>
            <button onClick={() => { setActiveCertificateStudent(null); setIsBlankCertificate(false); }} style={{ padding: '10px 25px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              ❌ إغلاق المعاينة
            </button>
          </div>

          <CertificateComponent data={getStudentCertificateData(activeCertificateStudent)} />
        </div>
      )}

      {/* رأس الصفحة والأزرار */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '22px' }}>📋 إدارة نتائج الامتحانات والدرجات</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>رصد واستيراد وتصدير الدرجات وطباعة النتائج المعتمدة</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* زر التصدير لإكسيل */}
          <button onClick={exportToExcel} style={{ padding: '8px 14px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            📊 تصدير إلى Excel
          </button>

          {/* زر الاستيراد من إكسيل */}
          <label style={{ padding: '8px 14px', backgroundColor: '#0284c7', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'inline-block' }}>
            📥 استيراد شيت Excel
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          {/* زر النتيجة الفارغة */}
          <button onClick={() => { setIsBlankCertificate(true); setActiveCertificateStudent('blank'); }} style={{ padding: '8px 14px', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            📄 نتيجة فارغة
          </button>

          {onBack && (
            <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              ⬅️ رجوع
            </button>
          )}
        </div>
      </div>

      {/* 3️⃣ خيار عرض واختيار الصف الفردي */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '13px', color: '#475569' }}>🏛️ عرض فصل محدد:</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={selectStyle}>
            {classesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '13px', color: '#475569' }}>📅 العام الدراسي:</label>
          <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={selectStyle}>
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '20px' }}>
        
        {/* نموذج الإدخال */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '16px', fontWeight: 'bold' }}>
            {editingId ? '✏️ تعديل درجات الطالب' : '➕ رصد درجات جديدة'}
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>اسم الطالب:</label>
            <input type="text" placeholder="اسم الطالب كامل" value={studentName} onChange={e => setStudentName(e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ marginBottom: '12px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>شهر 1:</label>
              <input type="number" step="0.5" value={month1} onChange={e => setMonth1(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>شهر 2:</label>
              <input type="number" step="0.5" value={month2} onChange={e => setMonth2(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>شهر 3:</label>
              <input type="number" step="0.5" value={month3} onChange={e => setMonth3(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>الفترة الأولى:</label>
              <input type="number" step="0.5" value={term1} onChange={e => setTerm1(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>الفترة الثانية:</label>
              <input type="number" step="0.5" value={term2} onChange={e => setTerm2(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ flex: 1, padding: '11px', backgroundColor: editingId ? '#3b82f6' : '#047857', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {editingId ? 'تحديث الدرجات' : 'حفظ ورصد 💾'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '11px 14px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>إلغاء</button>
            )}
          </div>
        </form>

        {/* جدول عرض النتائج */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', height: 'fit-content' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '13px' }}>
                  <th style={thStyle}>اسم الطالب</th>
                  <th style={thStyle}>المادة</th>
                  <th style={thStyle}>ش 1</th>
                  <th style={thStyle}>ش 2</th>
                  <th style={thStyle}>ش 3</th>
                  <th style={{ ...thStyle, backgroundColor: '#0284c7' }}>الفترة 1</th>
                  <th style={{ ...thStyle, backgroundColor: '#0284c7' }}>الفترة 2</th>
                  <th style={{ ...thStyle, backgroundColor: '#047857' }}>النهائية (1+2)</th>
                  <th style={thStyle}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '25px', color: '#64748b' }}>⏳ جاري تحميل الدرجات...</td></tr>
                ) : grades.length > 0 ? (
                  grades.map((row, index) => {
                    const t1 = parseFloat(row.term_1) || 0;
                    const t2 = parseFloat(row.term_2) || 0;
                    const finalScore = t1 + t2;

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
                          <button onClick={() => { setIsBlankCertificate(false); setActiveCertificateStudent(row.student_name); }} style={{ padding: '4px 8px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', cursor: 'pointer', marginLeft: '4px', fontSize: '11px', fontWeight: 'bold' }} title="طباعة شهادة الطالب">🎓 شهادة</button>
                          <button onClick={() => handleEdit(row)} style={{ padding: '4px 8px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', marginLeft: '4px', fontSize: '11px', fontWeight: 'bold' }}>✏️</button>
                          <button onClick={() => handleDelete(row.id)} style={{ padding: '4px 8px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>🗑️</button>
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

// مكون قالب الشهادة المطابق للشهادة المعتمدة
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
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Coat_of_arms_of_Sudan.svg" alt="شعار السودان" style={{ height: '42px', margin: '4px 0' }} />
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>القنصلية العامة لجمهورية السودان بمحافظات جنوب مصر – أسوان</div>
          </div>

          <div style={certStyles.schoolLogoBox}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '20px' }}>☀️</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000', marginTop: '2px' }}>مدرسة الشروق السودانية</div>
            <div style={{ fontSize: '9px', color: '#333' }}>توكل - نجاح - تفوق</div>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '15px', marginTop: '-10px', paddingRight: '15px' }}>
          مدرسة الشروق السودانية بأسوان
        </div>

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <h3 style={{ margin: '0', fontSize: '15px', fontWeight: 'bold' }}>
            نتيجة إمتحانات الفترة النهائية للمرحلة المتوسطة {data.className}
          </h3>
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '3px' }}>
            العام الدراسي {data.academicYear}
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '14px', fontWeight: 'bold' }}>
          الاسم : <span style={{ textDecoration: 'underline black', paddingRight: '5px' }}>{data.studentName}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 4px 0' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
          تفاصيل نتيجة المقررات الدراسية
        </div>
        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
          النسبة المئوية {percentageVal || '.........%'}
        </div>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <div style={{ width: '48%', borderRight: '1px solid #000', paddingRight: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
          <div style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '12px', marginTop: '15px' }}>
            تاريخ الإصدار : 2026 / 6 / 7
          </div>
        </div>

        <div style={{ width: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>القيم والسلوك والملاحظات العامة</div>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              طالب مهذب ومجتهد ، مشارك ومنضبط<br />
              نتمني له مزيداً من التفوق .
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '11px', marginTop: '6px' }}>
              نحن وأنتم من أجل أبنائنا ،،
            </div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '6px' }}>
              التقدير : <span style={{ textDecoration: 'underline' }}>...............</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' }}>
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

const certStyles = {
  container: {
    width: '100%',
    maxWidth: '820px',
    margin: '0 auto',
    padding: '18px',
    backgroundColor: '#fff',
    border: '10px double #047857',
    boxSizing: 'border-box',
    direction: 'rtl',
    fontFamily: "'Segoe UI', 'Cairo', Tahoma, sans-serif",
    color: '#000',
    borderRadius: '4px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
  },
  headerSection: {
    borderBottom: '1px solid #000',
    paddingBottom: '8px',
    marginBottom: '8px'
  },
  headerTop: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'flex-start'
  },
  logoBox: {
    textAlign: 'center',
    width: '55%'
  },
  schoolLogoBox: {
    textAlign: 'center',
    width: '35%'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
    fontSize: '11px',
    margin: '4px 0'
  },
  thTd: {
    border: '1px solid #000',
    padding: '5px 2px',
    fontWeight: 'bold'
  },
  signatureRow: {
    display: 'flex',
    justify: 'space-between',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '5px'
  }
};

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '4px', textAlign: 'right' };
const inputStyle = { width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff', fontWeight: 'bold', textAlign: 'center' };
const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '14px', backgroundColor: '#fff' };
const thStyle = { padding: '10px 8px', fontWeight: '700', fontSize: '12px' };
const tdStyle = { padding: '10px 8px', fontSize: '13px' };
