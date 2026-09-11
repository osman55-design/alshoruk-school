import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AddUserForm from './AddUserForm';

export default function DashboardSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('خطأ في جلب المستخدمين:', err.message);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('هل أنتِ متأكدة من حذف هذا المستخدم؟')) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      alert('حدث خطأ أثناء الحذف: ' + err.message);
    }
  };

  const handleSavePermissions = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('users')
        .update({
          can_manage_students: editingUser.can_manage_students,
          can_manage_classes: editingUser.can_manage_classes,
          can_manage_teachers: editingUser.can_manage_teachers,
          can_manage_finance: editingUser.can_manage_finance,
          can_manage_results: editingUser.can_manage_results,
          can_manage_transport: editingUser.can_manage_transport,
          can_manage_supervisors: editingUser.can_manage_supervisors,
          can_manage_landing: editingUser.can_manage_landing,
          can_manage_bridge: editingUser.can_manage_bridge,
          can_manage_admin: editingUser.can_manage_admin,
          role: editingUser.role
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      alert('تم تحديث الصلاحيات بنجاح! 🎉');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert('حدث خطأ أثناء حفظ التعديلات: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '16px', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif", maxWidth: '1200px', margin: '0 auto' }}>
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', flexDirection: window.innerWidth < 600 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 600 ? 'stretch' : 'center', gap: '12px', marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '22px' }}>⚙️ إدارة المستخدمين والصلاحيات</h2>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>تحكم بحسابات الموظفين وصلاحيات الأقسام بكل سهولة</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: '#047857', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(4, 120, 87, 0.2)', transition: 'all 0.2s' }}
        >
          ➕ إضافة موظف جديد
        </button>
      </div>

      {errorMessage && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '14px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #fee2e2', fontSize: '14px' }}>
          <strong>تنبيه:</strong> لم نتمكن من جلب البيانات ({errorMessage}).
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px', fontSize: '16px' }}>جاري تحميل قائمة المستخدمين...</p>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', color: '#94a3b8' }}>
          لا يوجد مستخدمون لعرضهم حالياً.
        </div>
      ) : (
        /* عرض المربعات الكبيرة (Grid Cards) المتجاوبة مع الجوال والشاشات الكبيرة */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {users.map((u) => (
            <div key={u.id} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              
              {/* معلومات المستخدم الأساسية */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>{u.full_name || u.name || '---'}</h3>
                  <span style={{ backgroundColor: u.role === 'مدير' || u.role === 'admin' ? '#dcfce7' : '#e0f2fe', color: u.role === 'مدير' || u.role === 'admin' ? '#15803d' : '#0369a1', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                    {u.role || 'إداري'}
                  </span>
                </div>
                <p style={{ margin: '0 0 14px 0', color: '#64748b', fontSize: '13px' }}>اسم المستخدم: <strong style={{ color: '#334155' }}>{u.username || '---'}</strong></p>
                
                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />

                {/* شارات الصلاحيات */}
                <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>الصلاحيات المفعلة:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '40px' }}>
                  {u.can_manage_students && <span style={badgeStyle}>الطلاب</span>}
                  {u.can_manage_classes && <span style={badgeStyle}>الفصول</span>}
                  {u.can_manage_teachers && <span style={badgeStyle}>المعلمين</span>}
                  {u.can_manage_finance && <span style={badgeStyle}>المالية</span>}
                  {u.can_manage_results && <span style={badgeStyle}>النتائج</span>}
                  {u.can_manage_transport && <span style={badgeStyle}>التراحيل</span>}
                  {u.can_manage_supervisors && <span style={badgeStyle}>المشرفات</span>}
                  {u.can_manage_landing && <span style={badgeStyle}>الصفحة الرئيسية</span>}
                  {u.can_manage_bridge && <span style={{ ...badgeStyle, backgroundColor: '#e0e7ff', color: '#3730a3' }}>🌉 الجسر</span>}
                  {u.can_manage_admin && <span style={{ ...badgeStyle, backgroundColor: '#fef3c7', color: '#b45309' }}>👑 الإدارة</span>}
                  {!u.can_manage_students && !u.can_manage_classes && !u.can_manage_teachers && !u.can_manage_finance && !u.can_manage_results && !u.can_manage_transport && !u.can_manage_supervisors && !u.can_manage_landing && !u.can_manage_bridge && !u.can_manage_admin && (
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>لا توجد صلاحيات مخصصة</span>
                  )}
                </div>
              </div>

              {/* أزرار التحكم */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <button 
                  onClick={() => setEditingUser({ ...u })}
                  style={{ flex: 1, backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s' }}
                >
                  تعديل الصلاحيات ✏️
                </button>
                <button 
                  onClick={() => handleDeleteUser(u.id)}
                  style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s' }}
                >
                  حذف 🗑️
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* نافذة التعديل على صلاحيات المستخدم (Modal) */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <button 
              onClick={() => setEditingUser(null)}
              style={{ position: 'absolute', top: '16px', left: '16px', border: 'none', background: '#f1f5f9', color: '#64748b', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
            >
              ✕
            </button>
            
            <h3 style={{ color: '#0f172a', marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>✏️ تعديل صلاحيات: {editingUser.full_name || editingUser.username}</h3>

            <form onSubmit={handleSavePermissions} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>الرتبة الوظيفية:</label>
                <select 
                  value={editingUser.role || 'معلم'} 
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#fff' }}
                >
                  <option value="معلم">👨‍🏫 معلم</option>
                  <option value="محاسب">💰 محاسب</option>
                  <option value="مشرف">👩‍💼 مشرف</option>
                  <option value="إداري">🏫 إداري</option>
                  <option value="مدير">👑 مدير / أدمن</option>
                </select>
              </div>

              <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b' }}>🔑 تحديد الوصول للأقسام والصلاحيات:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_students || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_students: e.target.checked })} /> 📚 الطلاب</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_classes || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_classes: e.target.checked })} /> 🏛️ الفصول</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_teachers || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_teachers: e.target.checked })} /> 👨‍🏫 المعلمين</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_finance || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_finance: e.target.checked })} /> 💰 الحسابات</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_results || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_results: e.target.checked })} /> 📋 النتيجة</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_transport || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_transport: e.target.checked })} /> 🚌 التراحيل</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_supervisors || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_supervisors: e.target.checked })} /> 👩‍💼 المشرفات</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_landing || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_landing: e.target.checked })} /> 🌐 الصفحة الرئيسية</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_bridge || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_bridge: e.target.checked })} /> 🌉 الجسر</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_admin || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_admin: e.target.checked })} /> 👑 الإدارة</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  style={{ flex: 2, backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}
                >
                  💾 حفظ التعديلات الجديدة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة إضافة موظف جديد */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <AddUserForm 
              onClose={() => setShowAddModal(false)} 
              onUserAdded={() => {
                setShowAddModal(false);
                fetchUsers();
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

const badgeStyle = {
  backgroundColor: '#f1f5f9',
  color: '#475569',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '700'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  background: '#fff',
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0'
};
