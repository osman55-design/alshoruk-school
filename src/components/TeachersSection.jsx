import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function TeachersSection({ onBack }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // حقول نموذج إدخال معلم جديد
  const [teacherName, setTeacherName] = useState('');
  const [specialization, setSpecialization] = useState('اللغة العربية');
  const [phone, setPhone] = useState('');
  
  // إدارة المراحل والفصول المتعددة
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classInput, setClassInput] = useState('');

  // فصول افتراضية مقترحة أو يمكن كتابتها بحرية
  const availableClasses = ['أول أ', 'أول ب', 'ثاني أ', 'ثاني ب', 'ثالث أ', 'ثالث ب', 'رابع أ', 'خامس أ', 'سادس أ'];

  // جلب قائمة المعلمين من Supabase
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teachers_list')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setTeachers(data);
    } catch (err) {
      console.error("خطأ في جلب بيانات المعلمين:", err);
      alert("❌ تعذر جلب قائمة المعلمين: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // إضافة مرحلة/فصل لقائمة المعلم المؤقتة
  const handleAddClass = (className) => {
    const trimmed = className.trim();
    if (trimmed && !selectedClasses.includes(trimmed)) {
      setSelectedClasses([...selectedClasses, trimmed]);
      setClassInput('');
    }
  };

  const handleRemoveClass = (className) => {
    setSelectedClasses(selectedClasses.filter(c => c !== className));
  };

  // إضافة معلم جديد
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      alert("يرجى إدخال اسم المعلم!");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('teachers_list')
        .insert([
          {
            teacher_name: teacherName.trim(),
            subject_name: specialization,
            phone_number: phone.trim() || '—',
            academic_level: selectedClasses.length > 0 ? selectedClasses.join(', ') : 'غير محدد'
          }
        ]);

      if (error) throw error;

      alert("✅ تم إضافة المعلم وتنسيق فصوله بنجاح!");
      setTeacherName('');
      setPhone('');
      setSelectedClasses([]);
      fetchTeachers();
    } catch (err) {
      alert("❌ خطأ أثناء الإضافة: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // حذف معلم
  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المعلم؟")) return;

    try {
      const { error } = await supabase
        .from('teachers_list')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert("🗑️ تم حذف المعلم بنجاح");
      fetchTeachers();
    } catch (err) {
      alert("❌ حدث خطأ أثناء الحذف: " + err.message);
    }
  };

  // 📊 تصدير كادر المعلمين إلى Excel
  const exportToExcel = () => {
    if (teachers.length === 0) {
      alert('لا توجد بيانات معلمين للتصدير حالياً.');
      return;
    }

    const exportData = teachers.map(row => ({
      'اسم المعلم': row.teacher_name || '',
      'التخصص': row.subject_name || '',
      'رقم الهاتف': row.phone_number || '',
      'المراحل / الفصول المسندة': row.academic_level || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'كادر المعلمين');
    XLSX.writeFile(workbook, `إدارة_كادر_المعلمين.xlsx`);
  };

  // 📥 استيراد المعلمين من Excel
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
          teacher_name: item['اسم المعلم'] || item['teacher_name'] || 'معلم جديد',
          subject_name: item['التخصص'] || item['subject_name'] || 'اللغة العربية',
          phone_number: item['رقم الهاتف'] || item['phone_number'] || '—',
          academic_level: item['المراحل / الفصول المسندة'] || item['academic_level'] || 'غير محدد'
        }));

        const { error } = await supabase.from('teachers_list').insert(rowsToInsert);
        if (error) throw error;

        alert(`تم استيراد ${rowsToInsert.length} معلم بنجاح 🚀`);
        fetchTeachers();
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

  return (
    <div style={{ direction: 'rtl', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* رأس الصفحة مع أزرار الاستيراد والتصدير */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>👨‍🏫 إدارة كادر المعلمين</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>تسجيل المعلمين، التخصصات، والمراحل الدراسية والفصول المتعددة المسندة لهم</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={exportToExcel} style={btnExportStyle}>
            📊 تصدير Excel
          </button>

          <label style={btnImportStyle}>
            📥 استيراد Excel
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          {onBack && (
            <button onClick={onBack} style={{ padding: '9px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              ❌ إغلاق
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* نموذج إضافة معلم */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a' }}>➕ إضافة معلم جديد:</h4>
          
          <form onSubmit={handleAddTeacher} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
            
            <div>
              <label style={labelStyle}>اسم المعلم *</label>
              <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="أدخل اسم المعلم الثلاثي" required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>التخصص *</label>
              <select value={specialization} onChange={e => setSpecialization(e.target.value)} style={inputStyle}>
                <option value="التربية الإسلامية">التربية الإسلامية</option>
                <option value="اللغة العربية">اللغة العربية</option>
                <option value="الرياضيات">الرياضيات</option>
                <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                <option value="العلوم">العلوم</option>
                <option value="الكيمياء">الكيمياء</option>
                <option value="الفيزياء">الفيزياء</option>
                <option value="الأحياء">الأحياء</option>
                <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
                <option value="الحاسوب">الحاسوب</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>رقم الهاتف</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07xxxxxxxx" style={inputStyle} />
            </div>

            {/* تخصيص الفصول والمراحل المتعددة */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>المراحل / الفصول المسندة (يمكنك اختيار أكثر من مرحلة وفصل):</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="text" 
                  value={classInput} 
                  onChange={e => setClassInput(e.target.value)} 
                  placeholder="مثال: أول أ، ثاني ب (اكتب أو اختر من القائمة)" 
                  style={inputStyle} 
                  list="classes-options"
                />
                <datalist id="classes-options">
                  {availableClasses.map((cls, i) => <option key={i} value={cls} />)}
                </datalist>
                <button type="button" onClick={() => handleAddClass(classInput)} style={btnAddClassStyle}>
                  ➕ إضافة فصل
                </button>
              </div>

              {/* الشارات المضافة للفصول */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedClasses.map((cls, idx) => (
                  <span key={idx} style={tagStyle}>
                    🏫 {cls}
                    <button type="button" onClick={() => handleRemoveClass(cls)} style={removeTagBtn}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '5px' }}>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
                {loading ? 'جاري الحفظ...' : '💾 حفظ المعلم'}
              </button>
            </div>

          </form>
        </div>

        {/* جدول عرض المعلمين */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '16px 20px', backgroundColor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
              📋 قائمة المعلمين المسجلين ({teachers.length})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '14px', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>اسم المعلم</th>
                  <th style={thStyle}>التخصص</th>
                  <th style={thStyle}>رقم الهاتف</th>
                  <th style={thStyle}>الفصول/المراحل المسندة</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 ? (
                  teachers.map((tc, index) => (
                    <tr key={tc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{tc.teacher_name}</td>
                      <td style={tdStyle}><span style={badgeStyle}>{tc.subject_name || 'غير محدد'}</span></td>
                      <td style={tdStyle}>{tc.phone_number || '—'}</td>
                      <td style={{ ...tdStyle, color: '#0d9488', fontWeight: '700' }}>{tc.academic_level || '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <button onClick={() => handleDeleteTeacher(tc.id)} style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                          🗑️ حذف
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                      {loading ? 'جاري تحميل البيانات...' : '📋 لا يوجد معلمون مسجلون حالياً.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#475569' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' };
const thStyle = { padding: '14px 16px', fontWeight: '700' };
const tdStyle = { padding: '14px 16px', fontSize: '14px' };
const badgeStyle = { padding: '4px 8px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '6px', fontSize: '12px', fontWeight: '600' };

const btnExportStyle = {
  padding: '9px 14px',
  backgroundColor: '#10b981',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '13px'
};

const btnImportStyle = {
  padding: '9px 14px',
  backgroundColor: '#0284c7',
  color: '#ffffff',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '13px',
  display: 'inline-block'
};

const btnAddClassStyle = {
  padding: '0 16px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer'
};

const tagStyle = {
  backgroundColor: '#e0e7ff',
  color: '#3730a3',
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '13px',
  fontWeight: '600',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
};

const removeTagBtn = {
  background: 'none',
  border: 'none',
  color: '#ef4444',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
  padding: 0
};
