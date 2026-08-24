import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddUserForm({ onUserAdded }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [passwordCode, setPasswordCode] = useState('');
  const [role, setRole] = useState('معلم');

  // صلاحيات الأقسام
  const [permissions, setPermissions] = useState({
    can_manage_students: false,
    can_manage_classes: false,
    can_manage_teachers: false,
    can_manage_finance: false,
    can_manage_results: false,
    can_manage_transport: false,
    can_manage_supervisors: false,
    can_manage_admin: false,
  });

  // صلاحيات المراحل الأربع
  const [stagePermissions, setStagePermissions] = useState({
    can_see_kindergarten: true,
    can_see_primary: true,
    can_see_middle: true,
    can_see_secondary: true,
  });

  const handlePermissionChange = (e) => {
    setPermissions({ ...permissions, [e.target.name]: e.target.checked });
  };

  const handleStageChange = (e) => {
    setStagePermissions({ ...stagePermissions, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !passwordCode) {
      alert('يرجى تعبئة كافة البيانات الأساسية للموظف');
      return;
    }

    try {
      const { error } = await supabase.from('users_list').insert([
        {
          full_name: fullName.trim(),
          username: username.trim(),
          password_code: passwordCode.trim(),
          role: role,
          ...permissions,
          ...stagePermissions,
        },
      ]);

      if (error) throw error;

      alert('تمت إضافة الموظف وتحديد الصلاحيات والمراحل بنجاح ✨');
      setFullName('');
      setUsername('');
      setPasswordCode('');
      if (onUserAdded) onUserAdded();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ بيانات الموظف!');
    }
  };

  return (
    <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#047857', fontWeight: 'bold', fontSize: '18px' }}>
        ➕ إضافة موظف جديد وتعيين كلمة المرور والصلاحيات
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>اسم الموظف الثلاثي:</label>
            <input type="text" placeholder="مثال: أحمد محمد علي" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>اسم الدخول البرمجي:</label>
            <input type="text" placeholder="مثال: ahmed_m" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>كلمة المرور / الرمز:</label>
            <input type="password" placeholder="****" value={passwordCode} onChange={(e) => setPasswordCode(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>الرتبة / الدور:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
              <option value="معلم">🧑‍🏫 معلم</option>
              <option value="مشرف">👩‍🏫 مشرف</option>
              <option value="محاسب">💰 محاسب</option>
              <option value="مدير">👑 مدير النظام</option>
            </select>
          </div>
        </div>

        {/* 🔑 صلاحيات الأقسام */}
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}>
            🔑 تحديد صلاحيات الوصول للأقسام:
          </h4>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
            <label style={checkboxLabelStyle}><input type="checkbox" name="can_manage_students" checked={permissions.can_manage_students} onChange={handlePermissionChange} /> 📚 الطلاب</label>
            <label style={checkboxLabelStyle}><input type="checkbox" name="can_manage_classes" checked={permissions.can_manage_classes} onChange={handlePermissionChange} /> 🏫 الفصول</label>
            <label style={checkboxLabelStyle}><input type="checkbox" name="can_manage_teachers" checked={permissions.can_manage_teachers} onChange={handlePermissionChange} /> 👨‍🏫 المعلمين</label>
            <label style={checkboxLabelStyle}><input type="checkbox" name="can_manage_finance" checked={permissions.can_manage_finance} onChange={handlePermissionChange} /> 💰 الحسابات</label>
            <label style={checkboxLabelStyle}><input type="checkbox" name="can_manage_results" checked={permissions.can_manage_results} onChange={handlePermissionChange} /> 📋 النتيجة</label>
            <label style={checkboxLabelStyle}><input type="checkbox" name="can_manage_transport" checked={permissions.can_manage_transport} onChange={handlePermissionChange} /> 🚌 التراحيل</label>
            <label style={checkboxLabelStyle}><input type="checkbox" name="can_manage_supervisors" checked={permissions.can_manage_supervisors} onChange={handlePermissionChange} /> 👩‍🏫 المشرفات</label>
            <label style={checkboxLabelStyle}><input type="checkbox" name="can_manage_admin" checked={permissions.can_manage_admin} onChange={handlePermissionChange} /> 👑 الإدارة</label>
          </div>
        </div>

        {/* 🎓 صلاحيات المراحل التعليمية الأربع */}
        <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#047857', fontSize: '14px', fontWeight: 'bold' }}>
            🎓 تحديد المراحل التعليمية المصرح للموظف بفتحها:
          </h4>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 'bold', color: '#065f46' }}>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" name="can_see_kindergarten" checked={stagePermissions.can_see_kindergarten} onChange={handleStageChange} /> 🧸 مرحلة الروضة
            </label>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" name="can_see_primary" checked={stagePermissions.can_see_primary} onChange={handleStageChange} /> 🏫 المرحلة الابتدائية
            </label>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" name="can_see_middle" checked={stagePermissions.can_see_middle} onChange={handleStageChange} /> 🎒 المرحلة المتوسطة
            </label>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" name="can_see_secondary" checked={stagePermissions.can_see_secondary} onChange={handleStageChange} /> 🎓 المرحلة الثانوية
            </label>
          </div>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#047857', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
          حفظ الموظف وتثبيت الصلاحيات 💾
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' };
