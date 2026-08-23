import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function TeachersSection({ onBack }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // حقول نموذج إدخال معلم جديد
  const [teacherName, setTeacherName] = useState('');
  const [specialization, setSpecialization] = useState('اللغة العربية');
  const [phone, setPhone] = useState('');
  const [assignedClasses, setAssignedClasses] = useState('');

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
            teacher_name: teacherName,
            specialization: specialization,
            phone: phone,
            classes: assignedClasses
          }
        ]);

      if (error) throw error;

      alert("✅ تم إضافة المعلم بنجاح!");
      setTeacherName('');
      setPhone('');
      setAssignedClasses('');
      fetchTeachers();
    } catch (err) {
      alert("❌ خطأ أثناء الإضافة: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // حذف معلم
  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("هل أنت تأكد من حذف هذا المعلم؟")) return;

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

  return (
    <div style={{ direction: 'rtl', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* رأس الصفحة */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>👨‍🏫 إدارة كادر المعلمين</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>تسجيل المعلمين، التخصصات، والمراحل الدراسية المسندة لهم</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            ❌ إغلاق
          </button>
        )}
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* نموذج إضافة معلم */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a' }}>➕ إضافة معلم جديد:</h4>
          <form onSubmit={handleAddTeacher} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
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

            <div>
              <label style={labelStyle}>الفصول المسندة له</label>
              <input type="text" value={assignedClasses} onChange={e => setAssignedClasses(e.target.value)} placeholder="مثال: أول أ، ثاني ب" style={inputStyle} />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
              {loading ? 'جاري الحفظ...' : '💾 حفظ المعلم'}
            </button>
          </form>
        </div>

        {/* جدول عرض المعلمين */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: '14px' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>اسم المعلم</th>
                <th style={thStyle}>التخصص</th>
                <th style={thStyle}>رقم الهاتف</th>
                <th style={thStyle}>الفصول/المراحل</th>
                <th style={thStyle}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((tc, index) => (
                  <tr key={tc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{tc.teacher_name || tc.name}</td>
                    <td style={tdStyle}><span style={badgeStyle}>{tc.specialization || 'غير حدد'}</span></td>
                    <td style={tdStyle}>{tc.phone || '—'}</td>
                    <td style={{ ...tdStyle, color: '#0284c7', fontWeight: '600' }}>{tc.classes || '—'}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleDeleteTeacher(tc.id)} style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                        🗑️ حذف
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    {loading ? 'جاري تحكم البيانات...' : '📋 لا يوجد معلمون مسجلون حالياً.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
