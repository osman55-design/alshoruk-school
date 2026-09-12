import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function TransportsSection({ onBack }) {
  const [transports, setTransports] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // حقول نموذج الترحيل
  const [routeName, setRouteName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentInput, setStudentInput] = useState('');

  // جلب البيانات من Supabase
  const fetchTransports = async () => {
    setLoading(true);
    try {
      // جلب خطوط الترحيل
      const { data: transData, error: transError } = await supabase
        .from('transports_list')
        .select('*')
        .order('id', { ascending: false });

      if (transError) throw transError;
      if (transData) setTransports(transData);

      // جلب الطلاب لاقتراح الأسماء عند التخصيص (بالأسماء الصحيحة للأعمدة والجدول)
      const { data: stData } = await supabase.from('students').select('student_name, academic_level');
      if (stData) setAllStudents(stData);

    } catch (err) {
      console.error("خطأ جلب بيانات الترحيل:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  // إضافة طالب لخط سير الترحيل
  const handleAddStudent = (name) => {
    const trimmed = name.trim();
    if (trimmed && !selectedStudents.includes(trimmed)) {
      setSelectedStudents([...selectedStudents, trimmed]);
      setStudentInput('');
    }
  };

  const handleRemoveStudent = (name) => {
    setSelectedStudents(selectedStudents.filter(s => s !== name));
  };

  // حفظ خط ترحيل جديد
  const handleSaveTransport = async (e) => {
    e.preventDefault();
    if (!routeName || !driverName || !vehicleNumber || !supervisorName) {
      alert("يرجى ملء جميع الحقول الأساسية!");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('transports_list')
        .insert([{
          route_name: routeName,
          driver_name: driverName,
          vehicle_number: vehicleNumber,
          supervisor_name: supervisorName,
          students_list: selectedStudents.join(', ')
        }]);

      if (error) throw error;

      alert("🚌 تم إضافة خط الترحيل والمشرفة بنجاح!");
      setRouteName('');
      setDriverName('');
      setVehicleNumber('');
      setSupervisorName('');
      setSelectedStudents([]);
      fetchTransports();
    } catch (err) {
      alert("❌ خطأ أثناء الإضافة: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // حذف خط ترحيل
  const handleDeleteTransport = async (id) => {
    if (!window.confirm("هل أنت تأكد من حذف خط الترحيل هذا؟")) return;

    try {
      const { error } = await supabase.from('transports_list').delete().eq('id', id);
      if (error) throw error;
      alert("🗑️ تم حذف خط الترحيل");
      fetchTransports();
    } catch (err) {
      alert("❌ حدث خطأ أثناء الحذف: " + err.message);
    }
  };

  // 📊 ميزة تصدير خطوط الترحيل إلى Excel
  const exportToExcel = () => {
    if (transports.length === 0) {
      alert('لا توجد خطوط ترحيل متاحة للتصدير حالياً.');
      return;
    }

    const exportData = transports.map(row => ({
      'خط الرحيل / المنطقة': row.route_name || '',
      'اسم السائق': row.driver_name || '',
      'رقم العربة / الحافلة': row.vehicle_number || '',
      'اسم المشرفة': row.supervisor_name || '',
      'الطلاب المشتركون': row.students_list || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'التراحيل والخطوط');
    XLSX.writeFile(workbook, `إدارة_التراحيل_والمشرفين.xlsx`);
  };

  // 📥 ميزة استيراد خطوط الترحيل من Excel
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
          route_name: item['خط الرحيل / المنطقة'] || item['خط السير'] || item['route_name'] || 'خط جديد',
          driver_name: item['اسم السائق'] || item['السائق'] || item['driver_name'] || '',
          vehicle_number: item['رقم العربة / الحافلة'] || item['رقم الحافلة'] || item['vehicle_number'] || '',
          supervisor_name: item['اسم المشرفة'] || item['المشرفة'] || item['supervisor_name'] || '',
          students_list: item['الطلاب المشتركون'] || item['الطلاب'] || item['students_list'] || ''
        }));

        const { error } = await supabase.from('transports_list').insert(rowsToInsert);
        if (error) throw error;

        alert(`تم رفع واستيراد ${rowsToInsert.length} خط ترحيل بنجاح 🚀`);
        fetchTransports();
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
    <div style={{ direction: 'rtl', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      
      {/* هيدر الصفحة العصري مع أزرار التصدير والاستيراد */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '26px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🚌 إدارة التراحيل والمشرفين
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>تنسيق خطوط السير، السائقين، المشرفات، والطلاب المشتركين بكل حافلة</p>
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
            <button onClick={onBack} style={btnBackStyle}>
              ⬅️ العودة للقائمة الرئيسية
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* بطاقة إضافة خط جديد بتصميم مميز */}
        <div style={cardStyle}>
          <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>إضافة خط ترحيل / حافلة جديدة</h3>
          </div>

          <form onSubmit={handleSaveTransport} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            <div>
              <label style={labelStyle}>📍 خط الرحيل / المنطقة *</label>
              <input type="text" placeholder="مثال: خط الحي الشمالي - المجمع" value={routeName} onChange={e => setRouteName(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>👨‍✈️ اسم السائق *</label>
              <input type="text" placeholder="اسم السائق الثلاثي" value={driverName} onChange={e => setDriverName(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>🚐 رقم العربة / الحافلة *</label>
              <input type="text" placeholder="مثال: أ ب ج - 1234" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>👩‍🏫 اسم المشرفة *</label>
              <input type="text" placeholder="اسم مشرفة الحافلة" value={supervisorName} onChange={e => setSupervisorName(e.target.value)} required style={inputStyle} />
            </div>

            {/* تخصيص الطلاب للخط */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>🎒 إضافة الطلاب المشتركين بخط الرحيل:</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="text" 
                  placeholder="اكتب اسم الطالب أو اختر من المتاح..." 
                  value={studentInput} 
                  onChange={e => setStudentInput(e.target.value)} 
                  style={inputStyle} 
                  list="students-options"
                />
                <datalist id="students-options">
                  {allStudents.map((st, i) => <option key={i} value={`${st.student_name} (${st.academic_level || ''})`} />)}
                </datalist>
                <button type="button" onClick={() => handleAddStudent(studentInput)} style={btnAddStudentStyle}>
                  ➕ إضافة
                </button>
              </div>

              {/* الشارات المضافة للطلاب */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedStudents.map((st, idx) => (
                  <span key={idx} style={tagStyle}>
                    👤 {st}
                    <button type="button" onClick={() => handleRemoveStudent(st)} style={removeTagBtn}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <button type="submit" disabled={loading} style={btnSubmitStyle}>
                {loading ? 'جاري الحفظ...' : '💾 حفظ خط الترحيل والمشرفة'}
              </button>
            </div>

          </form>
        </div>

        {/* عرض خطوط الترحيل بأسلوب شبكي عصري (Grid Layout) */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '20px', fontWeight: '800' }}>
            📋 قائمة الحافلات وخطوط الترحيل المسجلة ({transports.length})
          </h3>

          {transports.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              {transports.map((item) => {
                const studentsArr = item.students_list ? item.students_list.split(',').filter(Boolean) : [];
                return (
                  <div key={item.id} style={busCardStyle}>
                    
                    {/* هيدر الكارت */}
                    <div style={busHeaderStyle}>
                      <div>
                        <span style={busBadgeStyle}>📍 خط الرحيل</span>
                        <h3 style={{ margin: '6px 0 0 0', color: '#ffffff', fontSize: '18px', fontWeight: '800' }}>{item.route_name}</h3>
                      </div>
                      <button onClick={() => handleDeleteTransport(item.id)} style={deleteBtnStyle} title="حذف الخط">
                        🗑️
                      </button>
                    </div>

                    {/* تفاصيل السائق والمشرفة والعربة */}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      
                      <div style={infoRowStyle}>
                        <span style={infoLabelStyle}>👨‍✈️ السائق:</span>
                        <span style={infoValueStyle}>{item.driver_name}</span>
                      </div>

                      <div style={infoRowStyle}>
                        <span style={infoLabelStyle}>🚌 رقم العربة:</span>
                        <span style={{ ...infoValueStyle, backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px' }}>{item.vehicle_number}</span>
                      </div>

                      <div style={infoRowStyle}>
                        <span style={infoLabelStyle}>👩‍🏫 المشرفة:</span>
                        <span style={{ ...infoValueStyle, color: '#0d9488', fontWeight: '700' }}>{item.supervisor_name}</span>
                      </div>

                      {/* جدول الطلاب للخط الحالي */}
                      <div style={{ marginTop: '10px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>🎒 الطلاب المشتركون:</span>
                          <span style={countBadgeStyle}>{studentsArr.length} طالب</span>
                        </div>

                        {studentsArr.length > 0 ? (
                          <div style={{ maxHeight: '130px', overflowY: 'auto', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <ol style={{ margin: 0, paddingRight: '20px', fontSize: '13px', color: '#334155' }}>
                              {studentsArr.map((st, i) => (
                                <li key={i} style={{ marginBottom: '4px' }}>{st.trim()}</li>
                              ))}
                            </ol>
                          </div>
                        ) : (
                          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>لا يوجد طلاب مضافون لهذا الخط بعد.</p>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '16px', color: '#64748b', border: '1px solid #e2e8f0' }}>
              🚍 لا يوجد خطوط ترحيل مضافة حالياً. قم بملء النموذج بالأعلى لإضافة أول خط ترحيل.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// التنسيقات العصرية الممتازة (CSS in JS)
const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: '700',
  color: '#334155'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  backgroundColor: '#f8fafc'
};

const btnSubmitStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#0d9488',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '800',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
};

const btnAddStudentStyle = {
  padding: '0 18px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontWeight: '700',
  cursor: 'pointer'
};

const btnExportStyle = {
  padding: '10px 16px',
  backgroundColor: '#10b981',
  color: '#ffffff',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '13px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
};

const btnImportStyle = {
  padding: '10px 16px',
  backgroundColor: '#0284c7',
  color: '#ffffff',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '13px',
  display: 'inline-block',
  boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
};

const btnBackStyle = {
  padding: '10px 18px',
  backgroundColor: '#ffffff',
  color: '#475569',
  border: '1px solid #cbd5e1',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
};

const tagStyle = {
  backgroundColor: '#e0e7ff',
  color: '#3730a3',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: '600',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px'
};

const removeTagBtn = {
  background: 'none',
  border: 'none',
  color: '#ef4444',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  padding: 0
};

const busCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '18px',
  border: '1px solid #e2e8f0',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
};

const busHeaderStyle = {
  backgroundColor: '#0f172a',
  padding: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
};

const busBadgeStyle = {
  backgroundColor: '#334155',
  color: '#94a3b8',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700'
};

const deleteBtnStyle = {
  backgroundColor: 'rgba(239, 68, 68, 0.2)',
  border: 'none',
  borderRadius: '8px',
  padding: '6px 10px',
  cursor: 'pointer',
  fontSize: '14px'
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '14px'
};

const infoLabelStyle = { color: '#64748b', fontWeight: '600' };
const infoValueStyle = { color: '#0f172a', fontWeight: '700' };

const countBadgeStyle = {
  backgroundColor: '#fef3c7',
  color: '#b45309',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '700'
};
