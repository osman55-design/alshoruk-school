import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function StudentsSection({ onBack }) {
  const [students, setStudents] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('الكل');

  // حقول نموذج الإضافة والتعديل
  const [studentName, setStudentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [level, setLevel] = useState('الابتدائية');
  const [grade, setGrade] = useState('الصف الأول');
  const [track, setTrack] = useState(''); // علمي / أدبي
  const [specialty, setSpecialty] = useState(''); // التخصص الفرعي
  const [paymentStatus, setPaymentStatus] = useState('غير مسدد');
  const [loading, setLoading] = useState(false);

  // هيكلة الصفوف حسب المرحلة
  const gradeOptions = {
    'الابتدائية': ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المتوسطة': ['الصف الأول متوسط', 'الصف الثاني متوسط', 'الصف الثالث متوسط'],
    'الثانوية': ['الصف الأول ثانوي', 'الصف الثاني ثانوي', 'الصف الثالث ثانوي']
  };

  // الخيارات الفرعية للصف الثالث الثانوي
  const trackSpecialties = {
    'علمي': ['أحياء', 'حاسوب', 'هندسية'],
    'أدبي': ['دراسات إسلامية', 'فنون', 'الأدب الإنجليزي', 'أخرى']
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students_list')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      if (data) setStudents(data);
    } catch (err) {
      console.error("خطأ جلب الطلاب:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // تحديث خيارات الصف والتخصص فور تغيير المرحلة أو المسار
  const handleLevelChange = (selectedLevel) => {
    setLevel(selectedLevel);
    const defaultGrade = gradeOptions[selectedLevel][0];
    setGrade(defaultGrade);
    setTrack('');
    setSpecialty('');
  };

  const handleGradeChange = (selectedGrade) => {
    setGrade(selectedGrade);
    if (selectedGrade !== 'الصف الثالث ثانوي') {
      setTrack('');
      setSpecialty('');
    } else {
      setTrack('علمي');
      setSpecialty(trackSpecialties['علمي'][0]);
    }
  };

  const handleTrackChange = (selectedTrack) => {
    setTrack(selectedTrack);
    setSpecialty(trackSpecialties[selectedTrack][0]);
  };

  // إعادة ضبط النموذج
  const resetForm = () => {
    setStudentName('');
    setParentPhone('');
    setLevel('الابتدائية');
    setGrade('الصف الأول');
    setTrack('');
    setSpecialty('');
    setPaymentStatus('غير مسدد');
    setEditingStudentId(null);
  };

  // حفظ أو تعديل طالب
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert("الرجاء كتابة اسم الطالب");
      return;
    }

    setLoading(true);

    // صياغة اسم الصف النهائي متضمناً الفرع والتخصص إذا كان ثالث ثانوي
    let finalGradeName = grade;
    if (grade === 'الصف الثالث ثانوي' && track) {
      finalGradeName = `${grade} (${track} - ${specialty})`;
    }

    const studentPayload = {
      student_name: studentName.trim(),
      academic_level: level,
      class_name: finalGradeName,
      parent_phone: parentPhone.trim(),
      payment_status: paymentStatus
    };

    try {
      if (editingStudentId) {
        // عملية تعديل طالب قائم
        const { error } = await supabase
          .from('students_list')
          .update(studentPayload)
          .eq('id', editingStudentId);

        if (error) throw error;
        alert("✅ تم تعديل بيانات الطالب بنجاح!");
      } else {
        // عملية إضافة طالب جديد
        const { error } = await supabase
          .from('students_list')
          .insert([studentPayload]);

        if (error) throw error;
        alert("✅ تم قيد الطالب بنجاح!");
      }

      resetForm();
      fetchStudents();
    } catch (err) {
      alert("❌ حدث خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // بدء عملية التعديل وتعبئة البيانات في النموذج
  const startEdit = (st) => {
    setEditingStudentId(st.id);
    setStudentName(st.student_name || '');
    setParentPhone(st.parent_phone || '');
    setLevel(st.academic_level || 'الابتدائية');
    setPaymentStatus(st.payment_status || 'غير مسدد');

    // استخراج الصف والفرع والتخصص من المسمى المحفوظ
    const fullClass = st.class_name || 'الصف الأول';
    if (fullClass.includes('الصف الثالث ثانوي')) {
      setGrade('الصف الثالث ثانوي');
      if (fullClass.includes('علمي')) setTrack('علمي');
      else if (fullClass.includes('أدبي')) setTrack('أدبي');
    } else {
      setGrade(fullClass);
      setTrack('');
      setSpecialty('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // حذف طالب
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السجل؟")) {
      try {
        const { error } = await supabase.from('students_list').delete().eq('id', id);
        if (error) throw error;
        fetchStudents();
      } catch (err) {
        alert("❌ فشل الحذف: " + err.message);
      }
    }
  };

  // فلترة وتصفية القائمة
  const filteredStudents = students.filter(st => {
    const matchesSearch = 
      (st.student_name && st.student_name.includes(searchTerm)) ||
      (st.parent_phone && st.parent_phone.includes(searchTerm));

    const matchesLevel = filterLevel === 'الكل' || st.academic_level === filterLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div style={{ direction: 'rtl', padding: '20px', fontFamily: 'Arial', backgroundColor: '#f8fafc' }}>
      
      {/* شريط الأزرار والتصنيفات */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['الكل', 'الابتدائية', 'المتوسطة', 'الثانوية'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: filterLevel === lvl ? '#047857' : '#e2e8f0',
                color: filterLevel === lvl ? '#fff' : '#334155'
              }}
            >
              {lvl === 'الكل' ? 'جميع المراحل 🌐' : lvl}
            </button>
          ))}
        </div>
        
        {onBack && (
          <button onClick={onBack} style={{ padding: '8px 16px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ↩️ عودة
          </button>
        )}
      </div>

      {/* نموذج التسجيل / التعديل الديناميكي */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#047857' }}>
          {editingStudentId ? "✏️ تعديل بيانات الطالب" : "➕ تسجيل وقيد طالب جديد بالمدرسة"}
        </h3>

        <form onSubmit={handleSaveStudent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="اسم الطالب الكامل ثلاثي" 
              value={studentName} 
              onChange={e => setStudentName(e.target.value)}
              style={{ flex: '2', minWidth: '200px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
              required 
            />

            <input 
              type="text" 
              placeholder="رقم هاتف ولي الأمر الدائم" 
              value={parentPhone} 
              onChange={e => setParentPhone(e.target.value)}
              style={{ flex: '1', minWidth: '150px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
            />

            {/* اختيار المرحلة */}
            <select 
              value={level} 
              onChange={e => handleLevelChange(e.target.value)}
              style={{ flex: '1', minWidth: '130px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}
            >
              <option value="الابتدائية">الابتدائية</option>
              <option value="المتوسطة">المتوسطة</option>
              <option value="الثانوية">الثانوية</option>
            </select>

            {/* اختيار الصف المعتمد على المرحلة */}
            <select 
              value={grade} 
              onChange={e => handleGradeChange(e.target.value)}
              style={{ flex: '1', minWidth: '130px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}
            >
              {gradeOptions[level].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* الخيارات الخاصة بالصف الثالث ثانوي */}
            {grade === 'الصف الثالث ثانوي' && (
              <>
                <select 
                  value={track} 
                  onChange={e => handleTrackChange(e.target.value)}
                  style={{ flex: '1', minWidth: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #10b981', background: '#ecfdf5', fontWeight: 'bold' }}
                >
                  <option value="علمي">علمي</option>
                  <option value="أدبي">أدبي</option>
                </select>

                <select 
                  value={specialty} 
                  onChange={e => setSpecialty(e.target.value)}
                  style={{ flex: '1', minWidth: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #10b981', background: '#ecfdf5', fontWeight: 'bold' }}
                >
                  {trackSpecialties[track]?.map(sp => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </>
            )}

            {/* حالة الرسوم */}
            <select 
              value={paymentStatus} 
              onChange={e => setPaymentStatus(e.target.value)}
              style={{ flex: '1', minWidth: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}
            >
              <option value="غير مسدد">❌ غير مسدد</option>
              <option value="مسدد بالكامل">✅ مسدد بالكامل</option>
              <option value="مسدد جزئياً">⚠️ مسدد جزئياً</option>
            </select>

            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: '10px 20px', backgroundColor: editingStudentId ? '#f59e0b' : '#047857', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? "جاري الحفظ..." : editingStudentId ? "💾 حفظ التعديل" : "💾 قيد الطالب"}
            </button>

            {editingStudentId && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{ padding: '10px 15px', background: '#94a3b8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      {/* حقل البحث والتصفية السريعة */}
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="🔍 ابحث عن طالب بالاسم أو رقم الهاتف..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
        />
      </div>

      {/* جدول العرض المطور مع خيار التعديل */}
      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: '#047857', color: '#fff' }}>
              <th style={{ padding: '12px' }}>اسم الطالب الثلاثي</th>
              <th style={{ padding: '12px' }}>المرحلة التعليمية</th>
              <th style={{ padding: '12px' }}>الصف والتخصص</th>
              <th style={{ padding: '12px' }}>هاتف ولي الأمر</th>
              <th style={{ padding: '12px' }}>موقف الرسوم</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>إجراءات السجل</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((st) => (
                <tr key={st.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{st.student_name}</td>
                  <td style={{ padding: '12px' }}>{st.academic_level}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#047857' }}>{st.class_name}</td>
                  <td style={{ padding: '12px' }}>{st.parent_phone || '---'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: st.payment_status === 'مسدد بالكامل' ? '#dcfce7' : st.payment_status === 'مسدد جزئياً' ? '#fef3c7' : '#fee2e2',
                      color: st.payment_status === 'مسدد بالكامل' ? '#15803d' : st.payment_status === 'مسدد جزئياً' ? '#b45309' : '#b91c1c'
                    }}>
                      {st.payment_status || 'غير مسدد'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => startEdit(st)}
                      style={{ padding: '5px 10px', background: '#eab308', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}
                    >
                      ✏️ تعديل
                    </button>
                    <button 
                      onClick={() => handleDelete(st.id)}
                      style={{ padding: '5px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      🗑️ حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  لا يوجد طلاب مسجلون يطابقون خيارات التصفية أو البحث.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
