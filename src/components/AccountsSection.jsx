import React, { useState, useEffect } from 'react';
import { getAllStudents, getAllTeachers, addTransaction, getAllTransactions } from '../db'; 
import QuickInputsSection from './QuickInputsSection';
import TuitionSection from './TuitionSection';
import PayrollSection from './PayrollSection'; 
import FinancialDashboard from './FinancialDashboard'; // البنفسجي
import FinancialReports from './FinancialReports'; // الأحمر

export default function AccountsSection() {
  const [active, setActive] = useState('main');
  const [data, setData] = useState({ students: [], teachers: [], txs: [], balance: 10000 });
  const [form, setForm] = useState({ id: '', amount: '', note: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t, tx] = await Promise.all([getAllStudents(), getAllTeachers(), getAllTransactions()]);
        let bal = 10000;
        (tx || []).forEach(x => bal += x.type === 'قبض' ? x.amount : -x.amount);
        setData({ students: s || [], teachers: t || [], txs: tx || [], balance: bal });
      } catch (e) { console.error(e); }
    };
    load();
  }, [active]);

  const save = async (e, type, customId = null, customName = '', customAmount = null, customNote = '') => {
    if(e) e.preventDefault();
    const targetId = customId || form.id;
    const amountVal = customAmount || form.amount;
    const noteVal = customNote || form.note;
    if (!amountVal) return;
    const isGet = type === 'قبض';
    const list = isGet ? data.students : data.teachers;
    const item = list.find(x => String(x.id) === String(targetId));
    
    const newTx = {
      type, targetId: targetId || null,
      targetName: customName || (item ? item.name : (isGet ? '' : 'مصروفات عامة')),
      amount: parseFloat(amountVal),
      statement: noteVal || (isGet ? 'تحصيل رسوم' : 'مصروفات فواتير'),
      date: new Date().toLocaleDateString('ar-EG')
    };

    try {
      await addTransaction(newTx);
      alert('تم الحفظ بنجاح!');
      setForm({ id: '', amount: '', note: '' });
      setActive('main');
    } catch (err) { alert('فشل الحفظ'); }
  };

  const btnSt = (c) => ({ backgroundColor: c, color: '#fff', border: 'none', borderRadius: '12px', padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minHeight: '150px', justifyContent: 'center' });

  if (active === 'quick-inputs') return <QuickInputsSection students={data.students} teachers={data.teachers} balance={data.balance} form={form} setForm={setForm} onSave={(e) => save(e, 'قبض')} onBack={() => setActive('main')} />;
  if (active === 'tuition') return <TuitionSection students={data.students} txs={data.txs} onBack={() => setActive('main')} />;
  if (active === 'payroll') return <PayrollSection teachers={data.teachers} txs={data.txs} onSaveTransaction={save} onBack={() => setActive('main')} />;
  
  // شاشة الزر البنفسجي (لوحة التحكم بالأرباح)
  if (active === 'dashboard') {
    return (
      <div>
        <button onClick={() => setActive('main')} style={{ margin: '15px', padding: '8px 16px', cursor: 'pointer' }}>↩ رجوع</button>
        <FinancialDashboard />
      </div>
    );
  }

  // شاشة الزر الأحمر (التقرير المالي والجدول والطباعة)
  if (active === 'reports') {
    return (
      <div>
        <button onClick={() => setActive('main')} style={{ margin: '15px', padding: '8px 16px', cursor: 'pointer' }}>↩ رجوع</button>
        <FinancialReports />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'Arial', direction: 'rtl', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '25px', padding: '15px', background: '#fff', borderRadius: '12px', maxWidth: '400px', margin: '0 auto 25px auto', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#4b5563' }}>💰 إجمالي السيولة النقدية الحالية</h4>
        <h2 style={{ margin: '0', color: '#16a34a' }}>{data.balance.toLocaleString()} جنيه</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
        <button onClick={() => setActive('quick-inputs')} style={btnSt('#2563eb')}><b>⚡ شاشات الإدخال السريع</b><small>(سندات فورية)</small></button>
        <button onClick={() => setActive('tuition')} style={btnSt('#059669')}><b>🎓 إدارة الرسوم الدراسية</b><small>(مصاريف الطلاب)</small></button>
        <button onClick={() => setActive('payroll')} style={btnSt('#d97706')}><b>💵 إدارة المصروفات والرواتب</b><small>(المرتبات والفواتير)</small></button>
        {/* ربط الزر البنفسجي بـ dashboard */}
        <button onClick={() => setActive('dashboard')} style={btnSt('#7c3aed')}><b>📊 واجهة لوحة التحكم المالية</b><small>(الأرباح والخزينة)</small></button>
        {/* ربط الزر الأحمر بـ reports */}
        <button onClick={() => setActive('reports')} style={btnSt('#e11d48')}><b>📝 التقارير المالية</b><small>(طباعة الكشوفات)</small></button>
      </div>
    </div>
  );
}
