import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AddUserForm from './AddUserForm';

export default function DashboardSection({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // دالة لجلب كل المستخدمين والصلاحيات من Supabase
  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase
        .from('users_list')
        .select('*');

      if (error) {
        throw error;
      }

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
        .from('users_list')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchUsers();
    } catch (err) {
      alert('حدث خطأ أثناء الحذف: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
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

      {/* رسالة الخطأ في حال وجود خطأ من Supabase */}
      {errorMessage && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #fee2e2', fontSize: '13px' }}>
          <strong>تنبيه:</strong> لم نتمكن من جلب البيانات ({errorMessage}). أرجو التأكد من اسم الجدول في Supabase.
        </div>
      )}

      {/* جدول عرض المستخدمين */}
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
                    لا يوجد مستخدمون لعرضهم حالياً. اضغطي على "إضافة موظف جديد" لإضافة أول مستخدم.
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
                        {u.can_manage_admin && <span style={{ ...badgeStyle, backgroundColor: '#fef3c7', color: '#b45309' }}>كل الصلاحيات</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        حذف 🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
