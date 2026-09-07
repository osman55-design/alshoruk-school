import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
    // جلب الشعار
    const { data: logoData } = await supabase.from('school_settings').select('logo_url').single();
    if (logoData?.logo_url) setLogoUrl(logoData.logo_url);

    // جلب الأخبار
    const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (newsData) setNews(newsData);

    // جلب أعضاء مجلس الإدارة (بشرط وجود الاسم والصورة)
    const { data: boardData } = await supabase.from('board_members').select('*').limit(10);
    if (boardData) {
      setBoardMembers(boardData.filter(m => m.name && m.photo_url && m.name.trim() !== ''));
    }

    // جلب المتفوقين في الابتدائي (بشرط وجود الاسم والصورة)
    const { data: primData } = await supabase.from('top_students').select('*').eq('stage', 'primary').limit(5);
    if (primData) {
      setPrimaryTopStudents(primData.filter(s => s.name && s.photo_url && s.name.trim() !== ''));
    }

    // جلب المتفوقين في المتوسط (بشرط وجود الاسم والصورة)
    const { data: midData } = await supabase.from('top_students').select('*').eq('stage', 'middle').limit(5);
    if (midData) {
      setMiddleTopStudents(midData.filter(s => s.name && s.photo_url && s.name.trim() !== ''));
    }
  };

  // رفع الشعار وتحديثه
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `logo_${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('school-assets').upload(fileName, file);

    if (!error) {
      const { data: urlData } = supabase.storage.from('school-assets').getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;
      setLogoUrl(publicUrl);
      await supabase.from('school_settings').upsert({ id: 1, logo_url: publicUrl });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans dir-rtl text-right">
      
      {/* 1. الهيدر الرئيسي والشعار */}
      <header className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-8 px-4 shadow-xl relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* قسم رفع وعرض الشعار */}
          <div className="relative group cursor-pointer">
            {logoUrl ? (
              <img src={logoUrl} alt="شعار المدرسة" className="h-24 w-24 object-contain rounded-full border-4 border-emerald-400 bg-white p-1 shadow-lg" />
            ) : (
              <div className="h-24 w-24 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center bg-emerald-700/50 text-xs text-emerald-100 text-center p-2">
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

          {/* اسم المدرسة والفرع */}
          <div className="text-center md:text-right flex-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-wide text-emerald-100 drop-shadow">
              مدرسة الشروق السودانية
            </h1>
            <p className="text-lg md:text-xl text-teal-200 mt-2 font-medium">
              فرع أسوان - مصر 🇪🇬 🇸🇩
            </p>
          </div>
        </div>
      </header>

      {/* 2. شريط الأخبار المتحرك (يتوقف عند مرور الماوس) */}
      <section className="bg-amber-500 text-slate-900 py-3 overflow-hidden shadow-inner flex items-center border-y border-amber-600">
        <div className="bg-amber-700 text-white font-bold px-4 py-1 z-10 shrink-0 text-sm md:text-base shadow-md">
          آخر الأخبار 📣
        </div>
        
        <div className="overflow-hidden whitespace-nowrap w-full relative group">
          <div className="inline-block animate-marquee group-hover:[animation-play-state:paused] space-x-12 space-x-reverse text-sm md:text-base font-semibold">
            {news.length > 0 ? (
              news.map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-2">
                  <span>🔸 {item.title || item.content}</span>
                </span>
              ))
            ) : (
              <span>مرحباً بكم في مدرسة الشروق السودانية بأسوان - يسعدنا استقبال استفساراتكم وتسجيل الطلاب للعام الدراسي الجديد.</span>
            )}
          </div>
        </div>
      </section>

      {/* 3. من نحن */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200/80">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full mb-4">
            عن المدرسة
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">من نحن</h2>
          <p className="text-slate-600 leading-relaxed text-base md:text-lg">
            مدرسة الشروق السودانية بأسوان هي صرح تعليمي وتربوي يهدف إلى تقديم أفضل المناهج التعليمية السودانية لأبنائنا الطلاب في جمهورية مصر العربية. نسعى لبناء جيل متميز أكاديمياً وأخلاقياً، وتوفير بيئة تعليمية محفزة تدعم الإبداع والتفوق تحت إشراف نخبة من أفضل الكوادر التعليمية.
          </p>
        </div>
      </section>

      {/* 4. أعضاء مجلس الإدارة (مخفي إن لم توجد بيانات مع صورة واسم) */}
      {boardMembers.length > 0 && (
        <section className="py-12 bg-slate-100 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">
              مجلس الإدارة
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {boardMembers.slice(0, 10).map((member, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-200 hover:shadow-md transition">
                  <img 
                    src={member.photo_url} 
                    alt={member.name} 
                    className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-emerald-500 mb-3"
                  />
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">{member.name}</h3>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">{member.role || member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. الطلاب المتفوقون في الشهادة الابتدائية */}
      {primaryTopStudents.length > 0 && (
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-emerald-800 mb-8">
            🏆 أوايل الشهادة الابتدائية
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {primaryTopStudents.slice(0, 5).map((student, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-emerald-100 hover:border-emerald-300 transition">
                <img 
                  src={student.photo_url} 
                  alt={student.name} 
                  className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-amber-400 mb-3"
                />
                <h3 className="font-bold text-slate-800 text-sm md:text-base">{student.name}</h3>
                <p className="text-xs text-slate-500 mt-1">النسبة: {student.score}%</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. الطلاب المتفوقون في الشهادة المتوسطة */}
      {middleTopStudents.length > 0 && (
        <section className="py-12 bg-slate-100 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-800 mb-8">
              🎓 أوائل الشهادة المتوسطة
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {middleTopStudents.slice(0, 5).map((student, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-teal-100 hover:border-teal-300 transition">
                  <img 
                    src={student.photo_url} 
                    alt={student.name} 
                    className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-teal-500 mb-3"
                  />
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">{student.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">النسبة: {student.score}%</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. الموقع وأرقام التواصل */}
      <section className="py-12 px-4 bg-emerald-950 text-emerald-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 text-center md:text-right">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">📍 موقعنا</h3>
            <p className="text-emerald-300 leading-relaxed text-sm">
              جمهورية مصر العربية - محافظة أسوان
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-3">📞 أرقام التواصل</h3>
            <p className="text-emerald-300 text-sm dir-ltr text-right">
              +20 114 916 9346
            </p>
          </div>
        </div>
      </section>

      {/* 8. الحقوق والتصميم */}
      <footer className="bg-slate-900 text-slate-400 text-center py-4 text-xs border-t border-slate-800">
        تصميم وتطوير: <span className="text-emerald-400 font-bold">أستاذ عثمان صديق</span> (01149169346)
      </footer>

      {/* نمط تحريك الشريط الإخباري */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
