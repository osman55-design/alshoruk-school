import React, { useState, useEffect } from 'react';
// استيراد قاعدة البيانات المركزية الجديدة
import { db } from '../db'; 
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
        // جلب البيانات مباشرة من تبويبات سحابة جوجل (الطلاب، المعلمين، الحسابات)
        const [s, t, tx] = await Promise.all([
          db.getData("الطلاب"), 
          db.getData("المعلمين"), 
          db.getData("الحسابات")
        ]);

        let bal = 10000; // السيولة الافتراضية المحددة في كودك الأصلي
        (tx || []).forEach(x => {
          // حساب العمليات السحابية بناءً على نوع الحركة (قبض / صرف)
          const amountNum = parseFloat(x.amount) || 0;
          bal += x.type === 'قبض' ? amountNum : -amountNum;
        });

        setData({ students: s || [], teachers: t || [], txs: tx || [], balance: bal });
      } catch (e) { 
        console.error("خطأ سحابي في جلب الحسابات:", e); 
      }
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
    
    // تجهيز السند المالي لحفظه في السحابة ومطابقة الحقول
    const newTx = {
      type, 
      targetId: targetId || null,
      targetName: customName || (item ? item.name : (isGet ? '' : 'مصروفات عامة')),
      amount: parseFloat(amountVal),
      statement: noteVal || (isGet ? 'تحصيل رسوم' : 'مصروفات فواتير'),
      date: new Date().toLocaleDateString('ar-EG')
    };

    try {
      // حفظ السند المالي فوراً في تبويب "الحسابات" داخل جدول جوجل
      await db.insertData("الحسابات", newTx);
      alert('✅ تم الحفظ وتوثيق السند المالي في سحابة جوجل بنجاح!');
      setForm({ id: '', amount: '', note: '' });
      setActive('main');
    } catch (err) { 
      alert('❌ فشل الحفظ في السحابة، يرجى محاولة فتح العملية مجدداً'); 
    }
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
