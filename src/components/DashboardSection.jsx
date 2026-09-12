import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AddUserForm from './AddUserForm';

export default function DashboardSection() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' للبطاقات أو 'logs' لسجل النشاطات والتعديلات
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // جلب المستخدمين وسجل النشاطات من قاعدة البيانات
  const fetchData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // 1. جلب بيانات المستخدمين
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: false });
      
      if (userError) throw userError;
      setUsers(userData || []);

      // 2. جلب سجل النشاطات والتعديلات والحذف والإضافات
      const { data: actData, error: actError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (actError) {
        console.warn('جدول سجل النشاطات غير موجود أو فارغ بعد:', actError.message);
      } else {
        setActivities(actData || []);
      }

    } catch (err) {
      console.error('خطأ في جلب البيانات:', err.message);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // دالة الحذف مع توثيق الحدث في سجل النشاطات
  const handleDeleteUser = async (u) => {
    if (!window.confirm(`هل أنتِ متأكدة من حذف المستخدم "${u.full_name || u.username}"؟`)) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', u.id);
      if (error) throw error;

      // توثيق عملية الحذف في سجل النشاطات
      await supabase.from('activity_logs').insert([
        {
          username: 'الإدارة',
          action: 'حذف مستخدم',
          details: `تم حذف المستخدم: ${u.full_name || u.username}`,
          created_at: new Date().toISOString()
        }
      ]);

      alert('تم حذف المستخدم وتوثيق العملية بنجاح! 🗑️');
      fetchData();
    } catch (err) {
      alert('حدث خطأ أثناء الحذف: ' + err.message);
    }
  };

  // دالة حفظ التعديلات على الصلاحيات مع توثيق الحدث
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

      // توثيق عملية التعديل في سجل النشاطات
      await supabase.from('activity_logs').insert([
        {
          username: 'الإدارة',
          action: 'تعديل صلاحيات',
          details: `تم تحديث صلاحيات ورتبة المستخدم: ${editingUser.full_name || editingUser.username}`,
          created_at: new Date().toISOString()
        }
      ]);

      alert('تم تحديث الصلاحيات وتوثيق التعديل بنجاح! 🎉');
      setEditingUser(null);
      fetchData();
    } catch (err) {
      alert('حدث خطأ أثناء حفظ التعديلات: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '24px 16px', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif", maxWidth: '1200px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* رأس الصفحة العصري (Header) */}
      <div style={{ display: 'flex', flexDirection: window.innerWidth < 600 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 600 ? 'stretch' : 'center', gap: '16px', marginBottom: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)', color: '#fff' }}>
        <div>
          <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', marginBottom: '6px' }}>
            ✨ لوحة التحكم والأمان المتقدمة
          </span>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>إدارة المستخدمين وحالات الاتصال</h2>
          <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>متابعة حالة الاتصال، آخر ظهور، وتتبع كافة التعديلات، الإضافات، والحذف بدقة</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        >
          ✨ إضافة موظف جديد
        </button>
      </div>

      {errorMessage && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '14px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #fee2e2', fontSize: '14px' }}>
          <strong>تنبيه:</strong> لم نتمكن من جلب البيانات ({errorMessage}).
        </div>
      )}

      {/* 🗂️ أزرار التبديل بين بطاقات المستخدمين وسجل التعديلات */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ padding: '12px 24px', backgroundColor: activeTab === 'users' ? '#0f172a' : '#fff', color: activeTab === 'users' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
        >
          👥 بطاقات المستخدمين ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('logs')} 
          style={{ padding: '12px 24px', backgroundColor: activeTab === 'logs' ? '#0f172a' : '#fff', color: activeTab === 'logs' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
        >
          📊 سجل التعديلات، الإضافات والحذف ({activities.length})
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px', fontSize: '16px' }}>جاري تحميل البيانات...</p>
      ) : activeTab === 'users' ? (
        /* التبويب الأول: بطاقات المستخدمين مع حالة الاتصال وآخر ظهور */
        users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', color: '#94a3b8' }}>
            لا يوجد مستخدمون لعرضهم حالياً.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {users.map((u) => (
              <div key={u.id} style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span style={{ backgroundColor: u.role === 'مدير' || u.role === 'admin' ? '#dcfce7' : '#e0f2fe', color: u.role === 'مدير' || u.role === 'admin' ? '#15803d' : '#0369a1', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '6px' }}>
                        {u.role || 'إداري'}
                      </span>
                      <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '800' }}>{u.full_name || u.name || '---'}</h3>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>اسم المستخدم: <strong style={{ color: '#334155' }}>{u.username || '---'}</strong></p>
                    </div>

                    {/* 🟢 حالة الاتصال وآخر ظهور */}
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ backgroundColor: u.is_active ? '#10b981' : '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-block', marginBottom: '4px' }}>
                        {u.is_active ? '🟢 متصل الآن' : '🔴 غير متصل'}
                      </span>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                        آخر ظهور: {u.last_login ? new Date(u.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'غير متوفر'}
                      </div>
                    </div>
                  </div>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />

                  <div style={{ fontSize: '13px', color: '#475569', fontWeight: '700', marginBottom: '8px' }}>الصلاحيات المفعلة:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '35px' }}>
                    {u.can_manage_students && <span style={badgeStyle}>الطلاب</span>}
                    {u.can_manage_classes && <span style={badgeStyle}>الفصول</span>}
                    {u.can_manage_teachers && <span style={badgeStyle}>المعلمين</span>}
                    {u.can_manage_finance && <span style={badgeStyle}>المالية</span>}
                    {u.can_manage_results && <span style={badgeStyle}>النتائج</span>}
                    {u.can_manage_transport && <span style={badgeStyle}>التراحيل</span>}
                    {u.can_manage_supervisors && <span style={badgeStyle}>المشرفات</span>}
                    {u.can_manage_landing && <span style={badgeStyle}>الرئيسية</span>}
                    {u.can_manage_bridge && <span style={{ ...badgeStyle, backgroundColor: '#e0e7ff', color: '#3730a3' }}>🌉 الجسر</span>}
                    {u.can_manage_admin && <span style={{ ...badgeStyle, backgroundColor: '#fef3c7', color: '#b45309' }}>👑 الإدارة</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <button 
                    onClick={() => setEditingUser({ ...u })}
                    style={{ flex: 1, backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    تعديل الصلاحيات ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(u)}
                    style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    حذف 🗑️
                  </button>
                </div>

              </div>
            ))}
          </div>
        )
      ) : (
        /* التبويب الثاني: جدول سجل التعديلات، الإضافات والحذف */
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '18px', fontWeight: '800' }}>
            📊 جدول النشاطات الحية في النظام (إضافة، تعديل، حذف)
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '13px' }}>
            يعرض هذا الجدول كافة التعديلات والعمليات التي قام بها المستخدمون مع تفاصيل التوقيت بدقة
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '13px' }}>
                  <th style={{ padding: '14px', borderRadius: '0 10px 10px 0' }}>#</th>
                  <th style={{ padding: '14px' }}>اسم المستخدم</th>
                  <th style={{ padding: '14px' }}>نوع الإجراء</th>
                  <th style={{ padding: '14px' }}>التفاصيل الوصفية للعملية</th>
                  <th style={{ padding: '14px', borderRadius: '10px 0 0 10px' }}>وقت وتاريخ التنفيذ</th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((act, index) => (
                    <tr key={act.id || index} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                      <td style={{ padding: '14px' }}>{index + 1}</td>
                      <td style={{ padding: '14px', fontWeight: '700', color: '#0f172a' }}>{act.username}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '11px' }}>
                          {act.action}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#475569' }}>{act.details}</td>
                      <td style={{ padding: '14px', color: '#64748b', fontSize: '12px' }}>
                        {new Date(act.created_at).toLocaleString('ar-EG')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      لا توجد سجلات تعديل أو نشاط مسجلة حتى الآن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة التعديل على الصلاحيات (Modal) */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            
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
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_landing || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_landing: e.target.checked })} /> 🌐 الرئيسية</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_bridge || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_bridge: e.target.checked })} /> 🌉 الجسر</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={editingUser.can_manage_admin || false} onChange={(e) => setEditingUser({ ...editingUser, can_manage_admin: e.target.checked })} /> 👑 الإدارة</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  style={{ flex: 2, backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}
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
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <AddUserForm 
              onClose={() => setShowAddModal(false)} 
              onUserAdded={() => {
                setShowAddModal(false);
                fetchData();
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
  fontWeight: '700',
  border: '1px solid #e2e8f0'
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
