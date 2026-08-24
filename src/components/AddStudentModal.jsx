import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AddStudentModal({ isOpen, onClose, onSave, studentToEdit = null, currentUser = null }) {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [gender, setGender] = useState('ذكر');
  const [parentPhone, setParentPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('غير مكتمل');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // 🌟 قائمة الفصول والتخصصات مقسمة حسب المرحلة
  const allClassOptions = {
    preschool: [
      "روضة - فصل مستمع",
      "روضة - الصف الأول",
      "روضة - الصف الثاني"
    ],
    primary: [
      "الابتدائي - الصف الأول",
      "الابتدائي - الصف الثاني",
      "الابتدائي - الصف الثالث",
      "الابتدائي - الصف الرابع",
      "الابتدائي - الصف الخامس",
      "الابتدائي - الصف السادس"
    ],
    middle: [
      "المتوسط - الصف الأول",
      "المتوسط - الصف الثاني",
      "المتوسط - الصف الثالث"
    ],
    secondary: [
      "الثانوي - الصف الأول",
      "الثانوي - الصف الثاني",
      "ثالث ثانوي - علمي (أحياء)",
      "ثالث ثانوي - علمي (حاسوب)",
      "ثالث ثانوي - علمي (هندسية)",
      "ثالث ثانوي - أدبي (دراسات إسلامية)",
      "ثالث ثانوي - أدبي (الأدب الإنجليزي)",
      "ثالث ثانوي - أدبي (الفنون)",
      "ثالث ثانوي - أدبي (تخصصات أخرى)"
    ]
  };

  // 🔒 فلترة الفصول المتاحة بناءً على صلاحيات المشرف الحالي
  const getAvailableClasses = () => {
    // إذا لم تتوفر بيانات المستخدم أو كان مديراً، تظهر كافة الفصول
    if (!currentUser || currentUser.can_manage_admin) {
      return Object.values(allClassOptions).flat();
    }

    let available = [];

    // التحقق من الصلاحيات الممررة سواء كانت كـ Object أو مسطحة في currentUser
    const stages = currentUser.stages || currentUser;

    if (stages.stage_preschool || stages.preschool) {
      available = available.concat(allClassOptions.preschool);
    }
    if (stages.stage_primary || stages.primary) {
      available = available.concat(allClassOptions.primary);
    }
    if (stages.stage_middle || stages.middle) {
      available = available.concat(allClassOptions.middle);
    }
    if (stages.stage_secondary || stages.secondary) {
      available = available.concat(allClassOptions.secondary);
    }

    return available;
  };

  const availableClassOptions = getAvailableClasses();

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name || '');
      setStudentClass(studentToEdit.student_class || '');
      setGender(studentToEdit.gender || 'ذكر');
      setParentPhone(studentToEdit.parent_phone || '');
      setPaymentStatus(studentToEdit.payment_status || 'غير مكتمل');
      setNotes(studentToEdit.notes || '');
    } else {
      resetForm();
    }
  }, [studentToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setStudentClass('');
    setGender('ذكر');
    setParentPhone('');
    setPaymentStatus('غير مكتمل');
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !studentClass) {
      alert('يرجى ملء اسم الطالب واختيار الفصل الدراسي');
      return;
    }

    setLoading(true);
    const studentData = {
      name: name.trim(),
      student_class: studentClass,
      gender: gender,
      parent_phone: parentPhone.trim(),
      payment_status: paymentStatus,
      notes: notes.trim()
    };

    try {
      if (studentToEdit) {
        // تعديل طالب حالي
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', studentToEdit.id);

        if (error) throw error;
        alert('تم تعديل بيانات الطالب بنجاح ✨');
      } else {
        // إضافة طالب جديد
        const { error } = await supabase
          .from('students')
          .insert([studentData]);

        if (error) throw error;
        alert('تمت إضافة الطالب بنجاح 👏');
      }

      resetForm();
      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ بيانات الطالب!');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#047857', fontWeight: 'bold', fontSize: '18px' }}>
            {studentToEdit ? '✏️ تعديل بيانات طالب' : '➕ إضافة طالب جديد'}
          </h3>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* اسم الطالب */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>اسم الطالب الرباعي:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محمد أحمد علي حسن"
              style={inputStyle}
              required
            />
          </div>

          {/* اختيار الفصل / التخصص (مفلتر حسب المرحلة المصرح بها) */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>الفصل / المرحلة والتخصص:</label>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">-- اختر الفصل / التخصص --</option>
              {availableClassOptions.map((cls, idx) => (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* النوع / الجنس */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>الجنس:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={inputStyle}
            >
              <option value="ذكر">👦 ذكر (ولد)</option>
              <option value="أنثى">👧 أنثى (بنت)</option>
            </select>
          </div>

          {/* رقم هاتف ولي الأمر */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>رقم هاتف ولي الأمر:</label>
            <input
              type="text"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              style={inputStyle}
            />
          </div>

          {/* حالة السداد */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>حالة السداد المالية:</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="غير مكتمل">غير مكتمل</option>
              <option value="مكتمل">مكتمل</option>
              <option value="مُعفى">مُعفى</option>
            </select>
          </div>

          {/* ملاحظات */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>ملاحظات إضافية:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات أكاديمية أو صحية"
              style={inputStyle}
            />
          </div>

          {/* أزرار الإجراءات */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '10px 16px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '10px 20px', backgroundColor: '#047857', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'جاري الحفظ...' : (studentToEdit ? 'تحديث البيانات' : 'حفظ الطالب 💾')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🎨 أنماط التصميم
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  display: 'flex',
  justify: 'center',
  alignItems: 'center',
  zIndex: 1000,
  direction: 'rtl',
  fontFamily: "'Segoe UI', Roboto, sans-serif"
};

const modalContentStyle = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#334155',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '13.5px',
  boxSizing: 'border-box',
  outline: 'none',
  fontWeight: 'bold'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#64748b'
};
