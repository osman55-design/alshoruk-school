import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function DashboardSection({ onBack }) {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newLoginName, setNewLoginName] = useState(''); 
  const [newPin, setNewPin] = useState('');              
  const [newRole, setNewRole] = useState('معلم');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // دالة جلب الموظفين الحية
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users_list')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      if (data) setUsers(data);
    } catch (error) {
      console.error("خطأ في جلب المستخدمين:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // دالة إضافة موظف جديد
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newLoginName.trim() || !newPin.trim()) {
      alert("الرجاء ملء كافة خانات البيانات (الاسم، اسم الدخول، وكلمة المرور)");
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('users_list')
        .insert([{
          full_name: newName.trim(),
          username: newLoginName.trim(),
          password_code: newPin.trim(),
          role: newRole,
          can_manage_students: newRole === 'إداري' || newRole === 'أدمن',
          can_manage_classes: newRole === 'إداري' || newRole === 'أدمن',
          can_manage_teachers: newRole === 'أدمن' || newRole === 'معلم',
          can_manage_finance: newRole === 'محاسب' || newRole === 'أدمن',
          can_manage_results: newRole === 'معلم' || newRole === 'أدمن', 
          can_manage_admin: newRole === 'أدمن'
        }]);

      if (error) throw error;

      alert(`✅ تم الحفظ في قاعدة البيانات بنجاح!\nالموظف: ${newName}\nاسم الدخول: ${newLoginName}`);
      setNewName('');
      setNewLoginName('');
      setNewPin('');
      fetchUsers();

    } catch (error) {
      console.error("حدث خطأ في الاتصال بقاعدة البيانات:", error);
      alert("❌ فشل حفظ البيانات: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً من النظام؟")) {
      try {
        const { error } = await supabase
          .from('users_list')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        alert("تم حذف المستخدم بنجاح.");
        if (selectedUser?.id === userId) setSelectedUser(null);
        fetchUsers();
      } catch (error) {
        console.error("خطأ في الحذف:", error);
        alert("❌ فشل الحذف: " + error.message);
      }
    }
  };

  const handlePermissionChange = async (userId, permColumn, currentValue) => {
    const newValue = !currentValue;

    setUsers(prevUsers =>
      prevUsers.map(u => u.id === userId ? { ...u, [permColumn]: newValue } : u)
    );

    try {
      const { error } = await supabase
        .from('users_list')
        .update({ [permColumn]: newValue })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error("خطأ في تحديث الصلاحية:", error);
      alert("❌ فشل التحديث: " + error.message);
      fetchUsers();
    }
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* 1️⃣ شريط العنوان وزر العودة العصرية */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#0f172a', margin: 0, fontWeight: '800', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚙️ لوحة الإدارة العليا وإدارة الصلاحيات
          </h2>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '13px', fontWeight: '500' }}>
            إدارة الموظفين والتحكم المباشر في بوابات الوصول وقواعد البيانات
          </p>
        </div>
        {onBack && (
          <button 
            onClick={onBack} 
            style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '9px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: '0.2s' }}
          >
            ↩️ عودة للوحة التحكم
          </button>
        )}
      </div>

      {/* 2️⃣ بطاقة إضافة موظف جديد (Modern Glass Card) */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '28px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
        <h4 style={{ marginTop: 0, color: '#047857', marginBottom: '18px', fontWeight: '800', fontSize: '15px' }}>
          ➕ إضافة موظف جديد وتعيين كلمة المرور
        </h4>
        <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>اسم الموظف الثلاثي:</label>
            <input 
              type="text" placeholder="مثال: أحمد محمد علي" value={newName} onChange={e => setNewName(e.target.value)} 
              style={inputStyle} required 
            />
          </div>

          <div>
            <label style={labelStyle}>اسم الدخول البرمجي:</label>
            <input 
              type="text" placeholder="مثال: ahmed_m" value={newLoginName} onChange={e => setNewLoginName(e.target.value)} 
              style={inputStyle} required 
            />
          </div>

          <div>
            <label style={labelStyle}>كلمة المرور / الرمز:</label>
            <input 
              type="text" placeholder="****" value={newPin} onChange={e => setNewPin(e.target.value)} 
              style={inputStyle} required 
            />
          </div>

          <div>
            <label style={labelStyle}>الرتبة / الدور:</label>
            <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ ...inputStyle, fontWeight: 'bold', color: '#047857' }}>
              <option value="معلم">👨‍🏫 معلم</option>
              <option value="محاسب">💰 محاسب</option>
              <option value="إداري">🏫 إداري</option>
              <option value="أدمن">👑 أدمن</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={{ padding: '11px', backgroundColor: '#047857', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', height: '42px', boxShadow: '0 4px 12px rgba(4,120,87,0.2)' }}>
            {loading ? "جاري الحفظ..." : "إضافة المستخدم 💾"}
          </button>
        </form>
      </div>

      {/* 3️⃣ قائمة عرض الموظفين بطريقة عصرية */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
        <h4 style={{ marginTop: 0, color: '#0f172a', marginBottom: '20px', fontWeight: '800', fontSize: '15px' }}>
          👥 قائمة الموظفين وإدارة الصلاحيات المباشرة ({users.length})
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {users.map(u => (
            <div 
              key={u.id} 
              onClick={() => setSelectedUser(u)}
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justify: 'space-between', 
                alignItems: 'center', 
                padding: '16px 20px', 
                borderRadius: '14px', 
                border: selectedUser?.id === u.id ? '2px solid #10b981' : '1px solid #e2e8f0', 
                backgroundColor: selectedUser?.id === u.id ? '#f0fdf4' : '#f8fafc', 
                transition: 'all 0.2s ease', 
                gap: '16px' 
              }}
            >
              {/* بيانات الموظف */}
              <div style={{ minWidth: '220px' }}>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>{u.full_name}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span>اسم الدخول: <strong style={{ color: '#047857' }}>{u.username}</strong></span>
                  <span>•</span>
                  <span>الرمز: <strong style={{ color: '#d97706' }}>{u.password_code}</strong></span>
                  <span>•</span>
                  <span>الرتبة: <strong style={{ color: '#2563eb' }}>{u.role}</strong></span>
                </div>
              </div>

              {/* الصلاحيات الستة بتصميم حديث */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', backgroundColor: '#ffffff', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                
                <label style={checkboxLabelStyle}>
                  <input type="checkbox" checked={u.can_manage_students || false} onChange={() => handlePermissionChange(u.id, 'can_manage_students', u.can_manage_students)} style={checkboxStyle} />
                  📚 الطلاب
                </label>

                <label style={checkboxLabelStyle}>
                  <input type="checkbox" checked={u.can_manage_classes || false} onChange={() => handlePermissionChange(u.id, 'can_manage_classes', u.can_manage_classes)} style={checkboxStyle} />
                  🏛️ الفصول
                </label>

                <label style={checkboxLabelStyle}>
                  <input type="checkbox" checked={u.can_manage_teachers || false} onChange={() => handlePermissionChange(u.id, 'can_manage_teachers', u.can_manage_teachers)} style={checkboxStyle} />
                  👨‍🏫 المعلمين
                </label>

                <label style={checkboxLabelStyle}>
                  <input type="checkbox" checked={u.can_manage_finance || false} onChange={() => handlePermissionChange(u.id, 'can_manage_finance', u.can_manage_finance)} style={checkboxStyle} />
                  💰 الحسابات
                </label>

                <label style={checkboxLabelStyle}>
                  <input type="checkbox" checked={u.can_manage_results || false} onChange={() => handlePermissionChange(u.id, 'can_manage_results', u.can_manage_results)} style={checkboxStyle} />
                  📋 النتيجة
                </label>

                <label style={checkboxLabelStyle}>
                  <input type="checkbox" checked={u.can_manage_admin || false} onChange={() => handlePermissionChange(u.id, 'can_manage_admin', u.can_manage_admin)} style={checkboxStyle} />
                  👑 الإدارة
                </label>

              </div>

              {/* زر الحذف */}
              <div>
                {u.username !== 'admin' ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }} 
                    style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    🗑️ حذف
                  </button>
                ) : (
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', padding: '6px' }}>👑 رئيسي</span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

// ⚙️ التنسيقات العصرية
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#334155' };
const checkboxStyle = { width: '15px', height: '15px', accentColor: '#10b981', cursor: 'pointer' };
