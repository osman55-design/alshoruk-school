import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function HomeSettingsSection() {
  const [activeTab, setActiveTab] = useState('settings'); // settings, news, board, teachers, honors

  // إعدادات من نحن والأهداف
  const [aboutUs, setAboutUs] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [goals, setGoals] = useState([]);

  // الأخبار
  const [newsList, setNewsList] = useState([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');

  // الأشخاص (إدارة، معلمين، طلاب)
  const [boardList, setBoardList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [honorsList, setHonorsList] = useState([]);

  const [personName, setPersonName] = useState('');
  const [personRole, setPersonRole] = useState(''); // الدور للإدارة أو المادة للمعلمين أو الفصل للطلاب
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // 1. الإعدادات
      const { data: settingsData } = await supabase.from('settings').select('*').maybeSingle();
      if (settingsData) {
        if (settingsData.about_us) setAboutUs(settingsData.about_us);
        if (settingsData.goals) {
          const parsedGoals = Array.isArray(settingsData.goals) ? settingsData.goals : JSON.parse(settingsData.goals || '[]');
          setGoals(parsedGoals);
        }
      }

      // 2. الأخبار
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNewsList(newsData);

      // 3. الإدارة
      const { data: boardData } = await supabase.from('board_members').select('*');
      if (boardData) setBoardList(boardData);

      // 4. المعلمين
      const { data: teachersData } = await supabase.from('teachers').select('*');
      if (teachersData) setTeachersList(teachersData);

      // 5. لوحة الشرف (الطلاب)
      const { data: honorsData } = await supabase.from('students').select('*').eq('is_honor', true);
      if (honorsData) setHonorsList(honorsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // حفظ من نحن والأهداف
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data: existing } = await supabase.from('settings').select('id').maybeSingle();
      const payload = { about_us: aboutUs, goals: goals };

      let error;
      if (existing) {
        const res = await supabase.from('settings').update(payload).eq('id', existing.id);
        error = res.error;
      } else {
        const res = await supabase.from('settings').insert([payload]);
        error = res.error;
      }

      if (error) throw error;
      setMessage('تم حفظ إعدادات الصفحة الرئيسية بنجاح! ✅');
    } catch (err) {
      setMessage('خطأ أثناء الحفظ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // إدارة الأهداف
  const handleAddGoal = () => {
    if (!goalInput.trim()) return;
    setGoals([...goals, goalInput.trim()]);
    setGoalInput('');
  };
  const handleRemoveGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  // إدارة الأخبار
  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!newsTitle.trim()) return;
    try {
      const { error } = await supabase.from('news').insert([{ title: newsTitle, content: newsContent }]);
      if (error) throw error;
      setNewsTitle('');
      setNewsContent('');
      fetchAllData();
      setMessage('تم نشر الخبر بنجاح! 📢');
    } catch (err) {
      setMessage('خطأ في نشر الخبر: ' + err.message);
    }
  };
  const handleDeleteNews = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    try {
      await supabase.from('news').delete().eq('id', id);
      fetchAllData();
    } catch (err) { alert(err.message); }
  };

  // إضافة شخص (إدارة / معلم / طالب متفوق)
  const handleAddPerson = async (type) => {
    if (!personName.trim()) return;
    try {
      if (type === 'board') {
        if (boardList.length >= 5) {
          alert('عذراً، الحد الأقصى لأعضاء الإدارة هو 5 أعضاء فقط.');
          return;
        }
        await supabase.from('board_members').insert([{ name: personName, role: personRole || 'عضو مجلس الإدارة' }]);
      } else if (type === 'teacher') {
        if (teachersList.length >= 25) {
          alert('عذراً، الحد الأقصى للمعلمين هو 25 معلماً.');
          return;
        }
        await supabase.from('teachers').insert([{ full_name: personName, subject: personRole || 'معلم' }]);
      } else if (type === 'honor') {
        if (honorsList.length >= 10) {
          alert('عذراً، الحد الأقصى للطلاب المتفوقين في لوحة الشرف هو 10 طلاب.');
          return;
        }
        await supabase.from('students').insert([{ full_name: personName, class_name: personRole || 'طالب متفوق', is_honor: true }]);
      }

      setPersonName('');
      setPersonRole('');
      fetchAllData();
      setMessage('تمت الإضافة بنجاح! ✅');
    } catch (err) {
      alert('خطأ: ' + err.message);
    }
  };

  // حذف شخص
  const handleDeletePerson = async (table, id) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      fetchAllData();
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.mainTitle}>🛠️ إدارة محتوى الصفحة الرئيسية بالكامل</h2>
      {message && <div style={styles.alert}>{message}</div>}

      {/* أزرار التنقل بين الأقسام الفرعية */}
      <div style={styles.subTabs}>
        <button onClick={() => setActiveTab('settings')} style={{...styles.tabBtn, backgroundColor: activeTab === 'settings' ? '#047857' : '#e2e8f0', color: activeTab === 'settings' ? '#fff' : '#334155'}}>من نحن والأهداف</button>
        <button onClick={() => setActiveTab('news')} style={{...styles.tabBtn, backgroundColor: activeTab === 'news' ? '#047857' : '#e2e8f0', color: activeTab === 'news' ? '#fff' : '#334155'}}>الشريط الإخباري</button>
        <button onClick={() => setActiveTab('board')} style={{...styles.tabBtn, backgroundColor: activeTab === 'board' ? '#047857' : '#e2e8f0', color: activeTab === 'board' ? '#fff' : '#334155'}}>إدارة المدرسة ({boardList.length}/5)</button>
        <button onClick={() => setActiveTab('teachers')} style={{...styles.tabBtn, backgroundColor: activeTab === 'teachers' ? '#047857' : '#e2e8f0', color: activeTab === 'teachers' ? '#fff' : '#334155'}}>الكادر التعليمي ({teachersList.length}/25)</button>
        <button onClick={() => setActiveTab('honors')} style={{...styles.tabBtn, backgroundColor: activeTab === 'honors' ? '#047857' : '#e2e8f0', color: activeTab === 'honors' ? '#fff' : '#334155'}}>لوحة الشرف ({honorsList.length}/10)</button>
      </div>

      {/* 1. قسم من نحن والأهداف */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>📖 تعديل "من نحن" وأهداف المدرسة</h3>
          <div style={styles.inputGroup}>
            <label style={styles.label}>محتوى "من نحن":</label>
            <textarea value={aboutUs} onChange={(e) => setAboutUs(e.target.value)} rows={3} style={styles.textarea} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>أهداف المدرسة:</label>
            <div style={styles.row}>
              <input type="text" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="أضف هدفاً..." style={styles.input} />
              <button type="button" onClick={handleAddGoal} style={styles.actionBtn}>إضافة</button>
            </div>
            <ul style={styles.list}>
              {goals.map((g, i) => (
                <li key={i} style={styles.listItem}><span>{g}</span> <button type="button" onClick={() => handleRemoveGoal(i)} style={styles.delSmBtn}>حذف</button></li>
              ))}
            </ul>
          </div>
          <button type="submit" disabled={loading} style={styles.saveBtn}>حفظ التغييرات 💾</button>
        </form>
      )}

      {/* 2. قسم الأخبار */}
      {activeTab === 'news' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>📢 إدارة الشريط الإخباري</h3>
          <form onSubmit={handleAddNews} style={styles.newsForm}>
            <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="عنوان الخبر..." style={styles.input} required />
            <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} placeholder="تفاصيل الخبر..." rows={2} style={styles.textarea} />
            <button type="submit" style={styles.saveBtn}>نشر خبر جديد 🚀</button>
          </form>
          <div style={styles.tableList}>
            {newsList.map((item) => (
              <div key={item.id} style={styles.rowItem}>
                <div><strong>{item.title}</strong><p style={{margin:0, color:'#64748b', fontSize:'13px'}}>{item.content}</p></div>
                <button onClick={() => handleDeleteNews(item.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. قسم إدارة المدرسة (5) */}
      {activeTab === 'board' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>🏛️ إدارة المدرسة (الحد الأقصى 5 أعضاء)</h3>
          <div style={styles.row}>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="اسم العضو..." style={styles.input} />
            <input type="text" value={personRole} onChange={(e) => setPersonRole(e.target.value)} placeholder="المسمى (مثال: المدير العام)..." style={styles.input} />
            <button type="button" onClick={() => handleAddPerson('board')} style={styles.actionBtn}>إضافة عضو</button>
          </div>
          <div style={styles.tableList}>
            {boardList.map((m) => (
              <div key={m.id} style={styles.rowItem}>
                <span><strong>{m.name || m.full_name}</strong> - <span style={{color:'#64748b'}}>{m.role}</span></span>
                <button onClick={() => handleDeletePerson('board_members', m.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. قسم الكادر التعليمي (25) */}
      {activeTab === 'teachers' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>👨‍🏫 الكادر التعليمي (الحد الأقصى 25 معلماً)</h3>
          <div style={styles.row}>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="اسم المعلم..." style={styles.input} />
            <input type="text" value={personRole} onChange={(e) => setPersonRole(e.target.value)} placeholder="المادة الدراسية..." style={styles.input} />
            <button type="button" onClick={() => handleAddPerson('teacher')} style={styles.actionBtn}>إضافة معلم</button>
          </div>
          <div style={styles.tableList}>
            {teachersList.map((t) => (
              <div key={t.id} style={styles.rowItem}>
                <span><strong>{t.full_name || t.name}</strong> - <span style={{color:'#64748b'}}>{t.subject}</span></span>
                <button onClick={() => handleDeletePerson('teachers', t.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. قسم لوحة الشرف (10) */}
      {activeTab === 'honors' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>🌟 لوحة الشرف (الحد الأقصى 10 طلاب متفوقين)</h3>
          <div style={styles.row}>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="اسم الطالب المتفوق..." style={styles.input} />
            <input type="text" value={personRole} onChange={(e) => setPersonRole(e.target.value)} placeholder="الصف الدراسي..." style={styles.input} />
            <button type="button" onClick={() => handleAddPerson('honor')} style={styles.actionBtn}>إضافة للوحة الشرف</button>
          </div>
          <div style={styles.tableList}>
            {honorsList.map((s) => (
              <div key={s.id} style={styles.rowItem}>
                <span><strong>{s.full_name || s.name}</strong> - <span style={{color:'#64748b'}}>{s.class_name}</span></span>
                <button onClick={() => handleDeletePerson('students', s.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" },
  mainTitle: { color: '#047857', marginBottom: '15px', fontSize: '20px' },
  alert: { backgroundColor: '#f0fdf4', color: '#15803d', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold' },
  subTabs: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  tabBtn: { padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  sectionCard: { backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '4px solid #047857' },
  sectionTitle: { color: '#1e293b', fontSize: '16px', marginBottom: '15px', fontWeight: 'bold' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', fontSize: '13px', color: '#334155', marginBottom: '6px', fontWeight: 'bold' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
  textarea: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
  row: { display: 'flex', gap: '10px', marginBottom: '12px' },
  actionBtn: { backgroundColor: '#0ea5e9', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' },
  saveBtn: { backgroundColor: '#047857', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  list: { paddingRight: '20px', margin: 0, color: '#475569' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  tableList: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' },
  rowItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  delSmBtn: { backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  newsForm: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }
};
