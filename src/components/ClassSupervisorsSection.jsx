import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function ClassSupervisorsSection({ onBack }) {
  const [supervisors, setSupervisors] = useState([]);
  const [classesList, setClassesList] = useState(['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس']);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // حقول النموذج
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedClass, setAssignedClass] = useState('الصف الأول');
  const [gender, setGender] = useState('مشرفة');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('class_supervisors').select('*').order('id', { ascending: false });
      if (error) throw error;
      setSupervisors(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('يرجى كتابة اسم المشرف/المشرفة');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('class_supervisors')
          .update({ name: name.trim(), phone, assigned_class: assignedClass, gender })
          .eq('id', editingId);
        if (error) throw error;
        alert('تم تعديل بيانات المشرف بنجاح ✨');
      } else {
        const { error } = await supabase
          .from('class_supervisors')
          .insert([{ name: name.trim(), phone, assigned_class: assignedClass, gender }]);
        if (error) throw error;
        alert('تمت إضافة المشرف/المشرفة بنجاح 👏');
      }
      resetForm();
      fetchSupervisors();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ! تأكد من وجود جدول class_supervisors في Supabase.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذا المشرف؟')) {
      try {
        const { error } = await supabase.from('class_supervisors').delete().eq('id', id);
        if (error) throw error;
        fetchSupervisors();
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء الحذف!');
      }
    }
  };

  const handleEdit = (sup) => {
    setEditingId(sup.id);
    setName(sup.name);
    setPhone(sup.phone || '');
    setAssignedClass(sup.assigned_class);
    setGender(sup.gender || 'مشرفة');
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setGender('مشرفة');
  };

  // دالة استيراد ملفات الإكسيل
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          alert('ملف الإكسيل فارغ أو غير صالح!');
          setUploading(false);
          return;
        }

        // تحويل وتجهيز البيانات للإدخال لقاعدة البيانات
        const formattedData = data.map(row => {
          const supName = row['الاسم'] || row['اسم المشرف'] || row['اسم المشرفة'] || row['Name'] || '';
          const supClass = row['الصف المسؤول'] || row['الصف'] || row['الفصل'] || row['Class'] || 'الصف الأول';
          const supPhone = row['رقم الهاتف'] || row['الهاتف'] || row['الجوال'] || row['Phone'] || '';
          const supGender = row['النوع'] || row['الصفة'] || (supName.includes('أستاذة') || supName.includes('مس') ? 'مشرفة' : 'مشرف');

          return {
            name: String(supName).trim(),
            assigned_class: String(supClass).trim(),
            phone: String(supPhone).trim(),
            gender: String(supGender).includes('مشرف') && !String(supGender).includes('مشرفة') ? 'مشرف' : 'مشرفة'
          };
        }).filter(item => item.name !== '');

        if (formattedData.length === 0) {
          alert('لم يتم العثور على بيانات صحيحة مطابقة للأعمدة المطلوبة في الملف.');
          setUploading(false);
          return;
        }

        // إدخال البيانات دفعة واحدة إلى Supabase
        const { error } = await supabase.from('class_supervisors').insert(formattedData);
        if (error) throw error;

        alert(`تم استيراد وإضافة ${formattedData.length} مشرف/مشرفة بنجاح! 🚀`);
        fetchSupervisors();
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء قراءة أو رفع ملف الإكسيل. تأكد من صحة الأعمدة.');
      } finally {
        setUploading(false);
        e.target.value = null; // إعادة تعيين الحقل
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '22px' }}>👩‍🏫 إدارة مشرفين ومشرفات الفصول</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>تعيين متابع وإداري مسؤول لكل فصل دراسي</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* زر الاستيراد من الإكسيل */}
          <label style={{ 
            backgroundColor: '#059669', color: '#fff', padding: '8px 16px', borderRadius: '8px', 
            cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            {uploading ? '⏳ جاري الرفع...' : '📥 استيراد من ملف Excel'}
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>

          {onBack && (
            <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              ⬅️ رجوع
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* نموذج الإضافة والتعديل */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '16px', fontWeight: 'bold' }}>
            {editingId ? '✏️ تعديل بيانات مشرف' : '➕ إضافة مشرف/مشرفة جديد'}
          </h3>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>اسم المشرف / المشرفة:</label>
            <input type="text" placeholder="مثال: أستاذة نوال أحمد" value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>الصف / الفصل المسؤول عنه:</label>
            <select value={assignedClass} onChange={e => setAssignedClass(e.target.value)} style={inputStyle}>
              {classesList.map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>الصفة / النوع:</label>
            <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle}>
              <option value="مشرفة">👩‍🏫 مشرفة فصل</option>
              <option value="مشرف">👨‍🏫 مشرف فصل</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>رقم الهاتف / الواتساب:</label>
            <input type="text" placeholder="01XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ flex: 1, padding: '11px', backgroundColor: editingId ? '#3b82f6' : '#047857', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {editingId ? 'تحديث البيانات' : 'حفظ المشرف 💾'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '11px 14px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>إلغاء</button>
            )}
          </div>
        </form>

        {/* الجدول */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '13px' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>الاسم</th>
                <th style={thStyle}>الصف المسؤول عنه</th>
                <th style={thStyle}>رقم التواصل</th>
                <th style={thStyle}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>⏳ جاري التحميل...</td></tr>
              ) : supervisors.length > 0 ? (
                supervisors.map((sup, index) => (
                  <tr key={sup.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0f172a' }}>
                      {sup.gender === 'مشرفة' ? '👩‍🏫 ' : '👨‍🏫 '}{sup.name}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                        {sup.assigned_class}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: '#047857', fontWeight: 'bold' }}>{sup.phone || 'غير مدخل'}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleEdit(sup)} style={{ padding: '4px 10px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', marginLeft: '6px', fontSize: '12px', fontWeight: 'bold' }}>✏️ تعديل</button>
                      <button onClick={() => handleDelete(sup.id)} style={{ padding: '4px 10px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🗑️ حذف</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>لا يوجد مشرفين مضافين حتى الآن.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff', fontWeight: 'bold' };
const thStyle = { padding: '12px 14px', fontWeight: '700' };
const tdStyle = { padding: '12px 14px', fontSize: '13.5px' };
