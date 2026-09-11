import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddUserForm({ onClose, onUserAdded }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [passwordCode, setPasswordCode] = useState('');
  const [role, setRole] = useState('معلم');

  // صلاحيات الأقسام
  const [canStudents, setCanStudents] = useState(false);
  const [canClasses, setCanClasses] = useState(false);
  const [canTeachers, setCanTeachers] = useState(false);
  const [canFinance, setCanFinance] = useState(false);
  const [canResults, setCanResults] = useState(false);
  const [canTransport, setCanTransport] = useState(false);
  const [canSupervisors, setCanSupervisors] = useState(false);
  const [canAdmin, setCanAdmin] = useState(false);
  const [canLanding, setCanLanding] = useState(false); // صلاحية الصفحة الرئيسية
  const [canBridge, setCanBridge] = useState(false); // 🌉 صلاحية قسم الجسر الجديدة

  // المرحلة التعليمية المصرح بها
  const [stageKindergarten, setStageKindergarten] = useState(true);
  const [stagePrimary, setStagePrimary] = useState(true);
  const [stageMiddle, setStageMiddle] = useState(true);
  const [stageSecondary, setStageSecondary] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !passwordCode || !fullName) {
      alert('يرجى تعبئة كافة الحقول المطلوبة!');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            full_name: fullName,
            username: username.trim(),
            password_code: passwordCode.trim(),
            role: role,
            can_manage_students: canStudents,
            can_manage_classes: canClasses,
            can_manage_teachers: canTeachers,
            can_manage_finance: canFinance,
            can_manage_results: canResults,
            can_manage_transport: canTransport,
            can_manage_supervisors: canSupervisors,
            can_manage_admin: canAdmin,
            can_manage_landing: canLanding,
            can_manage_bridge: canBridge, // 🌉 حفظ صلاحية قسم الجسر في قاعدة البيانات
            stage_kindergarten: stageKindergarten,
            stage_primary: stagePrimary,
            stage_middle: stageMiddle,
            stage_secondary: stageSecondary
          }
        ]);

      if (error) throw error;

      alert('تمت إضافة الموظف بنجاح! 🎉');
      if (onUserAdded) onUserAdded();
      if (onClose) onClose();
    } catch (err) {
      alert('حدث خطأ أثناء إضافة الموظف: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* زر إغلاق النافذة */}
      <button 
        onClick={onClose}
        type="button"
        style={{
          position: 'absolute',
          top: '-10px',
          left: '-10px',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fee2e2',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ✖
      </button>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#047857', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
          ➕ إضافة موظف جديد وتعيين كلمة المرور والصلاحيات
        </h3>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* بيانات المستخدم */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>اسم الموظف الثلاثي:</label>
            <input 
              type="text" 
              placeholder="مثال: أحمد محمد علي" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>اسم الدخول البرمجي:</label>
            <input 
              type="text" 
              placeholder="مثال: ahmed_m" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>كلمة المرور / الرمز:</label>
            <input 
              type="text" 
              placeholder="****" 
              value={passwordCode} 
              onChange={(e) => setPasswordCode(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>الرتبة / الدور:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
              <option value="معلم">👨‍🏫 معلم</option>
              <option value="محاسب">💰 محاسب</option>
              <option value="مشرف">👩‍💼 مشرف</option>
              <option value="إداري">🏫 إداري</option>
              <option value="مدير">👑 مدير / أدمن</option>
            </select>
          </div>
        </div>

        {/* تحديد صلاحيات الأقسام */}
        <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1e293b' }}>🔑 تحديد صلاحيات الوصول للأقسام:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <label><input type="checkbox" checked={canStudents} onChange={(e) => setCanStudents(e.target.checked)} /> 📚 الطلاب</label>
            <label><input type="checkbox" checked={canClasses} onChange={(e) => setCanClasses(e.target.checked)} /> 🏛️ الفصول</label>
            <label><input type="checkbox" checked={canTeachers} onChange={(e) => setCanTeachers(e.target.checked)} /> 👨‍🏫 المعلمين</label>
            <label><input type="checkbox" checked={canFinance} onChange={(e) => setCanFinance(e.target.checked)} /> 💰 الحسابات</label>
            <label><input type="checkbox" checked={canResults} onChange={(e) => setCanResults(e.target.checked)} /> 📋 النتيجة</label>
            <label><input type="checkbox" checked={canTransport} onChange={(e) => setCanTransport(e.target.checked)} /> 🚌 التراحيل</label>
            <label><input type="checkbox" checked={canSupervisors} onChange={(e) => setCanSupervisors(e.target.checked)} /> 👩‍💼 المشرفات</label>
            <label><input type="checkbox" checked={canLanding} onChange={(e) => setCanLanding(e.target.checked)} /> 🏠 الصفحة الرئيسية</label>
            <label><input type="checkbox" checked={canBridge} onChange={(e) => setCanBridge(e.target.checked)} /> 🌉 الجسر</label>
            <label><input type="checkbox" checked={canAdmin} onChange={(e) => setCanAdmin(e.target.checked)} /> 👑 الإدارة</label>
          </div>
        </div>

        {/* المرحلة التعليمية */}
        <div style={{ border: '1px solid #bbf7d0', padding: '12px', borderRadius: '12px', backgroundColor: '#f0fdf4' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#166534' }}>🎓 تحديد المراحل التعليمية المصرح للموظف بفتحها:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <label><input type="checkbox" checked={stageKindergarten} onChange={(e) => setStageKindergarten(e.target.checked)} /> 🧸 مرحلة الروضة</label>
            <label><input type="checkbox" checked={stagePrimary} onChange={(e) => setStagePrimary(e.target.checked)} /> 🏫 المرحلة الابتدائية</label>
            <label><input type="checkbox" checked={stageMiddle} onChange={(e) => setStageMiddle(e.target.checked)} /> 🎒 المرحلة المتوسطة</label>
            <label><input type="checkbox" checked={stageSecondary} onChange={(e) => setStageSecondary(e.target.checked)} /> 🎓 المرحلة الثانوية</label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            backgroundColor: '#047857',
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '5px'
          }}
        >
          {loading ? 'جاري الحفظ...' : '💾 حفظ الموظف وتثبيت الصلاحيات'}
        </button>

      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '13px',
  boxSizing: 'box-sizing'
};
