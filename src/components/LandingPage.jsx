import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function LandingPage({ onLoginSuccess, onOpenAdmin }) {
  const [username, setUsername] = useState('');
  const [passwordCode, setPasswordCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase
        .from('users_list')
        .select('*')
        .eq('username', username.trim())
        .eq('password_code', passwordCode.trim())
        .single();

      if (error || !data) {
        setErrorMsg('اسم المستخدم أو رمز الدخول غير صحيح');
      } else {
        onLoginSuccess(data);
      }
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', direction: 'rtl', padding: '20px' }}>
      <div style={{ background: '#ffffff', color: '#1e293b', width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#047857', margin: '0 0 8px 0' }}>مدرسة الشروق الخاصة</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>نظام الإدارة والخدمات الإلكترونية</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>اسم المستخدم:</label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="أدخل اسم الدخول"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>رمز المرور:</label>
            <input 
              type="password" 
              required 
              value={passwordCode} 
              onChange={(e) => setPasswordCode(e.target.value)} 
              placeholder="****"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <button 
            onClick={onOpenAdmin} 
            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ⚙️ الدخول إلى لوحة التحكم والإدارة العامة
          </button>
        </div>
      </div>
    </div>
  );
}
