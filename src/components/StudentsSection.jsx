import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function StudentsSection({ onBack }) {
  // --- حالة نموذج إضافة طالب جديد ---
  const [fullName, setFullName] = useState('');
  const [stage, setStage] = useState('المرحلة الثانوية');
  const [grade, setGrade] = useState('الصف الأول الثانوي');
  const [gender, setGender] = useState('طالب'); // نوع الطالب (طالب / طالبة)
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fees, setFees] = useState(0);
  const [saving, setSaving] = useState(false);

  // --- حالة الاستعلام وتصفية الطلاب ---
  const [searchStage, setSearchStage] = useState('المرحلة الثانوية');
  const [searchGrade, setSearchGrade] = useState('الصف الأول الثانوي');
  const [searchGender, setSearchGender] = useState('الكل');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  // قوائم المراحل والصفوف
  const stagesList = ['الروضة', 'المرحلة الابتدائية', 'المرحلة المتوسطة', 'المرحلة الثانوية'];
  const gradesByStage = {
    'الروضة': ['روضة أولى', 'روضة ثانية', 'تمهيدي'],
    'المرحلة الابتدائية': ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المرحلة المتوسطة': ['الصف الأول المتوسط', 'الصف الثاني المتوسط', 'الصف الثالث المتوسط'],
    'المرحلة الثانوية': ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']
  };

  // حفظ طالب جديد
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
        alert('تم حفظ الطالب بنجاح في الفصل المحدد!');
        // تفريغ النموذج بدون إظهار أي بيانات في الصفحة
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

  // الاستعلام عن الطلاب من الفصل
  const handleSearchStudents = async () => {
    setSearching(true);
    setHasSearched(true);
    try {
      let query = supabase
        .from('students')
        .select('*')
        .eq('stage', searchStage)
        .eq('grade', searchGrade);

      if (searchGender !== 'الكل') {
        query = query.eq('gender', searchGender);
      }

      const { data, error } = await query;

      if (error) {
        alert('حدث خطأ أثناء الاستعلام: ' + error.message);
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl' }}>
      
      {/* الشريط العلوي */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '18px' }}>📝 بوابة تسجل واستعلام الطلاب</h3>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>تسجيل جديد وحفظ في الفصول، أو استعلام مباشر عن الطلاب</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>↩️ عودة للوحة التحكم</button>
        )}
      </div>

      {/* 1. قسم إضافة طالب جديد */}
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#047857', fontSize: '16px', fontWeight: 'bold' }}>✍️ إضافة طالب جديد وإسناده للفصل</h4>
        
        <form onSubmit={handleSaveStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div>
            <label style={labelStyle}>اسم الطالب بالكامل:</label>
            <input type="text" placeholder="مثال: علي محمد أحمد" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>المرحلة الدراسية:</label>
            <select value={stage} onChange={e => { setStage(e.target.value); setGrade(gradesByStage[e.target.value][0]); }} style={inputStyle}>
              {stagesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>الصف / الفصل الدراسية:</label>
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

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
              {saving ? 'جاري الحفظ...' : '💾 حفظ الطالب في الفصل'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. قسم الاستعلام بحسب المرحلة والفصل والنوع */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#0284c7', fontSize: '16px', fontWeight: 'bold' }}>🔍 الاستعلام واستعراض بيانات الطلاب من الفصول</h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>اختر المرحلة:</label>
            <select value={searchStage} onChange={e => { setSearchStage(e.target.value); setSearchGrade(gradesByStage[e.target.value][0]); }} style={inputStyle}>
              {stagesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>اختر الفصل / الصف:</label>
            <select value={searchGrade} onChange={e => setSearchGrade(e.target.value)} style={inputStyle}>
              {gradesByStage[searchStage]?.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>اختر النوع:</label>
            <select value={searchGender} onChange={e => setSearchGender(e.target.value)} style={inputStyle}>
              <option value="الكل">الكل (طلاب وطالبات)</option>
              <option value="طالب">👦 طلاب فقط</option>
              <option value="طالبة">👧 طالبات فقط</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={handleSearchStudents} disabled={searching} style={{ width: '100%', padding: '9px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
              {searching ? 'جاري الاستعلام...' : '🔍 عرض الطلاب'}
            </button>
          </div>
        </div>

        {/* عرض نتائج الاستعلام */}
        {hasSearched && (
          <div>
            <h5 style={{ margin: '15px 0 10px 0', fontSize: '13px', color: '#334155' }}>
              نتائج الاستعلام عن: <b style={{ color: '#047857' }}>{searchStage}</b> - <b style={{ color: '#0284c7' }}>{searchGrade}</b> ({searchResults.length} طالب)
            </h5>

            {searchResults.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', margin: '20px 0' }}>لا يوجد طلاب مسجلون بحسب معايير البحث المختارة.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'right' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', color: '#334155', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>اسم الطالب</th>
                      <th style={thStyle}>النوع</th>
                      <th style={thStyle}>رقم الهاتف</th>
                      <th style={thStyle}>العنوان</th>
                      <th style={thStyle}>الرسوم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((st, idx) => (
                      <tr key={st.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{st.full_name}</td>
                        <td style={tdStyle}>{st.gender === 'طالبة' ? '👧 طالبة' : '👦 طالب'}</td>
                        <td style={tdStyle}>{st.phone}</td>
                        <td style={tdStyle}>{st.address || '-'}</td>
                        <td style={tdStyle}>{st.fees}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '4px', display: 'block' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' };
const thStyle = { padding: '8px 10px', fontWeight: 'bold' };
const tdStyle = { padding: '8px 10px', color: '#1e293b' };
