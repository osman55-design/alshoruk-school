import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function LandingPage() {
  const [logoUrl, setLogoUrl] = useState(null);
  const [news, setNews] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [primaryTopStudents, setPrimaryTopStudents] = useState([]);
  const [middleTopStudents, setMiddleTopStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // جلب الشعار
      const { data: logoData } = await supabase.from('school_settings').select('logo_url').single();
      if (logoData?.logo_url) setLogoUrl(logoData.logo_url);

      // جلب الأخبار
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNews(newsData);

      // جلب أعضاء مجلس الإدارة (حتى 10 أعضاء بشرط وجود الاسم والصورة)
      const { data: boardData } = await supabase.from('board_members').select('*').limit(10);
      if (boardData) {
        setBoardMembers(boardData.filter(m => m.name && m.photo_url && m.name.trim() !== ''));
      }

      // جلب المتفوقين في المرحلة الابتدائية (حتى 5 طلاب بشرط وجود الاسم والصورة)
      const { data: primData } = await supabase.from('top_students').select('*').eq('stage', 'primary').limit(5);
      if (primData) {
        setPrimaryTopStudents(primData.filter(s => s.name && s.photo_url && s.name.trim() !== ''));
      }

      // جلب المتفوقين في المرحلة المتوسطة (حتى 5 طلاب بشرط وجود الاسم والصورة)
      const { data: midData } = await supabase.from('top_students').select('*').eq('stage', 'middle').limit(5);
      if (midData) {
        setMiddleTopStudents(midData.filter(s => s.name && s.photo_url && s.name.trim() !== ''));
      }
    } catch (err) {
      console.log('ملاحظة جلب البيانات:', err.message);
    }
  };

  // دالة رفع وتحديث الشعار
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `logo_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('school-assets').upload(fileName, file);

    if (!error) {
      const { data: urlData } = supabase.storage.from('school-assets').getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;
      setLogoUrl(publicUrl);
      await supabase.from('school_settings').upsert({ id: 1, logo_url: publicUrl });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans dir-rtl text-right">
      
      {/* 1. الهيدر الرئيسي مع الشعار والنصوص */}
      <header className="bg-emerald-900 text-white py-6 px-6 shadow-lg border-b-4 border-amber-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-center md:text-right flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">
              مدرسة الشروق السودانية
            </h1>
            <p className="text-amber-400 font-semibold text-base md:text-lg mt-1">
              أسوان - جمهورية مصر العربية 🇪🇬 🇸🇩
            </p>
          </div>

          <div className="relative group cursor-pointer shrink-0">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="شعار المدرسة" 
                className="w-24 h-24 object-contain rounded-full border-2 border-amber-400 bg-white p-1 shadow-md transition transform group-hover:scale-105" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center bg-emerald-800 text-xs text-emerald-100 text-center p-2 font-medium">
                اضغط لرفع الشعار 📤
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              title="تغيير الشعار"
            />
          </div>

        </div>
      </header>

      {/* 2. شريط الأخبار المتحرك المضبوط أفقياً ويتوقف عند التحويم */}
      <section className="bg-amber-500 text-slate-900 h-12 flex items-center overflow-hidden border-b border-amber-600 relative shadow-inner">
        <div className="bg-amber-800 text-white font-bold px-5 h-full flex items-center z-20 shrink-0 text-sm shadow-md">
          آخر الأخبار 📣
        </div>
        
        <div className="w-full overflow-hidden whitespace-nowrap relative h-full flex items-center">
          <div className="animate-marquee text-sm md:text-base font-bold text-slate-900 px-4">
            {news.length > 0 ? (
              news.map((item, idx) => (
                <span key={idx} className="inline-block ml-12">🔸 {item.title || item.content}</span>
              ))
            ) : (
              <span className="inline-block whitespace-nowrap">
                مرحباً بكم في مدرسة الشروق السودانية بأسوان - يسعدنا استقبال استفساراتكم وتسجيل الطلاب للعام الدراسي الجديد.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. قسم من نحن */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200/80">
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            عن المدرسة
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">من نحن</h2>
          <p className="text-slate-600 leading-relaxed text-base md:text-lg">
            مدرسة الشروق السودانية بأسوان هي صرح تعليمي وتربوي يهدف إلى تقديم أفضل المناهج التعليمية السودانية لأبنائنا الطلاب في جمهورية مصر العربية. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً، وتوفير بيئة تعليمية محفزة تدعم الإبداع والتفوق تحت إشراف نخبة من أفضل الكوادر التعليمية.
          </p>
        </div>
      </section>

      {/* 4. قسم اعضاء مجلس الإدارة (مخفي الا إذا تم إضافة اسم وصورة والعدد حتى 10) */}
      {boardMembers.length > 0 && (
        <section className="py-12 bg-slate-100 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
              مجلس الإدارة
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {boardMembers.slice(0, 10).map((member, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-200">
                  <img 
                    src={member.photo_url} 
                    alt={member.name} 
                    className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-emerald-600 mb-3 shadow-sm" 
                  />
                  <h3 className="font-bold text-slate-800 text-sm">{member.name}</h3>
                  <p className="text-xs text-emerald-700 mt-1 font-semibold">{member.role || member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. الطلاب المتفوقون في الشهادة الابتدائية (مخفي الا إذا تم إضافة بيانات والعدد حتى 5) */}
      {primaryTopStudents.length > 0 && (
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-emerald-800 mb-8">
            🏆 أوائل الشهادة الابتدائية
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {primaryTopStudents.slice(0, 5).map((student, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-emerald-100">
                <img 
                  src={student.photo_url} 
                  alt={student.name} 
                  className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-amber-400 mb-3 shadow-sm" 
                />
                <h3 className="font-bold text-slate-800 text-sm">{student.name}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">النسبة: {student.score}%</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. الطلاب المتفوقون في الشهادة المتوسطة (مخفي الا إذا تم إضافة بيانات والعدد حتى 5) */}
      {middleTopStudents.length > 0 && (
        <section className="py-12 bg-slate-100 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-teal-800 mb-8">
              🎓 أوائل الشهادة المتوسطة
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {middleTopStudents.slice(0, 5).map((student, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-teal-100">
                  <img 
                    src={student.photo_url} 
                    alt={student.name} 
                    className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-teal-600 mb-3 shadow-sm" 
                  />
                  <h3 className="font-bold text-slate-800 text-sm">{student.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">النسبة: {student.score}%</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. الموقع وأرقام التواصل */}
      <section className="py-12 px-6 bg-emerald-950 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right">
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-1">📍 موقعنا</h3>
            <p className="text-emerald-100 text-sm">جمهورية مصر العربية - محافظة أسوان</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-1">📞 أرقام التواصل</h3>
            <p className="text-emerald-100 text-sm dir-ltr">01149169346 / +20 114 916 9346</p>
          </div>
        </div>
      </section>

      {/* 8. حقوق التصميم والتطوير */}
      <footer className="bg-slate-900 text-slate-400 text-center py-4 text-xs border-t border-slate-800">
        تصميم وتطوير: <span className="text-amber-400 font-bold">أستاذ عثمان صديق</span> (01149169346)
      </footer>

    </div>
  );
}
