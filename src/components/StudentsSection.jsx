import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function StudentsSection({ onBack, currentUser }) {
  // المراحل الدراسية
  const allStages = ['الروضة', 'المرحلة الابتدائية', 'المرحلة المتوسطة', 'المرحلة الثانوية'];
  
  // تحديد Stages المسموحة للمستخدم الحالي
  const userAllowedStage = currentUser?.allowed_stage || 'الكل';
  const availableStages = userAllowedStage === 'الكل' 
    ? allStages 
    : [userAllowedStage];

  const gradesByStage = {
    'الروضة': ['روضة أولى', 'روضة ثانية', 'تمهيدي'],
    'المرحلة الابتدائية': ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المرحلة المتوسطة': ['الصف الأول المتوسط', 'الصف الثاني المتوسط', 'الصف الثالث المتوسط'],
    'المرحلة الثانوية': ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']
  };

  // بيانات نموذج التسجيل
  const [fullName, setFullName] = useState('');
  const [stage, setStage] = useState(availableStages[0] || 'المرحلة الثانوية');
  const [grade, setGrade] = useState(gradesByStage[availableStages[0]]?.[0] || 'الصف الأول الثانوي');
  const [gender, setGender] = useState('طالب');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fees, setFees] = useState(0);
  const [saving, setSaving] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

  // تحديث الصفوف تلقائياً عند تغيير المرحلة
  useEffect(() => {
    if (gradesByStage[stage]) {
      setGrade(gradesByStage[stage][0]);
    }
  }, [stage]);

  // جلب الطلاب لعرض العدد أو لتصديرهم
  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from('students').select('*').order('id', { ascending: false });
      if (!error && data) {
        setStudentsList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // حفظ بيانات الطالب في الفصول
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('يرجى كتابة اسم الطالب ورقم الهاتف!');
      return;
    }

    setSaving(true);
    try {
      const newStudent = {
        student_name: fullName.trim(),
        academic_level: stage,
        class_name: `${stage} - ${grade}`,
        full_name: fullName.trim(),
        stage: stage,
        grade: grade,
        gender: gender === 'طالب' ? 'ذكر' : 'أنثى',
        parent_phone: phone.trim(),
        phone: phone.trim(),
        address: address.trim(),
        fees: parseFloat(fees) || 0
      };

      const { error } = await supabase.from('students').insert([newStudent]);

      if (error) {
        alert('حدث خطأ أثناء حفظ بيانات الطالب: ' + error.message);
      } else {
        alert('تم حفظ البيانات بنجاح في الفصل المحدد!');
        setFullName('');
        setPhone('');
        setAddress('');
        setFees(0);
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ غير متوقع!');
    } finally {
      setSaving(false);
    }
  };

  // 📊 تصدير بيانات الطلاب إلى Excel
  const exportToExcel = () => {
    if (studentsList.length === 0) {
      alert('لا توجد بيانات طلاب للتصدير حالياً.');
      return;
    }

    const exportData = studentsList.map(row => ({
      'اسم الطالب': row.student_name || row.full_name || '',
      'المرحلة الدراسية': row.stage || row.academic_level || '',
      'الفصل / الصف': row.grade || '',
      'الجنس': row.gender || '',
      'رقم الهاتف': row.phone || row.parent_phone || '',
      'العنوان': row.address || '',
      'الرسوم': row.fees || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الطلاب');
    XLSX.writeFile(workbook, `سجل_الطلاب.xlsx`);
  };

  // 📥 استيراد الطلاب من Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setSaving(true);
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          alert('الملف فارغ أو صيغته غير صحيحة.');
          setSaving(false);
          return;
        }

        const rowsToInsert = data.map(item => {
          const sName = item['اسم الطالب'] || item['student_name'] || item['full_name'] || 'طالب جديد';
          const sStage = item['المرحلة الدراسية'] || item['stage'] || 'المرحلة الابتدائية';
          const sGrade = item['الفصل / الصف'] || item['grade'] || 'الصف الأول';
          return {
            student_name: sName,
            academic_level: sStage,
            class_name: `${sStage} - ${sGrade}`,
            full_name: sName,
            stage: sStage,
            grade: sGrade,
            gender: item['الجنس'] || 'ذكر',
            parent_phone: String(item['رقم الهاتف'] || item['phone'] || '—'),
            phone: String(item['رقم الهاتف'] || item['phone'] || '—'),
            address: item['العنوان'] || item['address'] || '',
            fees: parseFloat(item['الرسوم'] || item['fees']) || 0
          };
        });

        const { error } = await supabase.from('students').insert(rowsToInsert);
        if (error) throw error;

        alert(`تم استيراد ${rowsToInsert.length} طالب بنجاح 🚀`);
        fetchStudents();
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء قراءة ملف الإكسيل.');
      } finally {
        setSaving(false);
        e.target.value = null;
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl' }}>
      
      {/* الهيدر مع أزرار التصدير والاستيراد */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '18px' }}>📝 بوابة تسجيل الطلاب الجدد</h3>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>تسجيل البيانات الأساسية وحفظ الطالب مباشرة داخل الفصول</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={exportToExcel} style={btnExportStyle}>
            📊 تصدير Excel
          </button>

          <label style={btnImportStyle}>
            📥 استيراد Excel
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          {onBack && (
            <button onClick={onBack} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>↩️ عودة للوحة التحكم</button>
          )}
        </div>
      </div>

      {/* نموذج التسجيل */}
      <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ margin: '0 0 18px 0', color: '#047857', fontSize: '16px', fontWeight: 'bold' }}>✍️ إضافة طالب جديد وإسناده للفصل</h4>
        
        <form onSubmit={handleSaveStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          <div>
            <label style={labelStyle}>اسم الطالب بالكامل:</label>
            <input type="text" placeholder="مثال: علي محمد أحمد" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>المرحلة الدراسية المتاحة:</label>
            <select value={stage} onChange={e => setStage(e.target.value)} style={inputStyle}>
              {availableStages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>الصف / الفصل الدراسي:</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} style={inputStyle}>
              {gradesByStage[stage]?.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>نوع الطالب:</label>
            <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle}>
              <option value="طالب">👦 طالب (ذكر)</option>
              <option value="طالبة">👧 طالبة (أنثى)</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>رقم هاتف ولي الأمر:</label>
            <input type="text" placeholder="09xxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>العنوان / المنطقة:</label>
            <input type="text" placeholder="أسوان" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>الرسوم المحددة:</label>
            <input type="number" value={fees} onChange={e => setFees(e.target.value)} style={inputStyle} min="0" />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
            <button type="submit" disabled={saving} style={{ padding: '12px 28px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', width: '100%' }}>
              {saving ? 'جاري الحفظ...' : '💾 حفظ البيانات في الفصل'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'block' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' };

const btnExportStyle = {
  padding: '6px 14px',
  backgroundColor: '#10b981',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '12px'
};

const btnImportStyle = {
  padding: '6px 14px',
  backgroundColor: '#0284c7',
  color: '#ffffff',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '12px',
  display: 'inline-block',
  border: 'none'
};
