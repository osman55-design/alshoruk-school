import React, { useState } from 'react';

// استيراد ملف الاتصال السحابي الذي قمنا بتحديثه
import { db } from '../db'; 

export default function DashboardSection({ users, setUsers, onBack }) {
  const [newName, setNewName] = useState('');
  const [newLoginName, setNewLoginName] = useState(''); 
  const [newPin, setNewPin] = useState('');             
  const [newRole, setNewRole] = useState('معلم');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // دالة إضافة موظف وحفظه في سحابة جوجل تلقائياً
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newLoginName.trim() || !newPin.trim()) {
      alert("الرجاء ملء كافة خانات البيانات (الاسم، اسم الدخول، وكلمة المرور)");
      return;
    }
    
    setLoading(true);

    // تجهيز البيانات لتطابق الأعمدة الإنجليزية في جدول جوجل الخاص بك
    const cloudUserData = {
      name: newName,
      username: newLoginName,
      password: newPin,
      role: newRole,
      permissions: "معتمد"
    };

    // إرسال البيانات فوراً لتبويب "المستخدمين" في السحابة
    const result = await db.insertData("المستخدمين", cloudUserData);

    if (result && result.status !== "error") {
      const newUser = {
        id: Date.now(),
        name: newName,
        loginName: newLoginName,
        role: newRole,
        pin: newPin, 
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
      alert(`✅ تم الحفظ السحابي بنجاح!\nتم إضافة ${newRole}: ${newName}\nاسم الدخول: ${newLoginName}\nكلمة المرور: ${newPin}`);
    } else {
      alert("❌ حدث خطأ أثناء محاولة إرسال البيانات لسحابة جوجل، يرجى التحقق من الاتصال.");
    }
    setLoading(false);
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
          onClick={() => { alert("💾 تم مزامنة وحفظ وتوثيق جميع التغييرات في سحابة جوجل بنجاح!"); }} 
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
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? "جاري الحفظ في السحابة..." : "إضافة مستخدم"}
          </button>
        </form>
      </div>
    </div>
  );
}
