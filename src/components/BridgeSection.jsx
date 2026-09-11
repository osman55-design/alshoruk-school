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

  // 📤 تصدير البيانات إلى ملف Excel
  const exportToExcel = () => {
    if (records.length === 0) {
      alert('لا توجد بيانات لتصديرها!');
      return;
    }

    // تجهيز البيانات بأسماء أعمدة عربية واضحة
    const dataToExport = records.map(r => ({
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
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "بيانات الجسر");
    XLSX.writeFile(workbook, "Bridge_Records.xlsx");
  };

  // 📥 استيراد البيانات من ملف Excel
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

        // مطابقة الحقول العربية أو الإنجليزية مع قاعدة البيانات
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
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      <style>{`
        @media (min-width: 900px) {
          .bridge-table-view { display: block !important; }
          .bridge-cards-view { display: none !important; }
        }
        @media (max-width: 899px) {
          .bridge-table-view { display: none !important; }
          .bridge-cards-view { display: grid !important; }
        }
      `}</style>

      {/* الهيدر العلوي وأزرار التحكم */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '800' }}>🌉 قسم الجسر</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>إدارة بيانات الطلاب، الترحيل، والرسوم المالية بكل سهولة</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* زر تصدير إكسل */}
          <button 
            onClick={exportToExcel}
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', 
              fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' 
            }}
          >
            📊 تصدير Excel
          </button>

          {/* زر استيراد إكسل مخفي */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              background: 'linear-gradient(135deg, #0284c7, #0369a1)', 
              color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', 
              fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(2,132,199,0.25)' 
            }}
          >
            📥 استيراد Excel
          </button>

          {/* زر إضافة سجل جديد */}
          <button 
            onClick={() => { setEditingRecord(null); setFormData(initialFormState); setShowModal(true); }}
            style={{ 
              background: 'linear-gradient(135deg, #0d9488, #0f766e)', 
              color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', 
              fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(13,148,136,0.25)' 
            }}
          >
            ➕ إضافة سجل
          </button>
        </div>
      </div>

      {/* شريط البحث */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 ابحث باسم الطالب أو رقم الهوية..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '11px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#f8fafc' }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>جاري تحميل البيانات...</p>
      ) : filteredRecords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
          لا توجد سجلات مطابقة.
        </div>
      ) : (
        <>
          {/* 💻 جدول منظم للكمبيوتر */}
          <div className="bridge-table-view" style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px', minWidth: '1500px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155' }}>
                  <th style={{ padding: '12px' }}>الاسم</th>
                  <th style={{ padding: '12px' }}>الجسر</th>
                  <th style={{ padding: '12px' }}>الترحيل</th>
                  <th style={{ padding: '12px' }}>اسم الأم</th>
                  <th style={{ padding: '12px' }}>رقم الهوية</th>
                  <th style={{ padding: '12px' }}>تاريخ الدخول</th>
                  <th style={{ padding: '12px' }}>تاريخ الميلاد</th>
                  <th style={{ padding: '12px' }}>العمر</th>
                  <th style={{ padding: '12px' }}>السكن</th>
                  <th style={{ padding: '12px' }}>صفي</th>
                  <th style={{ padding: '12px' }}>موقف التحصيل</th>
                  <th style={{ padding: '12px' }}>ترحيل السبت</th>
                  <th style={{ padding: '12px' }}>التحصيل</th>
                  <th style={{ padding: '12px' }}>ترتيب الترحيل</th>
                  <th style={{ padding: '12px' }}>ملاحظات</th>
                  <th style={{ padding: '12px' }}>مكالمات الوالد/ة</th>
                  <th style={{ padding: '12px' }}>واتساب الوالد/ة</th>
                  <th style={{ padding: '12px' }}>رسوم التسجيل</th>
                  <th style={{ padding: '12px' }}>الكتب</th>
                  <th style={{ padding: '12px' }}>القسط الأول</th>
                  <th style={{ padding: '12px' }}>اللبس</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, idx) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>{r.name || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.bridge || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.transport || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.mother_name || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.national_id || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.entry_date || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.birth_date || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.age || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.address || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.class_name || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.collection_status || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.saturday_transport || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.collection || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.transport_order || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.notes || '-'}</td>
                    <td style={{ padding: '12px' }}>أب: {r.father_calls || '-'}<br/>أم: {r.mother_calls || '-'}</td>
                    <td style={{ padding: '12px' }}>أب: {r.father_whatsapp || '-'}<br/>أم: {r.mother_whatsapp || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.registration_fees || '-'} (إيصال: {r.receipt_no_reg || '-'})</td>
                    <td style={{ padding: '12px' }}>{r.books || '-'}</td>
                    <td style={{ padding: '12px' }}>{r.first_installment || '-'} (إيصال: {r.receipt_no_installment || '-'})</td>
                    <td style={{ padding: '12px' }}>{r.uniform || '-'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => { setEditingRecord(r); setFormData(r); setShowModal(true); }} style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>تعديل ✏️</button>
                        <button onClick={() => handleDelete(r.id)} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حذف 🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 بطاقات عرض للجوال */}
          <div className="bridge-cards-view" style={{ gridTemplateColumns: '1fr', gap: '16px' }}>
            {filteredRecords.map((r) => (
              <div key={r.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: '#0d9488', fontSize: '16px', fontWeight: 'bold' }}>{r.name || 'بدون اسم'}</h3>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>الصف: {r.class_name || '---'}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#334155', marginBottom: '12px' }}>
                  <div><strong>الهوية:</strong> {r.national_id || '-'}</div>
                  <div><strong>العمر:</strong> {r.age || '-'}</div>
                  <div><strong>اسم الأم:</strong> {r.mother_name || '-'}</div>
                  <div><strong>السكن:</strong> {r.address || '-'}</div>
                  <div><strong>الجسر:</strong> {r.bridge || '-'}</div>
                  <div><strong>الترحيل:</strong> {r.transport || '-'}</div>
                  <div><strong>موقف التحصيل:</strong> {r.collection_status || '-'}</div>
                  <div><strong>اللبس:</strong> {r.uniform || '-'}</div>
                </div>

                {r.notes && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                    <strong>ملاحظات:</strong> {r.notes}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <button onClick={() => { setEditingRecord(r); setFormData(r); setShowModal(true); }} style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>تعديل ✏️</button>
                  <button onClick={() => handleDelete(r.id)} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>حذف 🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* نافذة الإضافة والتعديل */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#0d9488', marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
              {editingRecord ? '✏️ تعديل بيانات السجل' : '➕ إضافة سجل جديد لجسر'}
            </h3>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
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
                      style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#f8fafc' }}
                    />
                  </div>
                ))}

                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>ملاحظات:</label>
                  <textarea 
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="2"
                    style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#f8fafc', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء</button>
                <button type="submit" style={{ background: '#0d9488', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(13,148,136,0.3)' }}>حفظ البيانات 💾</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
