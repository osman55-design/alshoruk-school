import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onLoginSuccess, goToAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // معالجة تسجيل الدخول والتحقق من جدول users
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const cleanUsername = username.trim();
      const cleanPassword = password.trim();

      // البحث عن المستخدم في جدول users
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (error) {
        throw new Error(`خطأ في الاتصال بقاعدة البيانات: ${error.message}`);
      }

      if (!userProfile) {
        throw new Error('اسم المستخدم غير مسجل في النظام.');
      }

      // مطابقة كلمة المرور مع الحقل password_code في الجدول
      if (userProfile.password_code !== cleanPassword) {
        throw new Error('كلمة المرور غير صحيحة.');
      }

      // تسجيل الدخول بنجاح والتوجيه
      if (onLoginSuccess) {
        onLoginSuccess(userProfile);
      }
      if (goToAdmin) {
        goToAdmin();
      }

      setShowModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b', margin: 0, padding: 0 }}>
      
      {/* الهيدر العلوي */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#059669', color: '#fff', fontSize: '24px', padding: '8px 12px', borderRadius: '12px' }}>🏫</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>مدرسة الشروق السودانية</h1>
            <span style={{ fontSize: '12px', color: '#64748b' }}>البوابة التعليمية المتكاملة</span>
          </div>
        </div>

        <button 
          onClick={() => setShowModal(true)} 
          style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '10px 22px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
        >
          🔑 بوابة النظام
        </button>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '15px' }}>مرحباً بكم في صرح الشروق التعليمي 🎓</h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', margin: '0 auto', maxWidth: '700px' }}>
            بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز بالمنهج السوداني المطور.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #fde68a' }}>✨ توكل • نجاح • تفوق</span>
            <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #a7f3d0' }}>📚 المنهج السوداني المطور</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>📖 مَن نحن؟</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد متخصص لتقديم المنهج السوداني الرصين بكفاءة عالية عبر جميع المراحل.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>🎯 أهدافنا ورسالتنا</h3>
            <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', paddingRight: '20px', margin: 0 }}>
              <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة.</li>
              <li>تعزيز القيم الأخلاقية والوطنية الراسخة في الطلاب.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>💼 الحلول الرقمية الذكية</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              بوابة إلكترونية متقدمة تتضمن لوحة تحكم سحابية مخصصة لإدارة شؤون الطلاب، المعلمين، الحسابات، والنتائج بسهولة وموثوقية.
            </p>
          </div>
        </div>
      </main>

      {/* نافذة تسجيل الدخول */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '15px', left: '15px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontSize: '20px' }}>
                🔒
              </div>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>تسجيل دخول المستخدمين</h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>أدخل بيانات حسابك المسجل للوصول للنظام</p>
            </div>
            
            {errorMsg && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>اسم المستخدم</label>
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>كلمة المرور</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', backgroundColor: '#059669', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'جاري التحقق...' : 'دخول للنظام'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* الفوتر */}
      <footer style={{ borderTop: '1px solid #e2e8f0', marginTop: '50px', padding: '20px', backgroundColor: '#ffffff', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
        ✨ تصميم وتطوير: <strong>الأستاذ عثمان صديق ( أبو حلا )</strong> | 📱 01149169346
      </footer>

    </div>
  );
}
