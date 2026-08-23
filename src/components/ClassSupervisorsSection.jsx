import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ClassSupervisorsSection({ onBack }) {
  const [supervisors, setSupervisors] = useState([]);
  const [classesList, setClassesList] = useState(['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس']);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '22px' }}>👩‍🏫 إدارة مشرفين ومشرفات الفصول</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>تعيين متابع وإداري مسؤول لكل فصل دراسي</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ⬅️ رجوع
          </button>
        )}
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
