import React, { useState, useEffect } from 'react';
// استدعاء اتصال قاعدة بيانات سوبابيز الحية
import { supabase } from '../supabaseClient';

export default function DashboardSection({ onBack }) {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newLoginName, setNewLoginName] = useState(''); 
  const [newPin, setNewPin] = useState('');             
  const [newRole, setNewRole] = useState('معلم');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // دالة لجلب قائمة الموظفين والمستخدمين من قاعدة البيانات عند فتح الصفحة
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

  // دالة إضافة موظف جديد وحفظه في قاعدة البيانات الحقيقية مباشرة
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newLoginName.trim() || !newPin.trim()) {
      alert("الرجاء ملء كافة خانات البيانات (الاسم، اسم الدخول، وكلمة المرور)");
      return;
    }
    
    setLoading(true);

    try {
      // رفع وحفظ بيانات المستخدم والصلاحيات الافتراضية حسب الرتبة في جدول سوبابيز
      const { data, error } = await supabase
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
      
      // إعادة تصفير خانات الإدخال وتحديث القائمة مرئياً
      setNewName('');
      setNewLoginName('');
      setNewPin('');
      fetchUsers();

    } catch (error) {
      console.error("حدث خطأ في الاتصال بقاعدة البيانات:", error);
      alert("❌ فشل حفظ البيانات في السحابة: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  // دالة حذف مستخدم نهائياً من قاعدة بيانات سوبابيز
  const handleDeleteUser = async (userId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً من النظام؟")) {
      try {
        const { error } = await supabase
          .from('users_list')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        alert("تم حذف المستخدم بنجاح من قاعدة البيانات.");
        if (selectedUser?.id === userId) setSelectedUser(null);
        fetchUsers(); // تحديث القائمة فوراً
      } catch (error) {
        console.error("خطأ في الحذف:", error);
        alert("❌ فشل حذف المستخدم: " + error.message);
      }
    }
  };

  // دالة تحديث الصلاحيات التفصيلية بنقرة زر في قاعدة البيانات
  const handlePermissionChange = async (perm, columnName) => {
    if (!selectedUser) return;
    
    try {
      const newValue = !selectedUser[columnName];
      
      const { error } = await supabase
        .from('users_list')
        .update({ [columnName]: newValue })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // تحديث الحالة مرئياً في واجهة المستخدم
      const updatedUser = { ...selectedUser, [columnName]: newValue };
      setSelectedUser(updatedUser);
      fetchUsers();
    } catch (error) {
      console.error("خطأ في تحديث الصلاحية:", error);
      alert("❌ فشل تحديث الصلاحية: " + error.message);
    }
  };
  return (
    <div style={{ direction: 'rtl', padding: '20px', fontFamily: 'Arial', backgroundColor: '#ffffff' }}>
      
      {/* شريط العنوان وزر العودة بالأخضر والذهبي */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ color: '#115e59', margin: 0, fontWeight: 'bold' }}>⚙️ لوحة الإدارة العليا وإدارة صلاحيات المستخدمين</h2>
          <p style={{ color: '#475569', margin: '5px 0 0 0', fontSize: '14px' }}>إضافة، حذف، وتعيين كلمات مرور وصلاحيات جميع موظفي مدرسة الشروق عبر قاعدة البيانات الحية</p>
        </div>
        <button 
          onClick={onBack} 
          style={{ backgroundColor: '#d4af37', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
        >
          ↩️ عودة للرئيسية
        </button>
      </div>

      {/* نموذج الإضافة بالألوان الجديدة */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <h4 style={{ marginTop: 0, color: '#115e59', marginBottom: '15px', fontWeight: 'bold' }}>➕ إضافة موظف جديد وتعيين كلمة مرور مخصصة</h4>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" placeholder="اسم الموظف المألوف ثلاثي" value={newName} onChange={e => setNewName(e.target.value)} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: '2', textAlign: 'right' }} required 
          />
          <input 
            type="text" placeholder="اسم الدخول البرمجي (مثال: ali)" value={newLoginName} onChange={e => setNewLoginName(e.target.value)} 
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
          <button type="submit" disabled={loading} style={{ padding: '11px 24px', backgroundColor: '#115e59', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(17,94,89,0.2)' }}>
            {loading ? "جاري الحفظ..." : "إضافة مستخدم"}
          </button>
        </form>
      </div>

      {/* قسم عرض الموظفين وإدارة الصلاحيات التفصيلية */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* قائمة الموظفين */}
        <div style={{ flex: '1', minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ marginTop: 0, color: '#115e59', marginBottom: '15px', fontWeight: 'bold' }}>👥 الموظفون المسجلون بالنظام ({users.length})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.map(u => (
              <div 
                key={u.id} 
                onClick={() => setSelectedUser(u)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', border: selectedUser?.id === u.id ? '2px solid #d4af37' : '1px solid #e2e8f0', background: selectedUser?.id === u.id ? '#f0fdfa' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: '#334155' }}>{u.full_name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>اسم الدخول: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{u.username}</span> | الرتبة: <span style={{ color: '#14b8a6', fontWeight: 'bold' }}>{u.role}</span></div>
                </div>
                {u.username !== 'admin' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }} 
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                    title="حذف الموظف"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* لوحة التحكم بالصلاحيات التفصيلية للمستخدم المحدد */}
        <div style={{ flex: '1.2', minWidth: '320px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ marginTop: 0, color: '#115e59', marginBottom: '15px', fontWeight: 'bold' }}>🔐 تعديل صلاحيات الموظف المحدد</h4>
          
          {selectedUser ? (
            <div>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', borderRight: '4px solid #d4af37', marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', color: '#115e59', fontSize: '16px' }}>{selectedUser.full_name}</div>
                <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>رمز الدخول الحالي بالنظام: <strong style={{ color: '#d4af37' }}>{selectedUser.password_code}</strong></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* صلاحية الطلاب */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: '#fdfdfd', border: '1px solid #f1f5f9' }}>
                  <input type="checkbox" checked={selectedUser.can_manage_students || false} onChange={() => handlePermissionChange('students', 'can_manage_students')} style={{ width: '18px', height: '18px', accentColor: '#115e59' }} />
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#334155' }}>📚 صلاحية إدارة الطلاب</span>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>السماح برؤية، تعديل، وإضافة قوائم الطلاب الجدد</p>
                  </div>
                </label>

                {/* صلاحية الفصول */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: '#fdfdfd', border: '1px solid #f1f5f9' }}>
                  <input type="checkbox" checked={selectedUser.can_manage_classes || false} onChange={() => handlePermissionChange('classes', 'can_manage_classes')} style={{ width: '18px', height: '18px', accentColor: '#115e59' }} />
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#334155' }}>🏛️ صلاحية إدارة الفصول الدراسية</span>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>السماح بفتح وتوزيع الصفوف والمراحل التعليمية</p>
                  </div>
                </label>

                {/* صلاحية المعلمين */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: '#fdfdfd', border: '1px solid #f1f5f9' }}>
                  <input type="checkbox" checked={selectedUser.can_manage_teachers || false} onChange={() => handlePermissionChange('teachers', 'can_manage_teachers')} style={{ width: '18px', height: '18px', accentColor: '#115e59' }} />
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#334155' }}>👨‍🏫 صلاحية إدارة المعلمين</span>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>السماح بإسناد المواد وتعديل هواتف المدرسين</p>
                  </div>
                </label>

                {/* صلاحية الحسابات */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: '#fdfdfd', border: '1px solid #f1f5f9' }}>
                  <input type="checkbox" checked={selectedUser.can_manage_finance || false} onChange={() => handlePermissionChange('finance', 'can_manage_finance')} style={{ width: '18px', height: '18px', accentColor: '#115e59' }} />
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#334155' }}>💰 صلاحية إدارة الحسابات والمالية</span>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>السماح بتحديث الأقساط والموقف المالي للرسوم</p>
                  </div>
                </label>

                               {/* صلاحية الإدارة الكاملة (مصلحة) */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', borderRadius: '8px', backgroundColor: '#fdfdfd', border: '1px solid #f1f5f9' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedUser.can_manage_admin || false} 
                    onChange={() => handlePermissionChange('admin', 'can_manage_admin')} 
                    style={{ width: '18px', height: '18px', accentColor: '#115e59' }} 
                  />
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#334155' }}>👑 صلاحية الإدارة الكاملة (أدمن)</span>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>منح التحكم الشامل في لوحة تعديل الموظفين أنفسهم</p>
                  </div>
                </label>
