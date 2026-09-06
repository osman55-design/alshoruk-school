import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminSystem({ onBack }) {
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(false);

  const [aboutUs, setAboutUs] = useState('');
  const [ourGoals, setOurGoals] = useState('');
  const [latestNews, setLatestNews] = useState('');

  useEffect(() => {
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    try {
      const { data } = await supabase.from('site_content').select('*').single();
      if (data) {
        setAboutUs(data.about_us || '');
        setOurGoals(data.our_goals || '');
        setLatestNews(data.latest_news || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('site_content').upsert({
      id: 1,
      about_us: aboutUs,
      our_goals: ourGoals,
      latest_news: latestNews
    });
    setLoading(false);
    if (!error) {
      alert('تم تحديث محتوى الصفحة الرئيسية بنجاح!');
    } else {
      alert('حدث خطأ أثناء الحفظ: ' + error.message);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0, color: '#047857' }}>⚙️ لوحة الإدارة العليا (عثمان)</h2>
        <button onClick={onBack} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>↩️ عودة للوحة التحكم</button>
      </div>

      <form onSubmit={handleSaveContent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>📢 شريط الأخبار العاجلة:</label>
          <input type="text" value={latestNews} onChange={e => setLatestNews(e.target.value)} placeholder="أدخل الأخبار المباشرة هنا..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>🏫 نبذة عن المدرسة (من نحن):</label>
          <textarea rows="4" value={aboutUs} onChange={e => setAboutUs(e.target.value)} placeholder="اكتبي التفاصيل هنا..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>🎯 رؤية وأهداف المدرسة:</label>
          <textarea rows="4" value={ourGoals} onChange={e => setOurGoals(e.target.value)} placeholder="اكتبي الأهداف هنا..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" disabled={loading} style={{ background: '#047857', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
          {loading ? 'جاري الحفظ...' : '💾 حفظ وتحديث الصفحة الرئيسية فوراً'}
        </button>
      </form>
    </div>
  );
}
