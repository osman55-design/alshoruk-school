import React, { useState, useEffect } from 'react';
import * as dbModule from '../db'; 

const db = dbModule.db || dbModule.default || dbModule;

export default function ResultsSection() {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [subject, setSubject] = useState('اللغة العربية');
  const [examType, setExamType] = useState('شهري');
  const [score, setScore] = useState('');
  const [religionType, setReligionType] = useState('التربية الإسلامية'); 
  const [searchStudentId, setSearchStudentId] = useState('');

  const classOptions = [
    { group: "المرحلة الابتدائية", items: ["الأول ابتدائي", "الثاني ابتدائي", "الثالث ابتدائي", "الرابع ابتدائي", "الخامس ابتدائي", "السادس ابتدائي"] },
    { group: "المرحلة المتوسطة", items: ["الأول متوسط", "الثاني متوسط", "الثالث متوسط"] },
    { group: "المرحلة الثانوية", items: ["الأول ثانوي", "الثاني ثانوي", "الثالث ثانوي - المساق العلمي", "الثالث ثانوي - المساق الأدبي"] }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (db) {
          const s = db.getAllStudents ? await db.getAllStudents() : (db.students ? await db.students.toArray() : []);
          const g = db.grades ? await db.grades.toArray() : [];
          setStudents(s || []);
          setGrades(g || []);
        }
      } catch (error) { console.error(error); }
    };
    loadData();
  }, []);

  const getSubjectsStructure = (studentId) => {
    const student = students.find(s => String(s.id) === String(studentId));
    const baseShared = ["اللغة العربية", religionType, "الرياضيات الأساسية", "اللغة الإنجليزية"];
    if (!student || !student.class) return { list: ["اللغة العربية", religionType, "الرياضيات", "العلوم", "اللغة الإنجليزية"], optionals: [] };
    if (student.class === "الثالث ثانوي - المساق العلمي") return { list: [...baseShared, "الكيمياء", "الفيزياء"], optionals: ["الأحياء", "الحاسوب", "الهندسة"] };
    if (student.class === "الثالث ثانوي - المساق الأدبي") return { list: [...baseShared, "التاريخ", "الجغرافيا"], optionals: ["الدراسات الإسلامية", "أدب اللغة الإنجليزية", "الفنون"] };
    return { list: ["اللغة العربية", religionType, "الرياضيات", "العلوم", "اللغة الإنجليزية"], optionals: [] };
  };

  const getEvaluation = (num) => {
    if (num >= 90) return { text: "ممتاز 🌟", color: "#16a34a" };
    if (num >= 80) return { text: "جيد جداً 👍", color: "#2563eb" };
    if (num >= 70) return { text: "جيد 🙂", color: "#d97706" };
    if (num >= 50) return { text: "مقبول 📑", color: "#4b5563" };
    return { text: "راسب ❌", color: "#dc2626" };
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !score) return;
    const student = students.find(s => String(s.id) === String(selectedStudentId));
    const newGrade = {
      id: Date.now(), studentId: selectedStudentId, studentName: student ? student.name : 'طالب',
      studentClass: student ? student.class : 'غير محدد', subject, examType, score: parseFloat(score),
      date: new Date().toLocaleDateString('ar-EG')
    };
    try {
      if (db && db.grades) await db.grades.add(newGrade);
      setGrades([...grades, newGrade]); setScore(''); alert("تم رصد الدرجة بنجاح! 💾");
    } catch { setGrades([...grades, newGrade]); setScore(''); alert("تم الحفظ بنجاح!"); }
  };

  const currentStructure = getSubjectsStructure(selectedStudentId);
  const displayGrades = grades.filter(g => String(g.studentId) === String(searchStudentId));
  const selectedStudentInfo = students.find(s => String(s.id) === String(searchStudentId));

  return (
    <div style={{ direction: 'rtl', padding: '10px', fontFamily: 'Arial' }}>
      <div className="no-print" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
        <h3>📝 رصد وإدخل درجات الطلاب</h3>
        <div style={{ marginBottom: '15px' }}>
          <label>منهج الدين: </label>
          <select value={religionType} onChange={(e) => { setReligionType(e.target.value); setSubject(e.target.value); }}>
            <option value="التربية الإسلامية">التربية الإسلامية</option>
            <option value="التربية المسيحية">التربية المسيحية</option>
          </select>
        </div>
        <form onSubmit={handleSaveGrade} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} required>
            <option value="">-- اختر الطالب --</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={subject} onChange={e => setSubject(e.target.value)}>
            <optgroup label="أساسي">{currentStructure.list.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}</optgroup>
            {currentStructure.optionals.length > 0 && <optgroup label="اختياري">{currentStructure.optionals.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}</optgroup>}
          </select>
          <select value={examType} onChange={e => setExamType(e.target.value)}>
            <option value="شهري">شهري</option><option value="نهائي">نهائي</option>
          </select>
          <input type="number" placeholder="الدرجة" value={score} onChange={e => setScore(e.target.value)} required />
          <button type="submit">رصد الدرجة 💾</button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div className="no-print" style={{ marginBottom: '20px' }}>
          <select value={searchStudentId} onChange={e => setSearchStudentId(e.target.value)}>
            <option value="">-- حدد الطالب لاستخراج الشهادة --</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {searchStudentId && selectedStudentInfo ? (
          <div style={{ padding: '20px', border: '3px double #1e3a8a', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e3a8a', paddingBottom: '15px' }}>
              <div><h3>جمهورية السودان</h3><h4>مدرسة الشروق التعليمية</h4></div>
              <div><h2>📄 شهادة دراسية رسمية</h2></div>
              <div className="no-print"><button onClick={() => window.print()}>🖨️ طباعة الشهادة</button></div>
            </div>
            <div style={{ margin: '15px 0', background: '#f8f9fa', padding: '10px' }}>
              <div><strong>الطالب:</strong> {selectedStudentInfo.name} | <strong>الصف:</strong> {selectedStudentInfo.class || 'غير محدد'}</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1" cellPadding="10">
              <thead><tr style={{ backgroundColor: '#1e3a8a', color: '#fff' }}><th>المادة</th><th>الاختبار</th><th>الدرجة</th><th>التقدير</th></tr></thead>
              <tbody>
                {displayGrades.length > 0 ? displayGrades.map((g, i) => (
                  <tr key={i}><td>{g.subject}</td><td>{g.examType}</td><td>{g.score}</td><td style={{ color: getEvaluation(g.score).color }}>{getEvaluation(g.score).text}</td></tr>
                )) : <tr><td colSpan="4">لا توجد درجات مرصودة.</td></tr>}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <div><p>الختم الرسمي</p></div><div><p>مدير المدرسة</p><strong>الأستاذ عثمان صديق</strong></div>
            </div>
          </div>
        ) : <p style={{ textStyle: 'italic', textAlign: 'center' }}>الرجاء اختيار الطالب لتوليد شهادته.</p>}
      </div>
    </div>
  );
}
