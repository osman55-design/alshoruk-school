import React from 'react';

export default function QuickInputsSection({ students, teachers, balance, form, setForm, onSave, onBack }) {
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '12px', boxSizing: 'border-box', textAlign: 'right' };
  const cardStyle = { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', textAlign: 'right' };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', direction: 'rtl' }}>
      <button onClick={onBack} style={{ float: 'right', padding: '8px 16px', cursor: 'pointer' }}>↩ رجوع</button>
      <h3 style={{ textAlign: 'right', clear: 'both' }}>⚡ الإدخال السريع (الخزينة الحالية: {balance} جنيه)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* صندوق سند القبض */}
        <div style={cardStyle}>
          <h4 style={{ color: '#059669' }}>سند قبض (+)</h4>
          <form onSubmit={(e) => onSave(e, 'قبض')}>
            <select style={inputStyle} value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} required>
              <option value="">-- اختر الطالب --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="number" placeholder="المبلغ" style={inputStyle} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
            <input type="text" placeholder="البيان" style={inputStyle} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>حفظ القبض</button>
          </form>
        </div>

        {/* صندوق سند الصرف */}
        <div style={cardStyle}>
          <h4 style={{ color: '#dc2626' }}>سند صرف (-)</h4>
          <form onSubmit={(e) => onSave(e, 'صرف')}>
            <select style={inputStyle} value={form.id} onChange={e => setForm({ ...form, id: e.target.value })}>
              <option value="">-- مصروفات مدرسة عامة --</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input type="number" placeholder="المبلغ" style={inputStyle} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
            <input type="text" placeholder="البيان" style={inputStyle} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} required />
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>حفظ الصرف</button>
          </form>
        </div>

      </div>
    </div>
  );
}
