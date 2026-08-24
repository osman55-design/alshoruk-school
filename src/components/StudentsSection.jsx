import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function StudentsSection({ onBack, currentUser }) {
  // المراحل الدراسية
  const allStages = ['الروضة', 'المرحلة الابتدائية', 'المرحلة المتوسطة', 'المرحلة الثانوية'];
  
  // تحديد Stages المسموحة للمستخدم الحالي
  const userAllowedStage = currentUser?.allowed_stage || 'الكل';
  const availableStages = userAllowedStage === 'الكل' 
    ? allStages 
    : [userAllowedStage];

  const gradesByStage = {
    'الروضة': ['روضة أولى', 'روضة ثانية', 'تمهيدي'],
    'المرحلة الابتدائية': ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المرحلة المتوسطة': ['الصف الأول المتوسط', 'الصف الثاني المتوسط', 'الصف الثالث المتوسط'],
    'المرحلة الثانوية': ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']
  };

  // بيانات نموذج التسجيل
  const [fullName, setFullName] = useState('');
  const [stage, setStage] = useState(availableStages[0] || 'المرحلة الثانوية');
  const [grade, setGrade] = useState(gradesByStage[availableStages[0]]?.[0] || 'الصف الأول الثانوي');
  const [gender, setGender] = useState('طالب');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fees, setFees] = useState(0);
  const [saving, setSaving] = useState(false);

  // تحديث الصفوف تلقائياً عند تغيير المرحلة
  useEffect(() => {
    if (gradesByStage[stage]) {
      setGrade(gradesByStage[stage][0]);
    }
  }, [stage]);

  // حفظ بيانات الطالب في الفصول
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('يرجى كتابة اسم الطالب ورقم الهاتف!');
      return;
    }

    setSaving(true);
    try {
      const newStudent = {
        full_name: fullName,
        stage: stage,
        grade: grade,
        gender: gender,
        phone: phone,
        address: address,
        fees: parseFloat(fees) || 0
      };

      const { error } = await supabase.from('students').insert([newStudent]);

      if (error) {
        alert('حدث خطأ أثناء حفظ بيانات الطالب: ' + error.message);
      } else {
        alert('تم حفظ البيانات بنجاح في الفصل المحدد!');
        setFullName('');
        setPhone('');
        setAddress('');
        setFees(0);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ غير متوقع!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl' }}>
      
      {/* الهيدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '18px' }}>📝 بوابة تسجيل الطلاب الجدد</h3>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>تسجيل البيانات الأساسية وحفظ الطالب مباشرة داخل الفصول</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>↩️ عودة للوحة التحكم</button>
        )}
      </div>

      {/* نموذج التسجيل فقط (بدون أي جدول عرض أو استعلام) */}
      <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ margin: '0 0 18px 0', color: '#047857', fontSize: '16px', fontWeight: 'bold' }}>✍️ إضافة طالب جديد وإسناده للفصل</h4>
        
        <form onSubmit={handleSaveStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          <div>
            <label style={labelStyle}>اسم الطالب بالكامل:</label>
            <input type="text" placeholder="مثال: علي محمد أحمد" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>المرحلة الدراسية المتاحة:</label>
            <select value={stage} onChange={e => setStage(e.target.value)} style={inputStyle}>
              {availableStages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>الصف / الفصل الدراسي:</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} style={inputStyle}>
              {gradesByStage[stage]?.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>نوع الطالب:</label>
            <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle}>
              <option value="طالب">👦 طالب (ذكر)</option>
              <option value="طالبة">👧 طالبة (أنثى)</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>رقم هاتف ولي الأمر:</label>
            <input type="text" placeholder="09xxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>العنوان / المنطقة:</label>
            <input type="text" placeholder="أسوان" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>الرسوم المحددة:</label>
            <input type="number" value={fees} onChange={e => setFees(e.target.value)} style={inputStyle} min="0" />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
            <button type="submit" disabled={saving} style={{ padding: '12px 28px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {saving ? 'جاري الحفظ...' : '💾 حفظ البيانات في الفصل'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'block' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' };
