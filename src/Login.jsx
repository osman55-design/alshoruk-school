import React, { useState } from 'react';
import supabase from './supabaseClient';
export default function Login({ onLoginSuccess, goToLanding }) {
  const [username, setUsername] = useState('');
  const [passwordCode, setPasswordCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !passwordCode.trim()) {
      setErrorMsg('الرجاء إدخال اسم المستخدم وكلمة المرور/الرمز');
      return;
    }

    setLoading(true);

    try {
      // الاستعلام من جدول users في Supabase مطابقة لـ username و password_code
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.trim())
        .eq('password_code', passwordCode.trim())
        .maybeSingle();

      if (error) throw error;

      if (!user) {
        setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة!');
      } else {
        // نمرر كائن الموظف كاملاً بصلاحياته للـ App/AdminSystem
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }
    } catch (err) {
      console.error('خطأ الدخول:', err);
      setErrorMsg('حدث خطأ أثناء الاتصال بقاعدة البيانات: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>🔐 تسجيل الدخول لبوابة النظام</h2>
          <p style={styles.subtitle}>أدخل بيانات الموظف المعتمدة للوصول للأقسام المصرح بها</p>
        </div>

        {errorMsg && <div style={styles.errorAlert}>{errorMsg}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>اسم المستخدم البرمجي:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="مثال: ahmed_m"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>كلمة المرور / الرمز:</label>
            <input
              type="password"
              value={passwordCode}
              onChange={(e) => setPasswordCode(e.target.value)}
              placeholder="****"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'جاري التحقق من البيانات...' : 'دخول للبوابة 🔑'}
          </button>
        </form>

        {goToLanding && (
          <button onClick={goToLanding} style={styles.backBtn}>
            ⬅️ العودة للصفحة الرئيسية
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    direction: 'rtl',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '35px 30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    width: '100%',
    maxWidth: '400px',
    borderTop: '5px solid #047857',
  },
  header: {
    textAlign: 'center',
    marginBottom: '25px',
  },
  title: {
    color: '#047857',
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '13px',
    margin: 0,
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fee2e2',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    textAlign: 'right',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#334155',
    marginBottom: '6px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  submitBtn: {
    backgroundColor: '#047857',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '5px',
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: '#64748b',
    border: 'none',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
    textAlign: 'center',
    textDecoration: 'underline',
  },
};
