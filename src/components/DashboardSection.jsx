import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AddUserForm from './AddUserForm';

export default function DashboardSection({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // حالة الموظف المراد تعديل صلاحياته
  const [editingUser, setEditingUser] = useState(null);

  // دالة لجلب كل المستخدمين والصلاحيات من جدول users
  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

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

  // دالة لحذف مستخدم
  const handleDeleteUser = async (id) => {
    if (!window.confirm('هل أنتِ متأكدة من حذف هذا المستخدم؟')) return;
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchUsers();
    } catch (err) {
      alert('حدث خطأ أثناء الحذف: ' + err.message);
    }
  };

  // دالة حفظ التعديلات على الصلاحيات
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
    <div style={{ padding: '10px', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>⚙️ إدارة المستخدمين والصلاحيات</h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>عرض وتحكم بجميع حسابات الموظفين والصلاحيات</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: '#047857', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          ➕ إضافة موظف جديد
        </button>
      </div>

      {errorMessage && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #fee2e2', fontSize: '13px' }}>
          <strong>تنبيه:</strong> لم نتمكن من جلب البيانات ({errorMessage}).
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>جاري تحميل قائمة المستخدمين...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>الاسم</th>
                <th style={{ padding: '12px' }}>اسم المستخدم</th>
                <th style={{ padding: '12px' }}>الرتبة</th>
                <th style={{ padding: '12px' }}>الصلاحيات المتاحة</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                    لا يوجد مستخدمون لعرضهم حالياً.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.full_name || u.name || '---'}</td>
                    <td style={{ padding: '12px' }}>{u.username || '---'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: u.role === 'مدير' || u.role === 'admin' ? '#dcfce7' : '#e0f2fe', color: u.role === 'مدير' || u.role === 'admin' ? '#15803d' : '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                        {u.role || 'إداري'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {u.can_manage_students && <span style={badgeStyle}>الطلاب</span>}
                        {u.can_manage_classes && <span style={badgeStyle}>الفصول</span>}
                        {u.can_manage_teachers && <span style={badgeStyle}>المعلمين</span>}
                        {u.can_manage_finance && <span style={badgeStyle}>المالية</span>}
                        {u.can_manage_results && <span style={badgeStyle}>النتائج</span>}
                        {u.can_manage_transport && <span style={badgeStyle}>التراحيل</span>}
                        {u.can_manage_supervisors && <span style={badgeStyle}>المشرفات</span>}
                        {u.can_manage_landing && <span style={badgeStyle}>الرئيسية</span>}
                        {u.can_manage_admin && <span style={{ ...badgeStyle, backgroundColor: '#fef3c7', color: '#b45309' }}>كل الصلاحيات</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => setEditingUser({ ...u })}
                          style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          تعديل ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          حذف 🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* نافذة التعديل على صلاحيات المستخدم */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setEditingUser(null)}
              style={{ position: 'absolute', top: '15px', left: '15px', border: 'none', background: '#f1f5f9', color: '#64748b', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✖
            </button>
            
            <h3 style={{ color: '#0284c7', marginTop: 0 }}>✏️ تعديل صلاحيات الموظف: {editingUser.full_name || editingUser.username}</h3>

            <form onSubmit={handleSavePermissions} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>الرتبة:</label>
                <select 
                  value={editingUser.role || 'معلم'} 
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="معلم">👨‍🏫 معلم</option>
                  <option value="محاسب">💰 محاسب</option>
                  <option value="مشرف">👩‍💼 مشرف</option>
                  <option value="إداري">🏫 إداري</option>
                  <option value="مدير">👑 مدير / أدمن</option>
                </select>
              </div>

              <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>🔑 تعديل الوصول للأقسام:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                  <label><input type="checkbox" checked={editingUser.can_manage_students || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_students: e.target.checked })} /> 📚 الطلاب</label>
                  <label><input type="checkbox" checked={editingUser.can_manage_classes || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_classes: e.target.checked })} /> 🏛️ الفصول</label>
                  <label><input type="checkbox" checked={editingUser.can_manage_teachers || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_teachers: e.target.checked })} /> 👨‍🏫 المعلمين</label>
                  <label><input type="checkbox" checked={editingUser.can_manage_finance || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_finance: e.target.checked })} /> 💰 الحسابات</label>
                  <label><input type="checkbox" checked={editingUser.can_manage_results || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_results: e.target.checked })} /> 📋 النتيجة</label>
                  <label><input type="checkbox" checked={editingUser.can_manage_transport || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_transport: e.target.checked })} /> 🚌 التراحيل</label>
                  <label><input type="checkbox" checked={editingUser.can_manage_supervisors || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_supervisors: e.target.checked })} /> 👩‍💼 المشرفات</label>
                  <label><input type="checkbox" checked={editingUser.can_manage_landing || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_landing: e.target.checked })} /> 🏠 الصفحة الرئيسية</label>
                  <label><input type="checkbox" checked={editingUser.can_manage_admin || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_admin: e.target.checked })} /> 👑 الإدارة</label>
                </div>
              </div>

              <button 
                type="submit"
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                💾 حفظ التعديلات الجديدة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* نافذة إضافة موظف جديد */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
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
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 'bold'
};
