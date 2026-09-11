import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function BridgeSection({ currentUser }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // نموذج البيانات الافتراضي لحقول الجسر
  const initialFormState = {
    name: '',
    bridge: '',
    transport: '',
    mother_name: '',
    national_id: '',
    entry_date: '',
    birth_date: '',
    age: '',
    address: '',
    class_name: '',
    collection_status: '',
    saturday_transport: '',
    collection: '',
    transport_order: '',
    notes: '',
    father_calls: '',
    mother_calls: '',
    father_whatsapp: '',
    mother_whatsapp: '',
    registration_fees: '',
    receipt_no_reg: '',
    registration: '',
    books: '',
    first_installment: '',
    receipt_no_installment: '',
    uniform: ''
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
        const { error } = await supabase
          .from('bridge_records')
          .update(formData)
          .eq('id', editingRecord.id);
        if (error) throw error;
        alert('تم التعديل بنجاح! ✨');
      } else {
        const { error } = await supabase
          .from('bridge_records')
          .insert([formData]);
        if (error) throw error;
        alert('تمت الإضافة بنجاح! 🎉');
      }
      setShowAddModal(false);
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

  const filteredRecords = records.filter(r => 
    (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.national_id && r.national_id.includes(searchQuery))
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>🌉 قسم الجسر</h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>إدارة بيانات وسجلات الجسر والترحيل والرسوم</p>
        </div>
        <button 
          onClick={() => { setEditingRecord(null); setFormData(initialFormState); setShowAddModal(true); }}
          style={{ backgroundColor: '#0d9488', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          ➕ إضافة سجل جديد
        </button>
      </div>

      {/* شريط البحث */}
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="بحث بالاسم أو رقم الهوية..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', maxWidth: '350px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>جاري التحميل...</p>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: '600px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px', minWidth: '1600px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0', color: '#334155', position: 'sticky', top: 0, zIndex: 10 }}>
                <th style={{ padding: '10px' }}>الاسم</th>
                <th style={{ padding: '10px' }}>الجسر</th>
                <th style={{ padding: '10px' }}>الترحيل</th>
                <th style={{ padding: '10px' }}>اسم الأم</th>
                <th style={{ padding: '10px' }}>رقم الهوية</th>
                <th style={{ padding: '10px' }}>تاريخ الدخول</th>
                <th style={{ padding: '10px' }}>تاريخ الميلاد</th>
                <th style={{ padding: '10px' }}>العمر</th>
                <th style={{ padding: '10px' }}>السكن</th>
                <th style={{ padding: '10px' }}>صفي</th>
                <th style={{ padding: '10px' }}>موقف التحصيل</th>
                <th style={{ padding: '10px' }}>ترحيل السبت</th>
                <th style={{ padding: '10px' }}>التحصيل</th>
                <th style={{ padding: '10px' }}>ترتيب الترحيل</th>
                <th style={{ padding: '10px' }}>ملاحظات</th>
                <th style={{ padding: '10px' }}>مكالمات الوالد</th>
                <th style={{ padding: '10px' }}>مكالمات الوالدة</th>
                <th style={{ padding: '10px' }}>واتساب الوالد</th>
                <th style={{ padding: '10px' }}>واتساب الوالدة</th>
                <th style={{ padding: '10px' }}>رسوم التسجيل</th>
                <th style={{ padding: '10px' }}>رقم الإيصال</th>
                <th style={{ padding: '10px' }}>التسجيل</th>
                <th style={{ padding: '10px' }}>الكتب</th>
                <th style={{ padding: '10px' }}>القسط الأول</th>
                <th style={{ padding: '10px' }}>إيصال القسط</th>
                <th style={{ padding: '10px' }}>اللبس</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="27" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>لا توجد بيانات متاحة.</td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{r.name || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.bridge || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.transport || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.mother_name || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.national_id || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.entry_date || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.birth_date || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.age || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.address || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.class_name || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.collection_status || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.saturday_transport || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.collection || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.transport_order || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.notes || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.father_calls || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.mother_calls || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.father_whatsapp || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.mother_whatsapp || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.registration_fees || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.receipt_no_reg || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.registration || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.books || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.first_installment || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.receipt_no_installment || '---'}</td>
                    <td style={{ padding: '10px' }}>{r.uniform || '---'}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => { setEditingRecord(r); setFormData(r); setShowAddModal(true); }} style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>تعديل ✏️</button>
                        <button onClick={() => handleDelete(r.id)} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>حذف 🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* نافذة الإضافة والتعديل */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '95%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: '#0d9488', marginTop: 0 }}>{editingRecord ? '✏️ تعديل سجل الجسر' : '➕ إضافة سجل جديد'}</h3>
            
            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
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
                { label: 'ملاحظات', key: 'notes' },
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
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              ))}

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء</button>
                <button type="submit" style={{ background: '#0d9488', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ البيانات 💾</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
