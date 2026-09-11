import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function BridgeSection({ currentUser }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const fileInputRef = useRef(null);

  const initialFormState = {
    name: '', bridge: '', transport: '', mother_name: '', national_id: '',
    entry_date: '', birth_date: '', age: '', address: '', class_name: '',
    collection_status: '', saturday_transport: '', collection: '', transport_order: '',
    notes: '', father_calls: '', mother_calls: '', father_whatsapp: '', mother_whatsapp: '',
    registration_fees: '', receipt_no_reg: '', registration: '', books: '',
    first_installment: '', receipt_no_installment: '', uniform: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bridge_records')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('خطأ في جلب بيانات الجسر:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        const { error } = await supabase.from('bridge_records').update(formData).eq('id', editingRecord.id);
        if (error) throw error;
        alert('تم التعديل بنجاح! ✨');
      } else {
        const { error } = await supabase.from('bridge_records').insert([formData]);
        if (error) throw error;
        alert('تمت الإضافة بنجاح! 🎉');
      }
      setShowModal(false);
      setEditingRecord(null);
      setFormData(initialFormState);
      fetchRecords();
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنتِ متأكدة من حذف هذا السجل؟')) return;
    try {
      const { error } = await supabase.from('bridge_records').delete().eq('id', id);
      if (error) throw error;
      fetchRecords();
    } catch (err) {
      alert('خطأ في الحذف: ' + err.message);
    }
  };

  const exportToExcel = () => {
    const dataToExport = records.length > 0 ? records.map(r => ({
      'الاسم': r.name || '',
      'الجسر': r.bridge || '',
      'الترحيل': r.transport || '',
      'اسم الأم': r.mother_name || '',
      'رقم الهوية': r.national_id || '',
      'تاريخ الدخول': r.entry_date || '',
      'تاريخ الميلاد': r.birth_date || '',
      'العمر': r.age || '',
      'السكن': r.address || '',
      'صفي': r.class_name || '',
      'موقف التحصيل': r.collection_status || '',
      'ترحيل السبت': r.saturday_transport || '',
      'التحصيل': r.collection || '',
      'ترتيب الترحيل': r.transport_order || '',
      'ملاحظات': r.notes || '',
      'مكالمات الوالد': r.father_calls || '',
      'مكالمات الوالدة': r.mother_calls || '',
      'واتساب الوالد': r.father_whatsapp || '',
      'واتساب الوالدة': r.mother_whatsapp || '',
      'رسوم التسجيل': r.registration_fees || '',
      'رقم الإيصال (تسجيل)': r.receipt_no_reg || '',
      'التسجيل': r.registration || '',
      'الكتب': r.books || '',
      'القسط الأول': r.first_installment || '',
      'رقم الإيصال (القسط)': r.receipt_no_installment || '',
      'اللبس': r.uniform || ''
    })) : [{
      'الاسم': 'مثال: أحمد محمد', 'الجسر': '', 'الترحيل': '', 'اسم الأم': '', 'رقم الهوية': '',
      'تاريخ الدخول': '', 'تاريخ الميلاد': '', 'العمر': '', 'السكن': '', 'صفي': '',
      'موقف التحصيل': '', 'ترحيل السبت': '', 'التحصيل': '', 'ترتيب الترحيل': '', 'ملاحظات': '',
      'مكالمات الوالد': '', 'مكالمات الوالدة': '', 'واتساب الوالد': '', 'واتساب الوالدة': '',
      'رسوم التسجيل': '', 'رقم الإيصال (تسجيل)': '', 'التسجيل': '', 'الكتب': '',
      'القسط الأول': '', 'رقم الإيصال (القسط)': '', 'اللبس': ''
    }];

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    worksheet['!cols'] = Object.keys(dataToExport[0]).map(() => ({ wch: 20 }));
    if (!worksheet['!views']) worksheet['!views'] = [];
    worksheet['!views'].push({ rightToLeft: true });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "بيانات الجسر");
    XLSX.writeFile(workbook, "Bridge_Records.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          alert('الملف فارغ أو غير صالح!');
          return;
        }

        const formattedData = data.map(row => ({
          name: row['الاسم'] || row['name'] || '',
          bridge: row['الجسر'] || row['bridge'] || '',
          transport: row['الترحيل'] || row['transport'] || '',
          mother_name: row['اسم الأم'] || row['mother_name'] || '',
          national_id: String(row['رقم الهوية'] || row['national_id'] || ''),
          entry_date: row['تاريخ الدخول'] || row['entry_date'] || null,
          birth_date: row['تاريخ الميلاد'] || row['birth_date'] || null,
          age: String(row['العمر'] || row['age'] || ''),
          address: row['السكن'] || row['address'] || '',
          class_name: row['صفي'] || row['class_name'] || '',
          collection_status: row['موقف التحصيل'] || row['collection_status'] || '',
          saturday_transport: row['ترحيل السبت'] || row['saturday_transport'] || '',
          collection: row['التحصيل'] || row['collection'] || '',
          transport_order: row['ترتيب الترحيل'] || row['transport_order'] || '',
          notes: row['ملاحظات'] || row['notes'] || '',
          father_calls: String(row['مكالمات الوالد'] || row['father_calls'] || ''),
          mother_calls: String(row['مكالمات الوالدة'] || row['mother_calls'] || ''),
          father_whatsapp: String(row['واتساب الوالد'] || row['father_whatsapp'] || ''),
          mother_whatsapp: String(row['واتساب الوالدة'] || row['mother_whatsapp'] || ''),
          registration_fees: String(row['رسوم التسجيل'] || row['registration_fees'] || ''),
          receipt_no_reg: String(row['رقم الإيصال (تسجيل)'] || row['receipt_no_reg'] || ''),
          registration: row['التسجيل'] || row['registration'] || '',
          books: row['الكتب'] || row['books'] || '',
          first_installment: String(row['القسط الأول'] || row['first_installment'] || ''),
          receipt_no_installment: String(row['رقم الإيصال (القسط)'] || row['receipt_no_installment'] || ''),
          uniform: row['اللبس'] || row['uniform'] || ''
        }));

        const { error } = await supabase.from('bridge_records').insert(formattedData);
        if (error) throw error;

        alert(`تم استيراد ${formattedData.length} سجل بنجاح! 🚀`);
        fetchRecords();
      } catch (err) {
        alert('حدث خطأ أثناء قراءة أو رفع الملف: ' + err.message);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredRecords = records.filter(r => 
    (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.national_id && r.national_id.includes(searchQuery))
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px', background: '#f1f5f9', minHeight: '100vh' }}>
      
      {/* رأس الصفحة */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', border: '1px solid #cbd5e1' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '22px', fontWeight: '800' }}>🌉 قسم الجسر</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>إدارة سجلات الطلاب بأسلوب جداول إكسل التقليدية والمنظمة</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={exportToExcel}
            style={{ background: '#10b981', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >
            📊 تصدير Excel
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >
            📥 استيراد Excel
          </button>

          <button 
            onClick={() => { setEditingRecord(null); setFormData(initialFormState); setShowModal(true); }}
            style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >
            ➕ إضافة سجل
          </button>
        </div>
      </div>

      {/* شريط البحث */}
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="🔍 ابحث باسم الطالب أو رقم الهوية..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#fff' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: '50px', background: '#fff', borderRadius: '8px' }}>جاري تحميل البيانات...</div>
      ) : filteredRecords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          لا توجد سجلات مطابقة.
        </div>
      ) : (
        /* جدول أفقي تقليدي تماماً مثل إكسل (تنسيق شبكي وخطوط واضحة وهيدر بنفسجي) */
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #94a3b8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '12px', minWidth: '1700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#581c87', color: '#fff', borderBottom: '2px solid #3b0764' }}>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>الاسم</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>الجسر</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>الترحيل</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>اسم الأم</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>رقم الهوية</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>تاريخ الدخول</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>تاريخ الميلاد</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>العمر</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>السكن</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>صفي</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>موقف التحصيل</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>ترحيل السبت</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>التحصيل</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>ترتيب الترحيل</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>ملاحظات</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>مكالمات الوالد/ة</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>واتساب الوالد/ة</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>رسوم التسجيل</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>الكتب</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>القسط الأول</th>
                <th style={{ padding: '10px 8px', borderLeft: '1px solid #6b21a8' }}>اللبس</th>
                <th style={{ padding: '10px 8px', textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #cbd5e1', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0', fontWeight: 'bold', color: '#0f172a' }}>{r.name || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.bridge || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.transport || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.mother_name || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.national_id || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.entry_date || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.birth_date || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.age || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.address || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.class_name || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.collection_status || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.saturday_transport || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.collection || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.transport_order || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.notes || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0', fontSize: '11px', lineHeight: '1.4' }}>
                    أب: {r.father_calls || '-'}<br/>أم: {r.mother_calls || '-'}
                  </td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0', fontSize: '11px', lineHeight: '1.4' }}>
                    أب: {r.father_whatsapp || '-'}<br/>أم: {r.mother_whatsapp || '-'}
                  </td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0', fontSize: '11px' }}>
                    {r.registration_fees || '-'}<br/>(إيصال: {r.receipt_no_reg || '-'})
                  </td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.books || '-'}</td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0', fontSize: '11px' }}>
                    {r.first_installment || '-'}<br/>(إيصال: {r.receipt_no_installment || '-'})
                  </td>
                  <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>{r.uniform || '-'}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingRecord(r); setFormData(r); setShowModal(true); }} style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>تعديل</button>
                      <button onClick={() => handleDelete(r.id)} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* نافذة الإضافة والتعديل */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #cbd5e1' }}>
            <h3 style={{ color: '#581c87', marginTop: 0, marginBottom: '20px', fontSize: '16px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontWeight: 'bold' }}>
              {editingRecord ? '✏️ تعديل بيانات السجل' : '➕ إضافة سجل جديد'}
            </h3>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'الاسم', key: 'name' },
                  { label: 'الجسر', key: 'bridge' },
                  { label: 'الترحيل', key: 'transport' },
                  { label: 'اسم الأم', key: 'mother_name' },
                  { label: 'رقم الهوية', key: 'national_id' },
                  { label: 'تاريخ الدخول', key: 'entry_date', type: 'date' },
                  { label: 'تاريخ الميلاد', key: 'birth_date', type: 'date' },
                  { label: 'العمر', key: 'age' },
                  { label: 'السكن', key: 'address' },
                  { label: 'صفي', key: 'class_name' },
                  { label: 'موقف التحصيل', key: 'collection_status' },
                  { label: 'ترحيل السبت', key: 'saturday_transport' },
                  { label: 'التحصيل', key: 'collection' },
                  { label: 'ترتيب الترحيل حسب المرور', key: 'transport_order' },
                  { label: 'مكالمات الوالد', key: 'father_calls' },
                  { label: 'مكالمات الوالدة', key: 'mother_calls' },
                  { label: 'واتساب الوالد', key: 'father_whatsapp' },
                  { label: 'رقم الوالدة واتساب', key: 'mother_whatsapp' },
                  { label: 'رسوم التسجيل', key: 'registration_fees' },
                  { label: 'رقم الإيصال (تسجيل)', key: 'receipt_no_reg' },
                  { label: 'التسجيل', key: 'registration' },
                  { label: 'الكتب', key: 'books' },
                  { label: 'القسط الأول', key: 'first_installment' },
                  { label: 'رقم الإيصال (القسط)', key: 'receipt_no_installment' },
                  { label: 'اللبس', key: 'uniform' },
                ].map((field) => (
                  <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>{field.label}:</label>
                    <input 
                      type={field.type || 'text'}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#f8fafc' }}
                    />
                  </div>
                ))}

                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>ملاحظات:</label>
                  <textarea 
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="2"
                    style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#f8fafc', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء</button>
                <button type="submit" style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ البيانات 💾</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
