import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function TeachersSection({ onBack }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null); // null لتجنب عرض المعلمين عند الفتح
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  
  // حقول نموذج المعلم
  const [teacherName, setTeacherName] = useState('');
  const [subject, setSubject] = useState('اللغة العربية');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // قائمة المواد والتخصصات
  const subjectsList = [
    'التربية الإسلامية', 'التربية المسيحية', 'اللغة العربية', 'الرياضيات', 
    'اللغة الإنجليزية', 'العلوم', 'التاريخ', 'الجغرافيا', 'الفيزياء', 
    'التربية الوطنية', 'الدراسات الاجتماعية والوطنية', 'العلوم والتقنية العامة', 
    'الرياضيات المتقدمة', 'اللغة الإنجليزية المتقدمة', 'تكنولوجيا المعلومات والحاسوب', 
    'الكيمياء', 'الأحياء', 'علوم الحاسوب', 'العلوم الهندسية', 'العلوم الإضافية والمواد الأدبية الأخرى'
  ];

  // جلب المعلمين من Supabase
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers_list')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      if (data) setTeachers(data);
    } catch (err) {
      console.error("خطأ جلب بيانات المعلمين:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // إضافة أو تعديل معلم
  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      alert("الرجاء كتابة اسم المعلم");
      return;
    }

    setLoading(true);
    const payload = {
      teacher_name: teacherName.trim(),
      subject: subject,
      phone: phone.trim()
    };

    try {
      if (editingTeacherId) {
        const { error } = await supabase.from('teachers_list').update(payload).eq('id', editingTeacherId);
        if (error) throw error;
        alert("✅ تم تعديل بيانات المعلم بنجاح!");
      } else {
        const { error } = await supabase.from('teachers_list').insert([payload]);
        if (error) throw error;
        alert("✅ تم إضافة المعلم بنجاح! يمكن الاستعلام عنه الآن عبر شريط البحث أو خيارات الفلترة.");
      }

      resetForm();
      fetchTeachers();
    } catch (err) {
      alert("❌ حدث خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (t) => {
    setEditingTeacherId(t.id);
    setTeacherName(t.teacher_name || '');
    setSubject(t.subject || 'اللغة العربية');
    setPhone(t.phone || '');
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المعلم؟")) {
      try {
        const { error } = await supabase.from('teachers_list').delete().eq('id', id);
        if (error) throw error;
        fetchTeachers();
      } catch (err) {
        alert("❌ فشل الحذف: " + err.message);
      }
    }
  };

  const resetForm = () => {
    setTeacherName('');
    setSubject('اللغة العربية');
    setPhone('');
    setEditingTeacherId(null);
    setShowAddModal(false);
  };

  // اختيار مادة معينة
  const handleSelectSubject = (subj) => {
    setShowAll(false);
    setSelectedSubject(subj);
  };

  // اختيار عرض كافة المعلمين
  const handleShowAll = () => {
    setSelectedSubject(null);
    setShowAll(true);
  };

  // الحصول على عدد المعلمين للمادة
  const getSubjectCount = (subj) => {
    return teachers.filter(t => t.subject === subj).length;
  };

  // معالجة القائمة المفلترة بناءً على البحث والمادة
  const getDisplayedTeachers = () => {
    if (!selectedSubject && !showAll && !searchTerm.trim()) {
      return []; // إخفاء القائمة في البداية عند عدم اختيار تصفية أو بحث
    }

    return teachers.filter(t => {
      const matchesSearch = searchTerm.trim() === '' || 
        (t.teacher_name && t.teacher_name.includes(searchTerm)) ||
        (t.subject && t.subject.includes(searchTerm)) ||
        (t.phone && t.phone.includes(searchTerm));

      if (showAll) return matchesSearch;
      if (selectedSubject) return t.subject === selectedSubject && matchesSearch;

      return matchesSearch;
    });
  };

  const displayedTeachers = getDisplayedTeachers();

  return (
    <div style={{ direction: 'rtl', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* الشريط العلوي والأزرار */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>
            👨‍🏫 قسم هيئة التدريس والمعلمين
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>استعلام ذكي وإدارة متكاملة لجميع معلمي المواد والتخصصات</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)' }}
          >
            ➕ إضافة معلم جديد
          </button>
          
          {onBack && (
            <button onClick={onBack} style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
              ❌ إغلاق الشاشة
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* شريط البحث وفلتر العرض العام */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="🔍 ابحث فورياً باسم المعلم، التخصص، أو رقم الهاتف..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: '1',
              minWidth: '280px',
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          />

          <button
            onClick={handleShowAll}
            style={{
              padding: '12px 22px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: showAll ? '#1e40af' : '#0284c7',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
            }}
          >
            📊 عرض جميع الأساتذة والتخصصات ({teachers.length})
          </button>
        </div>

        {/* أزرار تصفية المواد والتخصصات */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h4 style={{ margin: '0 0 14px 0', color: '#334155', fontSize: '15px', fontWeight: '700' }}>
            🏷️ اختر المادة لعرض المعلمين الخاصين بها:
          </h4>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {subjectsList.map((subj) => {
              const count = getSubjectCount(subj);
              const isSelected = selectedSubject === subj && !showAll;
              return (
                <button
                  key={subj}
                  onClick={() => handleSelectSubject(subj)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? '#0f766e' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#475569',
                    boxShadow: isSelected ? '0 3px 8px rgba(15, 118, 110, 0.25)' : 'none'
                  }}
                >
                  {subj} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* نموذج نافذة الإضافة والتعديل */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '18px', fontWeight: '800' }}>
                {editingTeacherId ? "✏️ تعديل بيانات المعلم" : "➕ تسجيل معلم جديد"}
              </h3>
              
              <form onSubmit={handleSaveTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#475569' }}>اسم المعلم كاملاً *</label>
                  <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)} required placeholder="مثال: د. أحمد محمد" style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#475569' }}>المادة / التخصص الأساسي *</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}>
                    {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#475569' }}>رقم الهاتف</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="05xxxxxxx" style={inputStyle} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={resetForm} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>إلغاء</button>
                  <button type="submit" disabled={loading} style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                    {loading ? "جاري الحفظ..." : "حفظ المعلم"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* جدول العرض المتقدم */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}>
                <th style={thStyle}>اسم المعلم كاملاً</th>
                <th style={thStyle}>المادة الأساسية / التخصص</th>
                <th style={thStyle}>رقم الهاتف</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody>
              {displayedTeachers.length > 0 ? (
                displayedTeachers.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{t.teacher_name}</td>
                    <td style={{ ...tdStyle }}>
                      <span style={{ padding: '4px 10px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', fontWeight: '700', fontSize: '12px' }}>
                        {t.subject}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: '#334155' }}>{t.phone || 'غير مسجل'}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button onClick={() => startEdit(t)} style={{ padding: '6px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: '6px', fontWeight: '700', fontSize: '12px' }}>✏️ تعديل</button>
                      <button onClick={() => handleDelete(t.id)} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>🗑️ حذف</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    {!selectedSubject && !showAll && !searchTerm.trim() ? (
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#334155', margin: '0 0 6px 0' }}>💡 يُرجى اختيار المادة أو البحث لعرض قائمة المعلمين</p>
                        <span style={{ fontSize: '13px' }}>يمكنك استخدام شريط البحث أوهناك أزرار الفلترة أعلاه لاستعراض الكادر التعليمي.</span>
                      </div>
                    ) : (
                      "لا يوجد معلمون مطابقون للخيارات أو البحث الحالي."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

const thStyle = {
  padding: '14px 18px',
  fontWeight: '700'
};

const tdStyle = {
  padding: '14px 18px',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '11px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  outline: 'none',
  fontSize: '14px'
};
