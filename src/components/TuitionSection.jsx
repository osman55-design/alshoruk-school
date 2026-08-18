import React, { useState } from 'react';

export default function TuitionSection({ students, txs, onBack }) {
  // الحالات الافتراضية للبحث والتصفية
  const [selectedClass, setSelectedClass] = useState('');
  const [searchName, setSearchName] = useState('');

  // قائمة خيارات المراحل الدراسية المنظمة
  const classOptions = [
    { group: "المرحلة الابتدائية", items: ["الأول ابتدائي", "الثاني ابتدائي", "الثالث ابتدائي", "الرابع ابتدائي", "الخامس ابتدائي", "السادس ابتدائي"] },
    { group: "المرحلة المتوسطة", items: ["الأول متوسط", "الثاني متوسط", "الثالث متوسط"] },
    { group: "المرحلة الثانوية", items: ["الأول ثانوي", "الثاني ثانوي", "الثالث ثانوي"] }
  ];

  // التصفية الذكية: لن يعرض أي طالب في البداية إلا إذا تم اختيار فصل أو كُتب اسم في البحث
  const filtered = (students || []).filter(s => {
    if (!selectedClass && !searchName) return false; // إخفاء الجميع تماماً في البداية
    if (selectedClass && (s.class || '') !== selectedClass) return false;
    if (searchName && s.name && !s.name.includes(searchName)) return false;
    return true;
  });

  // الدالة الحسابية الذكية للرسوم
  const getFin = (id) => {
    const paid = (txs || []).filter(x => x.type === 'قبض' && String(x.targetId) === String(id)).reduce((sum, x) => sum + x.amount, 0);
    return { total: 5000, paid, rem: 5000 - paid };
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', direction: 'rtl' }}>
      
      {/* شريط الأزرار والتحكم العلوي */}
      <div className="no-print" style={{ marginBottom: '15px' }}>
        <button onClick={onBack} style={{ float: 'right', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#4b5563', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>↩ رجوع</button>
        
        {filtered.length > 0 && (
          <div style={{ float: 'left', display: 'flex', gap: '10px' }}>
            <button onClick={() => window.print()} style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ طباعة الفصل</button>
            <button onClick={() => {
              const headers = ['اسم الطالب', 'الجنس', 'الفصل', 'إجمالي الرسوم', 'المدفوع', 'المتبقي'];
              const rows = filtered.map(s => [s.name, s.gender, s.class, getFin(s.id).total, getFin(s.id).paid, getFin(s.id).rem]);
              const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
              const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "كشف_رسوم_الطلاب.csv");
              document.body.appendChild(link); link.click(); document.body.removeChild(link);
            }} style={{ background: '#16a34a', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📊 تصدير Excel</button>
          </div>
        )}
      </div>

      <h3 style={{ textAlign: 'right', clear: 'both', color: '#059669', marginBottom: '20px' }}>🎓 إدارة الرسوم الدراسية وحسابات الطلاب</h3>
      
      {/* أدوات البحث والتصفية */}
      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', flex: 1 }} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          <option value="">-- اختر الفصل الدراسي لعرض الطلاب --</option>
          {classOptions.map(g => (
            <optgroup key={g.group} label={g.group}>
              {g.items.map(i => <option key={i} value={i}>{i}</option>)}
            </optgroup>
          ))}
        </select>
        <input type="text" placeholder="🔍 ابحث عن اسم الطالب..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', flex: 2, textAlign: 'right' }} value={searchName} onChange={e => setSearchName(e.target.value)} />
      </div>

      {/* الجدول الرئيسي للبيانات */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: '#059669', color: '#fff' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>اسم الطالب</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>الجنس</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>الفصل الدراسي</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>إجمالي الرسوم</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>المبلغ المدفوع</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>المبلغ المتبقي</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>حالة السداد</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(s => {
              const fin = getFin(s.id);
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>{s.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{s.gender === 'ذكور' ? '👦 بنين' : '👧 بنات'}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{s.class || 'غير محدد'}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{fin.total} جنيه</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', color: '#059669', fontWeight: 'bold' }}>{fin.paid} جنيه</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', color: '#dc2626', fontWeight: 'bold' }}>{fin.rem} جنيه</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: fin.rem <= 0 ? '#e6f4ea' : '#fce8e6', color: fin.rem <= 0 ? '#137333' : '#c5221f' }}>
                      {fin.rem <= 0 ? 'مسدد بالكامل' : 'متبقي مستحقات'}
                    </span>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" style={{ padding: '30px', color: '#888', fontStyle: 'italic' }}>
                  الرجاء اختيار الفصل الدراسي أو البحث عن اسم الطالب لعرض البيانات المادية وحالات السداد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
