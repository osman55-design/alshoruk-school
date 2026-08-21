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
  const [currentLoginAdmin, setCurrentLoginAdmin] = useState('');

  const fetchUsers = async () => {
    try {
      const sessionUser = localStorage.getItem('supabase_current_user');
      if (sessionUser) {
        const parsed = JSON.parse(sessionUser);
        setCurrentLoginAdmin(parsed.username);
      }

      const { data, error } = await supabase
        .from('users_list')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        // إذا كان المستخدم الحالي ليس الـ admin الرئيسي، نقوم بإخفاء حساب الـ admin لحمايته
        if (currentLoginAdmin === 'admin') {
          setUsers(data);
        } else {
          const filtered = data.filter(u => u.username !== 'admin');
          setUsers(filtered);
        }
      }
    } catch (error) {
      console.error("خطأ في جلب المستخدمين:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentLoginAdmin]);

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
          can_manage_teachers: newRole === 'أدمن',
          can_manage_finance: newRole === 'محاسب' || newRole === 'أدمن',
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

  const handlePermissionChange = async (perm, columnName) => {
    if (!selectedUser) return;
    
    try {
      const newValue = !selectedUser[columnName];
      
      const { error } = await supabase
        .from('users_list')
        .update({ [columnName]: newValue })
        .eq('id', selectedUser.id);

      if (error) throw error;

      const updatedUser = { ...selectedUser, [columnName]: newValue };
      setSelectedUser(updatedUser);
      fetchUsers();
    } catch (error) {
      console.error("خطأ في تحديث الصلاحية:", error);
      alert("❌ فشل التحديث: " + error.message);
    }
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', fontFamily: 'Arial', backgroundColor: '#ffffff' }}>
      
      {/* شريط العنوان وزر العودة المصلح ليعود للوحة التحكم الداخلية */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ color: '#115e59', margin: 0, fontWeight: 'bold' }}>⚙️ لوحة الإدارة العليا وإدارة صلاحيات المستخدمين</h2>
          <p style={{ color: '#475569', margin: '5px 0 0 0', fontSize: '14px' }}>تعديل صلاحيات بوابات موظفي مدرسة الشروق عبر قاعدة البيانات الحية</p>
        </div>
        <button 
          onClick={onBack} 
          style={{ backgroundColor: '#d4af37', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
        >
          ↩️ عودة للوحة التحكم
        </button>
      </div>

      {/* نموذج الإضافة يظهر فقط للأدمن لحماية لوحة التحكم */}
      {currentLoginAdmin === 'admin' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <h4 style={{ marginTop: 0, color: '#115e59', marginBottom: '15px', fontWeight: 'bold' }}>➕ إضافة موظف جديد وتعيين كلمة مرور مخصصة</h4>
          <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input 
              type="text" placeholder="اسم الموظف المألوف ثلاثي" value={newName} onChange={e => setNewName(e.target.value)} 
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: '2', textAlign: 'right' }} required 
            />
            <input 
              type="text" placeholder="اسم الدخول البرمجي" value={newLoginName} onChange={e => setNewLoginName(e.target.value)} 
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: '1', textAlign: 'right' }} required 
            />
            <input 
              type="text" placeholder="تعيين كلمة مرور مخصصة" value={newPin} onChange={e => setNewPin(e.target.value)} 
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: '1', textAlign: 'right' }} required 
            />
            <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '120px', fontWeight: 'bold', color: '#115e59' }}>
              <option value="معلم">معلم</option>
              <option value="محاسب">محاسب</option>
              <option value="إداري">إداري</option>
              <option value="أدمن">أدمن</option>
            </select>
            <button type="submit" disabled={loading} style={{ padding: '11px 24px', backgroundColor: '#115e59', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? "جاري الحفظ..." : "إضافة مستخدم"}
            </button>
          </form>
        </div>
      )}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* لوحة عرض المستخدمين وقوائم صلاحيات الأقسام المباشرة أمام كل اسم */}
        <div style={{ flex: '1', minWidth: '100%', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <h4 style={{ marginTop: 0, color: '#115e59', marginBottom: '20px', fontWeight: 'bold' }}>👥 قائمة الموظفين وإدارة الصلاحيات المباشرة للأقسام ({users.length})</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {users.map(u => (
              <div 
                key={u.id} 
                onClick={() => setSelectedUser(u)}
                style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '10px', border: selectedUser?.id === u.id ? '2px solid #d4af37' : '1px solid #e2e8f0', background: selectedUser?.id === u.id ? '#f0fdfa' : '#fff', transition: 'all 0.2s', gap: '15px' }}
              >
                {/* معلومات الموظف وكلمة مروره */}
                <div style={{ minWidth: '220px' }}>
                  <div style={{ fontWeight: 'bold', color: '#115e59', fontSize: '16px' }}>{u.full_name}</div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                    اسم الدخول: <strong style={{ color: '#14b8a6' }}>{u.username}</strong> | 
                    رقم الدخول: <strong style={{ color: '#d4af37' }}>{u.password_code}</strong> | 
                    الرتبة: <span style={{ fontWeight: 'bold' }}>{u.role}</span>
                  </div>
                </div>

                {/* لوحة قوائم الاختيار (Checkboxes) المباشرة أمام الاسم لجميع الأقسام الستة */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', background: 'rgba(241,245,249,0.5)', padding: '8px 15px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  
                  {/* قائمة صلاحية الطلاب */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                    <input type="checkbox" checked={u.can_manage_students || false} onChange={() => { setSelectedUser(u); handlePermissionChange('students', 'can_manage_students'); }} style={{ width: '16px', height: '16px', accentColor: '#115e59', cursor: 'pointer' }} />
                    📚 الطلاب
                  </label>

                  {/* قائمة صلاحية الفصول */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                    <input type="checkbox" checked={u.can_manage_classes || false} onChange={() => { setSelectedUser(u); handlePermissionChange('classes', 'can_manage_classes'); }} style={{ width: '16px', height: '16px', accentColor: '#115e59', cursor: 'pointer' }} />
                    🏛️ الفصول
                  </label>

                  {/* قائمة صلاحية المعلمين */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                    <input type="checkbox" checked={u.can_manage_teachers || false} onChange={() => { setSelectedUser(u); handlePermissionChange('teachers', 'can_manage_teachers'); }} style={{ width: '16px', height: '16px', accentColor: '#115e59', cursor: 'pointer' }} />
                    👨‍🏫 المعلمين
                  </label>

                  {/* قائمة صلاحية الحسابات */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                    <input type="checkbox" checked={u.can_manage_finance || false} onChange={() => { setSelectedUser(u); handlePermissionChange('finance', 'can_manage_finance'); }} style={{ width: '16px', height: '16px', accentColor: '#115e59', cursor: 'pointer' }} />
                    💰 الحسابات
                  </label>

                  {/* قائمة صلاحية النتيجة */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                    <input type="checkbox" checked={u.can_manage_admin || false} onChange={() => { setSelectedUser(u); handlePermissionChange('admin', 'can_manage_admin'); }} style={{ width: '16px', height: '16px', accentColor: '#115e59', cursor: 'pointer' }} />
                    📄 النتيجة
                  </label>

                  {/* قائمة صلاحية الإدارة الكاملة */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                    <input type="checkbox" checked={u.can_manage_admin || false} onChange={() => { setSelectedUser(u); handlePermissionChange('admin', 'can_manage_admin'); }} style={{ width: '16px', height: '16px', accentColor: '#115e59', cursor: 'pointer' }} />
                    👑 الإدارة (أدمن)
                  </label>

                </div>

                {/* زر حذف المستخدم المتاح فقط للأدمن الفعلي وللحسابات الأخرى غير حساب admin نفسه */}
                <div>
                  {u.username !== 'admin' && currentLoginAdmin === 'admin' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }} 
                      style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s' }}
                      title="حذف الموظف نهائياً"
                    >
                      🗑️ حذف الموظف
                    </button>
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
