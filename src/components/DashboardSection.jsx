import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function DashboardSection({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // بيانات نموذج إضافة موظف جديد
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [passwordCode, setPasswordCode] = useState('');
  const [role, setRole] = useState('معلم');

  // صلاحيات الموظف الجديد
  const [canSeeLanding, setCanSeeLanding] = useState(true);
  const [canManageStudents, setCanManageStudents] = useState(false);
  const [canManageClasses, setCanManageClasses] = useState(false);
  const [canManageTeachers, setCanManageTeachers] = useState(false);
  const [canManageFinance, setCanManageFinance] = useState(false);
  const [canManageResults, setCanManageResults] = useState(false);
  const [canManageTransport, setCanManageTransport] = useState(false);
  const [canManageSupervisors, setCanManageSupervisors] = useState(false);
  const [canManageAdmin, setCanManageAdmin] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users_list').select('*').order('id', { ascending: true });
      if (!error && data) {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !passwordCode) {
      alert('يرجى تعبئة كافة الحقول الأساسية!');
      return;
    }

    const newUser = {
      full_name: fullName,
      username: username.trim(),
      password_code: passwordCode.trim(),
      role: role,
      can_see_landing: canSeeLanding,
      can_manage_students: canManageStudents,
      can_manage_classes: canManageClasses,
      can_manage_teachers: canManageTeachers,
      can_manage_finance: canManageFinance,
      can_manage_results: canManageResults,
      can_manage_transport: canManageTransport,
      can_manage_supervisors: canManageSupervisors,
      can_manage_admin: canManageAdmin
    };

    try {
      const { error } = await supabase.from('users_list').insert([newUser]);
      if (error) {
        alert('حدث خطأ أثناء إضافة الموظف: ' + error.message);
      } else {
        alert('تمت إضافة الموظف بنجاح!');
        // إعادة تعيين النموذج
        setFullName('');
        setUsername('');
        setPasswordCode('');
        setRole('معلم');
        setCanSeeLanding(true);
        setCanManageStudents(false);
        setCanManageClasses(false);
        setCanManageTeachers(false);
        setCanManageFinance(false);
        setCanManageResults(false);
        setCanManageTransport(false);
        setCanManageSupervisors(false);
        setCanManageAdmin(false);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePermission = async (userId, fieldName, currentValue) => {
    try {
      const { error } = await supabase
        .from('users_list')
        .update({ [fieldName]: !currentValue })
        .eq('id', userId);

      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, [fieldName]: !currentValue } : u));
      } else {
        alert('حدث خطأ أثناء تحديث الصلاحية');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('هل أنت تأكد من حذف هذا الموظف نهائياً؟')) return;

    try {
      const { error } = await supabase.from('users_list').delete().eq('id', userId);
      if (!error) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl' }}>
      
      {/* الهيدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '18px' }}>⚙️ لوحة الإدارة العليا وإدارة الصلاحيات</h3>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>إدارة الموظفين والتحكم المباشر في بوابات الوصول وقواعد البيانات</p>
        </div>
        <button onClick={onBack} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>↩️ عودة للوحة التحكم</button>
      </div>

      {/* نموذج إضافة موظف جديد */}
      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: '15px' }}>➕ إضافة موظف جديد وتعيين كلمة المرور</h4>
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            <div>
              <label style={labelStyle}>اسم الموظف الثلاثي:</label>
              <input type="text" placeholder="مثال: أحمد محمد علي" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle}>اسم الدخول البرمجي:</label>
              <input type="text" placeholder="مثال: ahmed_m" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle}>كلمة المرور / الرمز:</label>
              <input type="text" placeholder="****" value={passwordCode} onChange={e => setPasswordCode(e.target.value)} style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle}>الرتبة / الدور:</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
                <option value="معلم">👨‍🏫 معلم</option>
                <option value="محاسب">💰 محاسب</option>
                <option value="مشرف">👩‍💼 مشرف</option>
                <option value="سائق">🚌 سائق / تراحيل</option>
                <option value="أدمن">👑 أدمن</option>
              </select>
            </div>
          </div>

          {/* تحديد الصلاحيات بـ Checkboxes */}
          <div>
            <label style={{ ...labelStyle, marginBottom: '8px', display: 'block', color: '#047857' }}>🔑 تحديد الصلاحيات المتاحة للموظف:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <label style={checkLabelStyle}><input type="checkbox" checked={canSeeLanding} onChange={e => setCanSeeLanding(e.target.checked)} /> 🏠 الرئيسية</label>
              <label style={checkLabelStyle}><input type="checkbox" checked={canManageStudents} onChange={e => setCanManageStudents(e.target.checked)} /> 📚 الطلاب</label>
              <label style={checkLabelStyle}><input type="checkbox" checked={canManageClasses} onChange={e => setCanManageClasses(e.target.checked)} /> 🏛️ الفصول</label>
              <label style={checkLabelStyle}><input type="checkbox" checked={canManageTeachers} onChange={e => setCanManageTeachers(e.target.checked)} /> 👨‍🏫 المعلمين</label>
              <label style={checkLabelStyle}><input type="checkbox" checked={canManageFinance} onChange={e => setCanManageFinance(e.target.checked)} /> 💰 الحسابات</label>
              <label style={checkLabelStyle}><input type="checkbox" checked={canManageResults} onChange={e => setCanManageResults(e.target.checked)} /> 📋 النتيجة</label>
              <label style={checkLabelStyle}><input type="checkbox" checked={canManageTransport} onChange={e => setCanManageTransport(e.target.checked)} /> 🚌 التراحيل</label>
              <label style={checkLabelStyle}><input type="checkbox" checked={canManageSupervisors} onChange={e => setCanManageSupervisors(e.target.checked)} /> 👩‍💼 المشرفات</label>
              <label style={checkLabelStyle}><input type="checkbox" checked={canManageAdmin} onChange={e => setCanManageAdmin(e.target.checked)} /> 👑 الإدارة</label>
            </div>
          </div>

          <button type="submit" style={{ padding: '10px 20px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
            💾 إضافة المستخدم
          </button>
        </form>
      </div>

      {/* قائمة الموظفين وإدارة الصلاحيات المباشرة */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '15px' }}>🎥 قائمة الموظفين وإدارة الصلاحيات المباشرة ({users.length})</h4>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>جاري تحميل قائمة الموظفين...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.map((u) => (
              <div key={u.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                
                <div>
                  <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#0f172a', fontWeight: '800' }}>{u.full_name}</h5>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>اسم الدخول: <b style={{ color: '#047857' }}>{u.username}</b> | الرمز: <b style={{ color: '#d97706' }}>{u.password_code}</b> | الرتبة: <b style={{ color: '#2563eb' }}>{u.role}</b></span>
                </div>

                {/* مربعات التحكم المباشر بالصلاحيات */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_see_landing ?? true} onChange={() => handleTogglePermission(u.id, 'can_see_landing', u.can_see_landing ?? true)} /> 🏠 الرئيسية</label>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_manage_students || false} onChange={() => handleTogglePermission(u.id, 'can_manage_students', u.can_manage_students)} /> 📚 الطلاب</label>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_manage_classes || false} onChange={() => handleTogglePermission(u.id, 'can_manage_classes', u.can_manage_classes)} /> 🏛️ الفصول</label>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_manage_teachers || false} onChange={() => handleTogglePermission(u.id, 'can_manage_teachers', u.can_manage_teachers)} /> 👨‍🏫 المعلمين</label>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_manage_finance || false} onChange={() => handleTogglePermission(u.id, 'can_manage_finance', u.can_manage_finance)} /> 💰 الحسابات</label>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_manage_results || u.can_see_results || false} onChange={() => handleTogglePermission(u.id, 'can_manage_results', u.can_manage_results)} /> 📋 النتيجة</label>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_manage_transport || false} onChange={() => handleTogglePermission(u.id, 'can_manage_transport', u.can_manage_transport)} /> 🚌 التراحيل</label>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_manage_supervisors || false} onChange={() => handleTogglePermission(u.id, 'can_manage_supervisors', u.can_manage_supervisors)} /> 👩‍💼 المشرفات</label>
                  <label style={checkLabelStyle}><input type="checkbox" checked={u.can_manage_admin || false} onChange={() => handleTogglePermission(u.id, 'can_manage_admin', u.can_manage_admin)} /> 👑 الإدارة</label>
                </div>

                <button onClick={() => handleDeleteUser(u.id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🗑️ حذف</button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

const labelStyle = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#334155',
  marginBottom: '4px'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  fontSize: '12px'
};

const checkLabelStyle = {
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#1e293b',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer'
};
