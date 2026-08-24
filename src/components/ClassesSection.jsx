import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ClassDistributionSection({ onBack, currentUser }) {
  const [supervisors, setSupervisors] = useState([]);
  
  // خريطة المراحل التعليمية
  const allStagesMap = {
    'الروضة': 'الروضة',
    'الابتدائية': 'الابتدائية',
    'المتوسطة': 'المتوسطة',
    'الثانوية': 'الثانوية'
  };

  // تحديد المراحل المتاحة حسب صلاحيات المستخدم الحالي
  const userAllowedStage = currentUser?.allowed_stage || 'الكل';
  
  const getAvailableStages = () => {
    if (userAllowedStage === 'الكل' || !userAllowedStage) {
      return ['الروضة', 'الابتدائية', 'المتوسطة', 'الثانوية'];
    }
    if (userAllowedStage.includes('روضة') || userAllowedStage.includes('الروضة')) return ['الروضة'];
    if (userAllowedStage.includes('ابتدائ')) return ['الابتدائية'];
    if (userAllowedStage.includes('متوسط')) return ['المتوسطة'];
    if (userAllowedStage.includes('ثانو')) return ['الثانوية'];
    return ['الابتدائية'];
  };

  const availableStages = getAvailableStages();

  const [selectedLevel, setSelectedLevel] = useState(availableStages[0] || 'الابتدائية');
  const [selectedGrade, setSelectedGrade] = useState('الكل');
  const [selectedGender, setSelectedGender] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const gradesByLevel = {
    'الروضة': ['الكل', 'روضة أولى', 'روضة ثانية', 'تمهيدي'],
    'الابتدائية': ['الكل', 'الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المتوسطة': ['الكل', 'الصف الأول المتوسط', 'الصف الثاني المتوسط', 'الصف الثالث المتوسط'],
    'الثانوية': ['الكل', 'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']
  };

  // جلب البيانات من جدول class_supervisors
  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_supervisors')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setSupervisors(data);
    } catch (err) {
      console.error("خطأ جلب بيانات المشرفين:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setSelectedGrade('الكل');
  };

  // تصفية البيانات بحسب الأعمدة الحقيقية للجدول
  const filteredSupervisors = supervisors.filter(item => {
    const assigned = item.assigned_class || '';
    
    const matchesLevel = assigned.includes(selectedLevel);
    const matchesGrade = selectedGrade === 'الكل' || assigned.includes(selectedGrade);
    const matchesGender = selectedGender === 'الكل' || 
      (selectedGender === 'ذكر' ? (item.gender === 'ذكر' || item.gender === 'بنين') : (item.gender === 'أنثى' || item.gender === 'بنات'));
    
    const matchesSearch = 
      (item.name && item.name.includes(searchTerm)) ||
      (item.phone && item.phone.includes(searchTerm)) ||
      assigned.includes(searchTerm);

    return matchesLevel && matchesGrade && matchesGender && matchesSearch;
  });

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div>
          <h2 style={titleStyle}><span>🏛️</span> مراقبة وفرز توزيع الصفوف والمشرفين</h2>
          <p style={subtitleStyle}>إدارة الفرز التلقائي لجدول class_supervisors بناءً على الصلاحيات</p>
        </div>
        {onBack && <button onClick={onBack} style={glassBtnSecondary}>↩️ العودة</button>}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* أزرار اختيار المرحلة (المسموح بها فقط) */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {availableStages.map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              style={{
                ...levelTabStyle,
                backgroundColor: selectedLevel === lvl ? 'rgba(13, 148, 136, 0.85)' : 'rgba(255, 255, 255, 0.6)',
                color: selectedLevel === lvl ? '#ffffff' : '#334155'
              }}
            >
              المرحلة {lvl}
            </button>
          ))}
        </div>

        {/* أدوات الفلترة والعداد */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={glassCardStyle}>
            <label style={labelStyle}>🔎 تصفية حسب الصف المسند (assigned_class):</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              {gradesByLevel[selectedLevel]?.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  style={{
                    ...chipButtonStyle,
                    backgroundColor: selectedGrade === g ? '#0f766e' : 'rgba(241, 245, 249, 0.8)',
                    color: selectedGrade === g ? '#ffffff' : '#334155'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={counterGlassCardStyle}>
            <span style={{ fontSize: '15px', fontWeight: '700' }}>📊 عدد المشرفين / الصفوف</span>
            <div style={{ fontSize: '46px', fontWeight: '900', margin: '8px 0' }}>
              {filteredSupervisors.length}
            </div>
            <div style={badgeDetailStyle}>{selectedLevel} - {selectedGrade}</div>
          </div>
        </div>

        {/* البحث والجدول */}
        <input 
          type="text" 
          placeholder="🔍 ابحث بالاسم، الصف، أو رقم الهاتف..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />

        <div style={tableWrapperStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={tableHeaderStyle}>
                <th style={thStyle}>الاسم / المعرف</th>
                <th style={thStyle}>الصف/المرحلة المسندة (assigned_class)</th>
                <th style={thStyle}>النوع (gender)</th>
                <th style={thStyle}>رقم الهاتف (phone)</th>
                <th style={thStyle}>تاريخ الإضافة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>جاري تحميل البيانات...</td></tr>
              ) : filteredSupervisors.length > 0 ? (
                filteredSupervisors.map((item) => (
                  <tr key={item.id} style={tableRowStyle}>
                    <td style={{ ...tdStyle, fontWeight: '700' }}>{item.name || `مشرف #${item.id}`}</td>
                    <td style={{ ...tdStyle, color: '#0f766e', fontWeight: '700' }}>{item.assigned_class || 'غير مسند'}</td>
                    <td style={tdStyle}>{item.gender || '---'}</td>
                    <td style={tdStyle}>{item.phone || '---'}</td>
                    <td style={tdStyle}>{item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : '---'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>لا توجد بيانات تطابق الفلترة الحالية.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// الأنماط التجميلية الزجاجية
const containerStyle = { direction: 'rtl', padding: '30px 20px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' };
const headerContainerStyle = { maxWidth: '1200px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle = { margin: 0, color: '#0f172a', fontSize: '22px' };
const subtitleStyle = { margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' };
const glassCardStyle = { backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' };
const counterGlassCardStyle = { ...glassCardStyle, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', textAlign: 'center' };
const badgeDetailStyle = { fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px' };
const levelTabStyle = { padding: '10px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', border: 'none' };
const chipButtonStyle = { padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: '1px solid #cbd5e1' };
const searchInputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '100%', outline: 'none' };
const glassBtnSecondary = { padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', cursor: 'pointer' };
const tableWrapperStyle = { backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' };
const tableHeaderStyle = { backgroundColor: '#0f766e', color: '#fff' };
const tableRowStyle = { borderBottom: '1px solid #f1f5f9' };
const labelStyle = { fontSize: '13px', fontWeight: '700', color: '#475569' };
const thStyle = { padding: '14px' };
const tdStyle = { padding: '12px 14px', fontSize: '14px' };
