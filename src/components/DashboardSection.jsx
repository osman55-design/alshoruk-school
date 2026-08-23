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

  // دالة جلب الموظفين الحية بالعمود الجديد للنتيجة
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

  // دالة إضافة موظف جديد وحفظ حقل النتيجة المستقل
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

    // تحديث الحالة فوراً في الـ React State لتظهر الاستجابة السريعة للمستخدم
    setUsers(prevUsers =>
      prevUsers.map(u => u.id === userId ? { ...u, [permColumn]: newValue } : u)
    );

    try {
      const { error } = await supabase
        .from('users_list')
        .update({ [permColumn]: newValue })
        .eq('id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("خطأ في تحديث الصلاحية:", error);
      alert("❌ فشل التحديث: " + error.message);
      fetchUsers(); // تراجع عن التحديث وتحديث البيانات الحقيقية من الداتابيز
    }
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', fontFamily: 'Arial', backgroundColor: '#ffffff' }}>
      
      {/* شريط العنوان وزر العودة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ color: '#047857', margin: 0, fontWeight: 'bold' }}>⚙️ لوحة الإدارة العليا وإدارة صلاحيات المستخدمين</h2>
          <p style={{ color: '#064e3b', margin: '5px 0 0 0', fontSize: '14px', fontWeight: '700' }}>تعديل وإدارة صلاحيات بوابات موظفي مدرسة الشروق الملكية عبر قاعدة البيانات الحية</p>
        </div>
        <button 
          onClick={onBack} 
          style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(245,158,11,0.2)' }}
        >
          ↩️ عودة للوحة التحكم
        </button>
      </div>

      {/* نموذج إضافة الموظفين الجدد */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <h4 style={{ marginTop: 0, color: '#047857', marginBottom: '15px', fontWeight: 'bold' }}>➕ إضافة موظف جديد وتعيين كلمة مرور مخصصة</h4>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" placeholder="اسم الموظف المألوف ثلاثي" value={newName} onChange={e => setNewName(e.target.value)} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: '2', textAlign: 'right', fontWeight: 'bold' }} required 
          />
          <input 
            type="text" placeholder="اسم الدخول البرمجي" value={newLoginName} onChange={e => setNewLoginName(e.target.value)} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: '1', textAlign: 'right', fontWeight: 'bold' }} required 
          />
          <input 
            type="text" placeholder="تعيين كلمة مرور مخصصة" value={newPin} onChange={e => setNewPin(e.target.value)} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: '1', textAlign: 'right', fontWeight: 'bold' }} required 
          />
          <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '120px', fontWeight: 'bold', color: '#047857' }}>
            <option value="معلم">معلم</option>
            <option value="محاسب">محاسب</option>
            <option value="إداري">إداري</option>
            <option value="أدمن">أدمن</option>
          </select>
          <button type="submit" disabled={loading} style={{ padding: '11px 24px', backgroundColor: '#047857', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(4,120,87,0.2)' }}>
            {loading ? "جاري الحفظ..." : "إضافة مستخدم"}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* قائمة عرض الصلاحيات والموظفين */}
        <div style={{ flex: '1', minWidth: '100%', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <h4 style={{ marginTop: 0, color: '#047857', marginBottom: '20px', fontWeight: 'bold' }}>👥 قائمة الموظفين وإدارة الصلاحيات المباشرة للأقسام ({users.length})</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {users.map(u => (
              <div 
                key={u.id} 
                onClick={() => setSelectedUser(u)}
                style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '10px', border: selectedUser?.id === u.id ? '2px solid #f59e0b' : '1px solid #e2e8f0', background: selectedUser?.id === u.id ? '#ecfdf5' : '#fff', transition: 'all 0.2s', gap: '15px' }}
              >
                <div style={{ minWidth: '220px' }}>
                  <div style={{ fontWeight: 'bold', color: '#047857', fontSize: '16px' }}>{u.full_name}</div>
                  <div style={{ fontSize: '13px', color: '#064e3b', marginTop: '4px', fontWeight: '700' }}>
                    اسم الدخول: <strong style={{ color: '#10b981' }}>{u.username}</strong> | 
                    رقم الدخول: <strong style={{ color: '#f59e0b' }}>{u.password_code}</strong> | 
                    الرتبة: <span>{u.role}</span>
                  </div>
                </div>

                {/* خيارات الصلاحيات الستة */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', background: 'rgba(241,245,249,0.7)', padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#064e3b' }}>
                    <input type="checkbox" checked={u.can_manage_students || false} onChange={() => handlePermissionChange(u.id, 'can_manage_students', u.can_manage_students)} style={{ width: '16px', height: '16px', accentColor: '#047857', cursor: 'pointer' }} />
                    📚 الطلاب
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#064e3b' }}>
                    <input type="checkbox" checked={u.can_manage_classes || false} onChange={() => handlePermissionChange(u.id, 'can_manage_classes', u.can_manage_classes)} style={{ width: '16px', height: '16px', accentColor: '#047857', cursor: 'pointer' }} />
                    🏛️ الفصول
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#064e3b' }}>
                    <input type="checkbox" checked={u.can_manage_teachers || false} onChange={() => handlePermissionChange(u.id, 'can_manage_teachers', u.can_manage_teachers)} style={{ width: '16px', height: '16px', accentColor: '#047857', cursor: 'pointer' }} />
                    👨‍🏫 المعلمين
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#064e3b' }}>
                    <input type="checkbox" checked={u.can_manage_finance || false} onChange={() => handlePermissionChange(u.id, 'can_manage_finance', u.can_manage_finance)} style={{ width: '16px', height: '16px', accentColor: '#047857', cursor: 'pointer' }} />
                    💰 الحسابات
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#064e3b' }}>
                    <input type="checkbox" checked={u.can_manage_results || false} onChange={() => handlePermissionChange(u.id, 'can_manage_results', u.can_manage_results)} style={{ width: '16px', height: '16px', accentColor: '#047857', cursor: 'pointer' }} />
                    📋 النتيجة
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#064e3b' }}>
                    <input type="checkbox" checked={u.can_manage_admin || false} onChange={() => handlePermissionChange(u.id, 'can_manage_admin', u.can_manage_admin)} style={{ width: '16px', height: '16px', accentColor: '#047857', cursor: 'pointer' }} />
                    👑 الإدارة (أدمن)
                  </label>

                </div>

                <div>
                  {u.username !== 'admin' ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }} 
                      style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s' }}
                    >
                      🗑️ حذف الموظف
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', padding: '6px' }}>👑 الحساب الرئيسي</span>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
