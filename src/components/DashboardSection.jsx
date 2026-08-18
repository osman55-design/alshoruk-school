import React, { useState } from 'react';

export default function DashboardSection({ users, setUsers, onBack }) {
  const [newName, setNewName] = useState('');
  const [newLoginName, setNewLoginName] = useState(''); // خانة اسم الدخول المضافة
  const [newPin, setNewPin] = useState('');             // خانة كلمة المرور المضافة
  const [newRole, setNewRole] = useState('معلم');
  const [selectedUser, setSelectedUser] = useState(null);

  // دالة إضافة موظف مع تعيين كلمة المرور الخاصة به
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newLoginName.trim() || !newPin.trim()) {
      alert("الرجاء ملء كافة خانات البيانات (الاسم، اسم الدخول، وكلمة المرور)");
      return;
    }
    
    const newUser = {
      id: Date.now(),
      name: newName,
      loginName: newLoginName,
      role: newRole,
      pin: newPin, // حفظ كلمة المرور المخصصة
      permissions: { 
        students: newRole === 'إداري', 
        classes: newRole === 'إداري', 
        teachers: false, 
        finance: newRole === 'محاسب', 
        admin: false 
      }
    };
    
    setUsers([...users, newUser]);
    setNewName('');
    setNewLoginName('');
    setNewPin('');
    alert(`تم إضافة ${newRole}: ${newName} بنجاح!\nاسم الدخول: ${newLoginName}\nكلمة المرور: ${newPin}\nيمكنك الآن تعديل صلاحياته بالأسفل.`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً من النظام؟")) {
      const updated = users.filter(u => u.id !== userId);
      setUsers(updated);
      if (selectedUser?.id === userId) setSelectedUser(null);
      alert("تم حذف المستخدم بنجاح.");
    }
  };

  const handlePermissionChange = (perm) => {
    if (!selectedUser) return;
    const updatedUsers = users.map(u => {
      if (u.id === selectedUser.id) {
        const updated = { ...u, permissions: { ...u.permissions, [perm]: !u.permissions[perm] } };
        setSelectedUser(updated);
        return updated;
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', fontFamily: 'Arial' }}>
      
      {/* شريط العنوان وزر الحفظ والخروج التوثيقي المتميز */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e5e7eb', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ color: '#7c3aed', margin: 0 }}>⚙️ لوحة الإدارة العليا وإدارة صلاحيات المستخدمين</h2>
          <p style={{ color: '#555', margin: '5px 0 0 0', fontSize: '14px' }}>إضافة، حذف، وتعيين كلمات مرور وصلاحيات جميع موظفي مدرسة الشروق</p>
        </div>
        <button 
          onClick={() => { alert("💾 تم حفظ وتوثيق جميع التغييرات وصلاحيات وكلمات مرور المستخدمين بنجاح!"); }} 
          style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          💾 حفظ وإغلاق السجل
        </button>
      </div>

      {/* نموذج الإضافة المطور المتضمن لتعيين كلمات المرور */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h4 style={{ marginTop: 0, color: '#1f2937', marginBottom: '15px' }}>➕ إضافة موظف جديد وتعيين كلمة مرور مخصصة</h4>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" placeholder="اسم الموظف المألوف ثلاثي" value={newName} onChange={e => setNewName(e.target.value)} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', flex: '2', textAlign: 'right' }} required 
          />
          <input 
            type="text" placeholder="اسم الدخول البرمجي (مثال: ali)" value={newLoginName} onChange={e => setNewLoginName(e.target.value)} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', flex: '1', textAlign: 'right' }} required 
          />
          <input 
            type="password" placeholder="تعيين كلمة مرور مخصصة" value={newPin} onChange={e => setNewPin(e.target.value)} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', flex: '1', textAlign: 'right' }} required 
          />
          <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', width: '120px' }}>
            <option value="معلم">معلم</option>
            <option value="محاسب">محاسب</option>
            <option value="إداري">إداري</option>
          </select>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إضافة مستخدم</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {/* قائمة الموظفين الحاليين */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0, color: '#1f2937', borderBottom: '2px solid #f3f4f6', paddingBottom: '10px' }}>👥 الموظفون المسجلون حالياً</h3>
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {users.map(u => (
              <div 
                key={u.id} 
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', margin: '8px 0',
                  cursor: 'pointer', backgroundColor: selectedUser?.id === u.id ? '#f3e8ff' : '#fff',
                  borderColor: selectedUser?.id === u.id ? '#7c3aed' : '#e5e5e5'
                }} 
                onClick={() => setSelectedUser(u)}
              >
                <div>
                  <strong>{u.name}</strong> <span style={{ fontSize: '12px', color: '#6b7280' }}>({u.role})</span>
                </div>
                {u.id !== 1 && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* لوحة تعديل الصلاحيات الفورية وعرض كلمة المرور الحالية للأدمن */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0, color: '#1f2937', borderBottom: '2px solid #f3f4f6', paddingBottom: '10px' }}>🔐 لوحة الصلاحيات والبيانات السرية</h3>
          {selectedUser ? (
            <div style={{ lineHeight: '2.2' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#7c3aed' }}>المستخدم النشط: {selectedUser.name}</h4>
              <p style={{ margin: '0 0 15px 0', color: '#d97706', fontWeight: 'bold', fontSize: '14px' }}>🔑 اسم الدخول الحالي: ({selectedUser.loginName}) | كلمة المرور: ({selectedUser.pin})</p>
              
              <label style={{ display: 'block', cursor: 'pointer', fontWeight: 'bold' }}>
                <input type="checkbox" checked={selectedUser.permissions.students} onChange={() => handlePermissionChange('students')} style={{ marginLeft: '10px' }} /> 🔓 دخول قسم الطلاب
              </label>
              <label style={{ display: 'block', cursor: 'pointer', fontWeight: 'bold' }}>
                <input type="checkbox" checked={selectedUser.permissions.classes} onChange={() => handlePermissionChange('classes')} style={{ marginLeft: '10px' }} /> 🔓 دخول قسم الفصول
              </label>
              <label style={{ display: 'block', cursor: 'pointer', fontWeight: 'bold' }}>
                <input type="checkbox" checked={selectedUser.permissions.teachers} onChange={() => handlePermissionChange('teachers')} style={{ marginLeft: '10px' }} /> 🔓 دخول قسم المعلمين
              </label>
              <label style={{ display: 'block', cursor: 'pointer', fontWeight: 'bold' }}>
                <input type="checkbox" checked={selectedUser.permissions.finance} onChange={() => handlePermissionChange('finance')} style={{ marginLeft: '10px' }} /> 🔓 دخول الأقسام المالية والحسابات
              </label>
              <label style={{ display: 'block', cursor: 'pointer', fontWeight: 'bold' }}>
                <input type="checkbox" checked={selectedUser.permissions.admin} onChange={() => handlePermissionChange('admin')} style={{ marginLeft: '10px' }} /> 🔓 صلاحية الأدمن والإدارة العليا
              </label>
            </div>
          ) : (
            <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', paddingTop: '40px' }}>الرجاء تحديد موظف من القائمة لعرض وتعديل صلاحياته الحية.</p>
          )}
        </div>
      </div>
    </div>
  );
}
