import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminSystem({ onBack }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' أو 'content'
  const [loading, setLoading] = useState(false);

  // --- بيانات المستخدمين والصلاحيات ---
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [passwordCode, setPasswordCode] = useState('');
  const [role, setRole] = useState('معلم');

  // --- بيانات محتوى الصفحة الرئيسية ---
  const [aboutUs, setAboutUs] = useState('');
  const [ourGoals, setOurGoals] = useState('');
  const [latestNews, setLatestNews] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchSiteContent();
  }, []);

  // جلب المستخدمين
  const fetchUsers = async () => {
    const { data } = await supabase.from('users_list').select('*').order('id', { ascending: true });
    if (data) setUsers(data);
  };

  // جلب محتوى الموقع
  const fetchSiteContent = async () => {
    const { data } = await supabase.from('site_content').select('*').single();
    if (data) {
      setAboutUs(data.about_us || '');
      setOurGoals(data.our_goals || '');
      setLatestNews(data.latest_news || '');
    }
  };

  // إضافة مستخدم جديد
  const handleAddUser = async (e) => {
    e.preventDefault();
    const newUser = { full_name: fullName, username, password_code: passwordCode, role };
    const { error } = await supabase.from('users_list').insert([newUser]);
    if (!error) {
      alert('تمت إضافة الموظف بنجاح!');
      setFullName(''); setUsername(''); setPasswordCode('');
      fetchUsers();
    }
  };

  // حفظ محتوى الصفحة الرئيسية
  const handleSaveContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('site_content').upsert({
      id: 1, // معرف ثابت لبيانات المحتوى
      about_us: aboutUs,
      our_goals: ourGoals,
      latest_news: latestNews
    });
    setLoading(false);
    if (!error) {
      alert('تم تحديث محتوى الصفحة الرئيسية بنجاح!');
    } else {
      alert('حدث خطأ أثناء الحفظ: ' + error.message);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0, color: '#047857' }}>⚙️ لوحة التحكم الإدارية (عثمان)</h2>
        <button onClick={onBack} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>↩️ عودة</button>
      </div>

      {/* أزرار التنقل بين التبويبات */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('users')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'users' ? '#047857' : '#e2e8f0', color: activeTab === 'users' ? '#fff' : '#0f172a', fontWeight: 'bold' }}>
          👥 إدارة الموظفين والصلاحيات
        </button>
        <button onClick={() => setActiveTab('content')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'content' ? '#047857' : '#e2e8f0', color: activeTab === 'content' ? '#fff' : '#0f172a', fontWeight: 'bold' }}>
          📝 تعديل محتوى الصفحة الرئيسية
        </button>
      </div>

      {/* تبويب إدارة الموظفين */}
      {activeTab === 'users' && (
        <div>
          <h3>➕ إضافة موظف جديد</h3>
          <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="الاسم الثلاثي" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="اسم الدخول" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="رمز المرور" value={passwordCode} onChange={e => setPasswordCode(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <select value={role} onChange={e => setRole(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
              <option value="معلم">معلم</option>
              <option value="محاسب">محاسب</option>
              <option value="مشرف">مشرف</option>
              <option value="أدمن">أدمن</option>
            </select>
            <button type="submit" style={{ background: '#047857', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ الموظف</button>
          </form>
        </div>
      )}

      {/* تبويب تعديل محتوى الرئيسية المباشر */}
      {activeTab === 'content' && (
        <form onSubmit={handleSaveContent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>📢 شريط الأخبار العاجلة:</label>
            <input type="text" value={latestNews} onChange={e => setLatestNews(e.target.value)} placeholder="مثال: فتح باب التسجيل للعام الدراسي الجديد..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>🏫 نبذة عن المدرسة (من نحن):</label>
            <textarea rows="4" value={aboutUs} onChange={e => setAboutUs(e.target.value)} placeholder="اكتبي التفاصيل هنا..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>🎯 رؤية وأهداف المدرسة:</label>
            <textarea rows="4" value={ourGoals} onChange={e => setOurGoals(e.target.value)} placeholder="اكتبي الأهداف هنا..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>

          <button type="submit" disabled={loading} style={{ background: '#047857', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            {loading ? 'جاري الحفظ...' : '💾 حفظ وتحديث الصفحة الرئيسية فوراً'}
          </button>
        </form>
      )}
    </div>
  );
}
