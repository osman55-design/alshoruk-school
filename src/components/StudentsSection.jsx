import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function StudentsSection({ onBack }) {
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState('ذكر');
  const [birthDate, setBirthDate] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [level, setLevel] = useState('الابتدائية');
  const [grade, setGrade] = useState('الصف الأول');
  const [track, setTrack] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('غير مسدد');
  const [loading, setLoading] = useState(false);

  const gradeOptions = {
    'الابتدائية': ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المتوسطة': ['الصف الأول متوسط', 'الصف الثاني متوسط', 'الصف الثالث متوسط'],
    'الثانوية': ['الصف الأول ثانوي', 'الصف الثاني ثانوي', 'الصف الثالث ثانوي']
  };

  const trackSpecialties = {
    'علمي': ['أحياء', 'حاسوب', 'هندسية'],
    'أدبي': ['دراسات إسلامية', 'فنون', 'الأدب الإنجليزي', 'أخرى']
  };

  const handleLevelChange = (selectedLevel) => {
    setLevel(selectedLevel);
    setGrade(gradeOptions[selectedLevel][0]);
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

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert("الرجاء كتابة اسم الطالب");
      return;
    }

    setLoading(true);

    let finalGradeName = grade;
    if (grade === 'الصف الثالث ثانوي' && track) {
      finalGradeName = `${grade} (${track} - ${specialty})`;
    }

    try {
      const { error } = await supabase
        .from('students_list')
        .insert([{
          student_name: studentName.trim(),
          gender: gender,
          birth_date: birthDate,
          academic_level: level,
          class_name: finalGradeName,
          parent_phone: parentPhone.trim(),
          whatsapp_phone: whatsappPhone.trim(),
          payment_status: paymentStatus
        }]);

      if (error) throw error;

      alert("🎉 تم قيد الطالب بنجاح ورُفعت البيانات للمنظومة!");

      // إعادة ضبط الحقول
      setStudentName('');
      setGender('ذكر');
      setBirthDate('');
      setParentPhone('');
      setWhatsappPhone('');
      setLevel('الابتدائية');
      setGrade('الصف الأول');
      setTrack('');
      setSpecialty('');
      setPaymentStatus('غير مسدد');

    } catch (err) {
      alert("❌ حدث خطأ أثناء القيد: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      direction: 'rtl',
      padding: '30px 20px',
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      backgroundColor: '#f1f5f9',
      minHeight: '100vh'
    }}>
      
      {/* شريط الأزرار العناوين العلوي */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 24px auto',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎓 بوابة تسجيل وقيد الطلاب
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>قم بتعبئة بيانات الطالب واختيار المسار التعليمي بدقة</p>
        </div>

        {onBack && (
          <button 
            onClick={onBack}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffffff',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ↩️ عودة للوحة الرئيسية
          </button>
        )}
      </div>

      {/* بطاقة نموذج التسجيل العصري */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0'
      }}>

        <form onSubmit={handleSaveStudent}>
          
          {/* القسم الأول: البيانات الشخصية والمعلومات الأساسية */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#0f766e', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              👤 البيانات الشخصية للطلب
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              
              {/* اسم الطالب */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>اسم الطالب الكامل (ثلاثي) *</label>
                <input 
                  type="text" 
                  placeholder="مثال: أحمد محمد علي" 
                  value={studentName} 
                  onChange={e => setStudentName(e.target.value)}
                  style={inputStyle}
                  required 
                />
              </div>

              {/* النوع */}
              <div>
                <label style={labelStyle}>النوع *</label>
                <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle}>
                  <option value="ذكر">👦 ذكر</option>
                  <option value="أنثى">👧 أنثى</option>
                </select>
              </div>

              {/* تاريخ الميلاد */}
              <div>
                <label style={labelStyle}>تاريخ الميلاد</label>
                <input 
                  type="date" 
                  value={birthDate} 
                  onChange={e => setBirthDate(e.target.value)}
                  style={inputStyle} 
                />
              </div>

              {/* هاتف ولي الأمر */}
              <div>
                <label style={labelStyle}>رقم هاتف ولي الأمر</label>
                <input 
                  type="text" 
                  placeholder="05XXXXXXXX" 
                  value={parentPhone} 
                  onChange={e => setParentPhone(e.target.value)}
                  style={inputStyle} 
                />
              </div>

              {/* رقم الواتس اب */}
              <div>
                <label style={labelStyle}>رقم الواتساب للتواصل</label>
                <input 
                  type="text" 
                  placeholder="05XXXXXXXX" 
                  value={whatsappPhone} 
                  onChange={e => setWhatsappPhone(e.target.value)}
                  style={inputStyle} 
                />
              </div>

            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '24px 0' }} />

          {/* القسم الثاني: المسار الأكاديمي والمالي */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#0f766e', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📚 المسار الأكاديمي والمالي
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              
              {/* المرحلة */}
              <div>
                <label style={labelStyle}>المرحلة التعليمية</label>
                <select value={level} onChange={e => handleLevelChange(e.target.value)} style={selectHighlightStyle}>
                  <option value="الابتدائية">🏫 الابتدائية</option>
                  <option value="المتوسطة">🏫 المتوسطة</option>
                  <option value="الثانوية">🎓 الثانوية</option>
                </select>
              </div>

              {/* الصف */}
              <div>
                <label style={labelStyle}>الصف الدراسي</label>
                <select value={grade} onChange={e => handleGradeChange(e.target.value)} style={inputStyle}>
                  {gradeOptions[level].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* تشعبات الصف الثالث ثانوي (تظهر فقط عند الاختيار) */}
              {grade === 'الصف الثالث ثانوي' && (
                <>
                  <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                    <label style={{ ...labelStyle, color: '#d97706' }}>المسار *</label>
                    <select value={track} onChange={e => handleTrackChange(e.target.value)} style={specialSelectStyle}>
                      <option value="علمي">🔬 علمي</option>
                      <option value="أدبي">📖 أدبي</option>
                    </select>
                  </div>

                  <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                    <label style={{ ...labelStyle, color: '#d97706' }}>التخصص الفرعي *</label>
                    <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={specialSelectStyle}>
                      {trackSpecialties[track]?.map(sp => (
                        <option key={sp} value={sp}>{sp}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* حالة الرسوم */}
              <div>
                <label style={labelStyle}>موقف الرسوم المالية</label>
                <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} style={inputStyle}>
                  <option value="غير مسدد">❌ غير مسدد</option>
                  <option value="مسدد بالكامل">✅ مسدد بالكامل</option>
                  <option value="مسدد جزئياً">⚠️ مسدد جزئياً</option>
                </select>
              </div>

            </div>
          </div>

          {/* زر حفظ وتأكيد السجل */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '14px 40px',
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {loading ? "جاري القيد والتأمين..." : "💾 قيد الطالب في النظام"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

// تنسيقات العناصر المشتركة لجعل الكود أنيق ونظيف جداً
const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#475569'
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#f8fafc',
  fontSize: '14px',
  color: '#1e293b',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border 0.2s, background-color 0.2s'
};

const selectHighlightStyle = {
  ...inputStyle,
  borderColor: '#0d9488',
  backgroundColor: '#f0fdf4',
  fontWeight: '700',
  color: '#0f766e'
};

const specialSelectStyle = {
  ...inputStyle,
  borderColor: '#f59e0b',
  backgroundColor: '#fffbeb',
  fontWeight: '700',
  color: '#b45309'
};
