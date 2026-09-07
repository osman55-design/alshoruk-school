import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage({ onLoginSuccess, currentUser }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // معالجة تسجيل الدخول للمستخدمين المسجلين
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw new Error('خطأ في بيانات الدخول: البريد أو كلمة المرور غير صحيحة.');
      }

      if (data?.user) {
        // جلب بيانات المستخدم الشخصية والصلاحيات
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        onLoginSuccess(profile || data.user);
        setShowLoginModal(false);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dir-rtl text-slate-800 font-sans">
      {/* الشريط العلوي / الهيدر */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
              🏫
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                مدرسة الشروق السودانية
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                البوابة التعليمية المتكاملة
              </p>
            </div>
          </div>

          {/* زر فتح نافذة دخول المستخدمين */}
          <div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
              <span>🔑</span>
              <span>بوابة النظام</span>
            </button>
          </div>

        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
              مرحباً بكم في صرح الشروق التعليمي 🎓
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز بالمنهج السوداني المطور.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border border-amber-200/60">
                ✨ توكل • نجاح • تفوق
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-200/60">
                📚 المنهج السوداني المطور
              </span>
            </div>
          </div>
        </section>

        {/* كروت التعريف */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <h3 className="text-lg font-bold text-slate-900">مَن نحن؟</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد متخصص لتقديم المنهج السوداني الرصين بكفاءة عالية عبر جميع المراحل.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <h3 className="text-lg font-bold text-slate-900">أهدافنا ورسالتنا</h3>
            </div>
            <ul className="text-slate-600 text-sm leading-relaxed space-y-1.5 list-disc list-inside">
              <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة.</li>
              <li>تعزيز القيم الأخلاقية والوطنية الراسخة في الطلاب.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <h3 className="text-lg font-bold text-slate-900">الحلول الرقمية الذكية</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              بوابة إلكترونية متقدمة تتضمن لوحة تحكم سحابية مخصصة لإدارة شؤون الطلاب، المعلمين، الحسابات، والنتائج بسهولة وموثوقية.
            </p>
          </div>
        </section>
      </main>

      {/* نافذة دخول المستخدمين (Login Modal) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 relative">
            
            {/* زر الإغلاق */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl mb-2">
                🔒
              </div>
              <h3 className="text-xl font-bold text-slate-900">تسجيل دخول المستخدمين</h3>
              <p className="text-xs text-slate-500 mt-1">أدخل بيانات حسابك المسجل للوصول للنظام</p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 mb-4 text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">البريد الإلكتروني / اسم المستخدم</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 shadow-sm disabled:opacity-50"
              >
                {loading ? 'جاري التحقق...' : 'دخول للنظام'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* الفوتر */}
      <footer className="border-t border-slate-200 mt-12 py-6 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs sm:text-sm text-slate-500 flex flex-wrap justify-center items-center gap-2">
          <span>✨ تصميم وتطوير:</span>
          <span className="font-semibold text-slate-700">الأستاذ عثمان صديق ( أبو حلا )</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono dir-ltr text-slate-600">📱 01149169346</span>
        </div>
      </footer>
    </div>
  );
}
