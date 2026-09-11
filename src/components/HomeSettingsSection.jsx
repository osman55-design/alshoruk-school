import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function HomeSettingsSection() {
  const [activeTab, setActiveTab] = useState('settings'); // settings, news, board, teachers, honors, supervision, sections, contacts

  // إعدادات من نحن والأهداف
  const [aboutUs, setAboutUs] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [goals, setGoals] = useState([]);

  // الأخبار
  const [newsList, setNewsList] = useState([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');

  // الأشخاص والبيانات
  const [boardList, setBoardList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [honorsList, setHonorsList] = useState([]);
  const [supervisionList, setSupervisionList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [contactsList, setContactsList] = useState([]);

  // حقول الإدخال المشتركة للأشخاص
  const [personName, setPersonName] = useState('');
  const [personRole, setPersonRole] = useState(''); // الدور، المادة، أو المرحلة الدراسية
  const [personImageFile, setPersonImageFile] = useState(null); // ملف الصورة بدلاً من الرابط النصي
  const [uploadingImage, setUploadingImage] = useState(false);

  // حقول الإدخال للأقسام والتواصل
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDesc, setSectionDesc] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const { data: settingsData } = await supabase.from('settings').select('*').maybeSingle();
      if (settingsData) {
        if (settingsData.about_us) setAboutUs(settingsData.about_us);
        if (settingsData.goals) {
          const parsedGoals = Array.isArray(settingsData.goals) ? settingsData.goals : JSON.parse(settingsData.goals || '[]');
          setGoals(parsedGoals);
        }
      }

      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNewsList(newsData);

      const { data: boardData } = await supabase.from('board_members').select('*');
      if (boardData) setBoardList(boardData);

      const { data: teachersData } = await supabase.from('teachers').select('*');
      if (teachersData) setTeachersList(teachersData);

      const { data: honorsData } = await supabase.from('top_students').select('*');
      if (honorsData) setHonorsList(honorsData);

      const { data: supervisionData } = await supabase.from('supervision').select('*');
      if (supervisionData) setSupervisionList(supervisionData);

      const { data: sectionsData } = await supabase.from('site_sections').select('*');
      if (sectionsData) setSectionsList(sectionsData);

      const { data: contactsData } = await supabase.from('contacts').select('*');
      if (contactsData) setContactsList(contactsData);

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // دالة مساعدة لرفع الصورة إلى Supabase Storage
  const uploadImageToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36.substring(2))}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('school-images') // تأكد أن لديك Bucket بهذا الاسم في سلة Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('school-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      throw new Error('فشل رفع الصورة: ' + err.message);
    }
  };

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

  const handleAddGoal = () => {
    if (!goalInput.trim()) return;
    setGoals([...goals, goalInput.trim()]);
    setGoalInput('');
  };
  const handleRemoveGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

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

  const handleAddPerson = async (type) => {
    if (!personName.trim()) return;
    try {
      setUploadingImage(true);
      let imageUrl = null;

      // إذا قام المستخدم باختيار ملف صورة، نقوم برفعه أولاً
      if (personImageFile) {
        imageUrl = await uploadImageToSupabase(personImageFile);
      }

      if (type === 'board') {
        if (boardList.length >= 5) {
          alert('عذراً، الحد الأقصى لأعضاء الإدارة هو 5 أعضاء فقط.');
          setUploadingImage(false);
          return;
        }
        await supabase.from('board_members').insert([{ 
          name: personName, 
          role: personRole || 'عضو مجلس الإدارة', 
          image_url: imageUrl 
        }]);
      } else if (type === 'teacher') {
        if (teachersList.length >= 25) {
          alert('عذراً، الحد الأقصى للمعلمين هو 25 معلماً.');
          setUploadingImage(false);
          return;
        }
        await supabase.from('teachers').insert([{ 
          full_name: personName, 
          subject: personRole || 'معلم', 
          image_url: imageUrl 
        }]);
      } else if (type === 'supervision') {
        await supabase.from('supervision').insert([{ 
          full_name: personName, 
          role: personRole || 'مشرف تربوي', 
          image_url: imageUrl 
        }]);
      } else if (type === 'honor') {
        await supabase.from('top_students').insert([{ 
          name: personName, 
          stage: personRole || 'primary', 
          image: imageUrl 
        }]);
      }

      setPersonName('');
      setPersonRole('');
      setPersonImageFile(null);
      fetchAllData();
      setMessage('تمت الإضافة بنجاح! ✅');
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddCustomSection = async (e) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;
    try {
      await supabase.from('site_sections').insert([{ title: sectionTitle, description: sectionDesc }]);
      setSectionTitle('');
      setSectionDesc('');
      fetchAllData();
      setMessage('تم إضافة القسم بنجاح! 📂');
    } catch (err) {
      alert('خطأ: ' + err.message);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!contactTitle.trim() || !contactPhone.trim()) return;
    try {
      await supabase.from('contacts').insert([{ title: contactTitle, phone: contactPhone }]);
      setContactTitle('');
      setContactPhone('');
      fetchAllData();
      setMessage('تم إضافة جهة الاتصال بنجاح! 📞');
    } catch (err) {
      alert('خطأ: ' + err.message);
    }
  };

  const handleDeleteItem = async (table, id) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      fetchAllData();
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.mainTitle}>🛠️ لوحة تحكم محتوى المدرسة بالكامل</h2>
      {message && <div style={styles.alert}>{message}</div>}

      <div style={styles.subTabs}>
        <button onClick={() => setActiveTab('settings')} style={{...styles.tabBtn, backgroundColor: activeTab === 'settings' ? '#047857' : '#e2e8f0', color: activeTab === 'settings' ? '#fff' : '#334155'}}>من نحن والأهداف</button>
        <button onClick={() => setActiveTab('news')} style={{...styles.tabBtn, backgroundColor: activeTab === 'news' ? '#047857' : '#e2e8f0', color: activeTab === 'news' ? '#fff' : '#334155'}}>الشريط الإخباري</button>
        <button onClick={() => setActiveTab('board')} style={{...styles.tabBtn, backgroundColor: activeTab === 'board' ? '#047857' : '#e2e8f0', color: activeTab === 'board' ? '#fff' : '#334155'}}>إدارة المدرسة ({boardList.length}/5)</button>
        <button onClick={() => setActiveTab('teachers')} style={{...styles.tabBtn, backgroundColor: activeTab === 'teachers' ? '#047857' : '#e2e8f0', color: activeTab === 'teachers' ? '#fff' : '#334155'}}>الكادر التعليمي ({teachersList.length}/25)</button>
        <button onClick={() => setActiveTab('supervision')} style={{...styles.tabBtn, backgroundColor: activeTab === 'supervision' ? '#047857' : '#e2e8f0', color: activeTab === 'supervision' ? '#fff' : '#334155'}}>الإشراف التربوي</button>
        <button onClick={() => setActiveTab('honors')} style={{...styles.tabBtn, backgroundColor: activeTab === 'honors' ? '#047857' : '#e2e8f0', color: activeTab === 'honors' ? '#fff' : '#334155'}}>لوحة الشرف ({honorsList.length})</button>
        <button onClick={() => setActiveTab('sections')} style={{...styles.tabBtn, backgroundColor: activeTab === 'sections' ? '#047857' : '#e2e8f0', color: activeTab === 'sections' ? '#fff' : '#334155'}}>أقسام ومرافق المدرسة</button>
        <button onClick={() => setActiveTab('contacts')} style={{...styles.tabBtn, backgroundColor: activeTab === 'contacts' ? '#047857' : '#e2e8f0', color: activeTab === 'contacts' ? '#fff' : '#334155'}}>أرقام التواصل</button>
      </div>

      {/* 1. من نحن والأهداف */}
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
              <button type="button" onClick={handleAddGoal} style={styles.actionBtn}>إضافة هدف</button>
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

      {/* 2. الأخبار */}
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

      {/* 3. الإدارة */}
      {activeTab === 'board' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>🏛️ إدارة المدرسة (الحد الأقصى 5 أعضاء)</h3>
          <div style={styles.formGrid}>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="اسم العضو..." style={styles.input} />
            <input type="text" value={personRole} onChange={(e) => setPersonRole(e.target.value)} placeholder="المسمى (مثال: المدير العام)..." style={styles.input} />
            <div style={styles.fileInputContainer}>
              <label style={styles.fileLabel}>اختر صورة شخصية:</label>
              <input type="file" accept="image/*" onChange={(e) => setPersonImageFile(e.target.files[0])} style={styles.fileInput} />
            </div>
            <button type="button" disabled={uploadingImage} onClick={() => handleAddPerson('board')} style={styles.actionBtn}>
              {uploadingImage ? 'جاري الرفع...' : 'إضافة عضو'}
            </button>
          </div>
          <div style={styles.tableList}>
            {boardList.map((m) => (
              <div key={m.id} style={styles.rowItem}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  {m.image_url && <img src={m.image_url} alt="" style={{width:'35px', height:'35px', borderRadius:'50%', objectFit:'cover'}} />}
                  <span><strong>{m.name}</strong> - <span style={{color:'#64748b'}}>{m.role}</span></span>
                </div>
                <button onClick={() => handleDeleteItem('board_members', m.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. المعلمين */}
      {activeTab === 'teachers' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>👨‍🏫 الكادر التعليمي (الحد الأقصى 25 معلماً)</h3>
          <div style={styles.formGrid}>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="اسم المعلم..." style={styles.input} />
            <input type="text" value={personRole} onChange={(e) => setPersonRole(e.target.value)} placeholder="المادة الدراسية..." style={styles.input} />
            <div style={styles.fileInputContainer}>
              <label style={styles.fileLabel}>اختر صورة شخصية:</label>
              <input type="file" accept="image/*" onChange={(e) => setPersonImageFile(e.target.files[0])} style={styles.fileInput} />
            </div>
            <button type="button" disabled={uploadingImage} onClick={() => handleAddPerson('teacher')} style={styles.actionBtn}>
              {uploadingImage ? 'جاري الرفع...' : 'إضافة معلم'}
            </button>
          </div>
          <div style={styles.tableList}>
            {teachersList.map((t) => (
              <div key={t.id} style={styles.rowItem}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  {t.image_url && <img src={t.image_url} alt="" style={{width:'35px', height:'35px', borderRadius:'50%', objectFit:'cover'}} />}
                  <span><strong>{t.full_name}</strong> - <span style={{color:'#64748b'}}>{t.subject}</span></span>
                </div>
                <button onClick={() => handleDeleteItem('teachers', t.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. الإشراف التربوي */}
      {activeTab === 'supervision' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>📋 الإشراف التربوي</h3>
          <div style={styles.formGrid}>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="اسم المشرف..." style={styles.input} />
            <input type="text" value={personRole} onChange={(e) => setPersonRole(e.target.value)} placeholder="الدور أو التخصص..." style={styles.input} />
            <div style={styles.fileInputContainer}>
              <label style={styles.fileLabel}>اختر صورة شخصية:</label>
              <input type="file" accept="image/*" onChange={(e) => setPersonImageFile(e.target.files[0])} style={styles.fileInput} />
            </div>
            <button type="button" disabled={uploadingImage} onClick={() => handleAddPerson('supervision')} style={styles.actionBtn}>
              {uploadingImage ? 'جاري الرفع...' : 'إضافة مشرف'}
            </button>
          </div>
          <div style={styles.tableList}>
            {supervisionList.map((s) => (
              <div key={s.id} style={styles.rowItem}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  {s.image_url && <img src={s.image_url} alt="" style={{width:'35px', height:'35px', borderRadius:'50%', objectFit:'cover'}} />}
                  <span><strong>{s.full_name || s.name}</strong> - <span style={{color:'#64748b'}}>{s.role}</span></span>
                </div>
                <button onClick={() => handleDeleteItem('supervision', s.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. لوحة الشرف */}
      {activeTab === 'honors' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>🌟 لوحة الشرف</h3>
          <div style={styles.formGrid}>
            <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="اسم الطالب المتفوق..." style={styles.input} />
            <input type="text" value={personRole} onChange={(e) => setPersonRole(e.target.value)} placeholder="المرحلة (primary, middle...)..." style={styles.input} />
            <div style={styles.fileInputContainer}>
              <label style={styles.fileLabel}>اختر صورة الطالب:</label>
              <input type="file" accept="image/*" onChange={(e) => setPersonImageFile(e.target.files[0])} style={styles.fileInput} />
            </div>
            <button type="button" disabled={uploadingImage} onClick={() => handleAddPerson('honor')} style={styles.actionBtn}>
              {uploadingImage ? 'جاري الرفع...' : 'إضافة للوحة الشرف'}
            </button>
          </div>
          <div style={styles.tableList}>
            {honorsList.map((s) => (
              <div key={s.id} style={styles.rowItem}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  {s.image && <img src={s.image} alt="" style={{width:'35px', height:'35px', borderRadius:'50%', objectFit:'cover'}} />}
                  <span><strong>{s.name}</strong> - <span style={{color:'#64748b'}}>{s.stage}</span></span>
                </div>
                <button onClick={() => handleDeleteItem('top_students', s.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. أقسام ومرافق المدرسة */}
      {activeTab === 'sections' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>🏫 أقسام ومرافق المدرسة</h3>
          <form onSubmit={handleAddCustomSection} style={styles.newsForm}>
            <input type="text" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="عنوان القسم أو المرفق..." style={styles.input} required />
            <textarea value={sectionDesc} onChange={(e) => setSectionDesc(e.target.value)} placeholder="وصف القسم..." rows={2} style={styles.textarea} />
            <button type="submit" style={styles.saveBtn}>إضافة قسم جديد 📁</button>
          </form>
          <div style={styles.tableList}>
            {sectionsList.map((sec) => (
              <div key={sec.id} style={styles.rowItem}>
                <div><strong>{sec.title}</strong><p style={{margin:0, color:'#64748b', fontSize:'13px'}}>{sec.description}</p></div>
                <button onClick={() => handleDeleteItem('site_sections', sec.id)} style={styles.delSmBtn}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. أرقام التواصل */}
      {activeTab === 'contacts' && (
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>📞 أرقام التواصل والجهات</h3>
          <form onSubmit={handleAddContact} style={styles.newsForm}>
            <input type="text" value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} placeholder="الجهة (مثال: الإدارة، الاستقبال)..." style={styles.input} required />
            <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="رقم الهاتف..." style={styles.input} required />
            <button type="submit" style={styles.saveBtn}>إضافة رقم تواصل ☎️</button>
          </form>
          <div style={styles.tableList}>
            {contactsList.map((con) => (
              <div key={con.id} style={styles.rowItem}>
                <div><strong>{con.title}</strong>: <span style={{color:'#047857'}}>{con.phone}</span></div>
                <button onClick={() => handleDeleteItem('contacts', con.id)} style={styles.delSmBtn}>حذف</button>
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
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '15px', alignItems: 'center' },
  fileInputContainer: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fileLabel: { fontSize: '12px', color: '#64748b', fontWeight: 'bold' },
  fileInput: { fontSize: '13px', color: '#334155' },
  actionBtn: { backgroundColor: '#0ea5e9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' },
  saveBtn: { backgroundColor: '#047857', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  list: { paddingRight: '20px', margin: 0, color: '#475569' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  tableList: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' },
  rowItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  delSmBtn: { backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  newsForm: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }
};
