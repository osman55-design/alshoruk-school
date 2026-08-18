import React, { useState, useEffect } from 'react';
// استيراد دالة جلب الحركات المالية المعتمدة في مشروعك لفلترة المصاريف
import { getAllTransactions } from '../db';

export default function PayrollSection({ teachers, onSaveTransaction, onBack }) {
  // حالات إدارة نماذج الإدخال
  const [expenseType, setExpenseType] = useState('payroll'); // payroll أو general
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('أكتوبر'); // الشهر الافتراضي للرواتب
  const [generalDescription, setGeneralDescription] = useState('');
  
  // حالة عرض قائمة المصروفات السابقة
  const [expenseHistory, setExpenseHistory] = useState([]);

  // أشهر السنة للاختيار السريع عند صرف الرواتب
  const monthsList = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  // جلب حركات الصرف السابقة عند تحميل الواجهة
  useEffect(() => {
    loadExpenseHistory();
  }, []);

  const loadExpenseHistory = async () => {
    try {
      const txs = await getAllTransactions() || [];
      // فلترة الحركات التي نوعها "صرف" فقط لعرضها في الجدول
      const expensesOnly = txs.filter(tx => tx.type === 'صرف');
      setExpenseHistory(expensesOnly);
    } catch (error) {
      console.error("خطأ في جلب سجل المصروفات والرواتب:", error);
    }
  };

  // دالة معالجة الإدخال وحفظ السند في قاعدة البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert("الرجاء إدخال مبلغ صحيح أكبر من الصفر");
      return;
    }

    let targetId = null;
    let targetName = "مصروفات عامة";
    let statement = "";

    if (expenseType === 'payroll') {
      if (!selectedTeacherId) {
        alert("الرجاء اختيار المعلم/الموظف المستحق للراتب");
        return;
      }
      const teacher = teachers.find(t => String(t.id) === String(selectedTeacherId));
      targetId = selectedTeacherId;
      targetName = teacher ? teacher.name : "معلم";
      statement = `صرف راتب شهر [${month}]`;
    } else {
      if (!generalDescription.trim()) {
        alert("الرجاء كتابة وصف أو بيان للمصروف العام");
        return;
      }
      statement = generalDescription;
    }

    // استدعاء دالة الحفظ الرئيسية الممررة من AccountsSection لتحديث السيولة النقدية تلقائياً
    await onSaveTransaction(e, 'صرف', targetId, targetName, amount, statement);
    
    // تفريغ الحقول وإعادة تحديث الجدول التاريخي
    setAmount('');
    setSelectedTeacherId('');
    setGeneralDescription('');
    loadExpenseHistory();
  };

  // التنسيقات والأنماط البرمجية للواجهة
  const styles = {
    container: { padding: '20px', fontFamily: 'Arial', direction: 'rtl', backgroundColor: '#f9fafb', minHeight: '100vh' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    backBtn: { backgroundColor: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: '30px' },
    tabRow: { display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' },
    tabBtn: (active) => ({ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: active ? '#d97706' : '#e5e7eb', color: active ? '#fff' : '#4b5563' }),
    formGroup: { marginBottom: '16px', textAlign: 'right' },
    label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4b5563' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px', textAlign: 'right' },
    submitBtn: { width: '100%', backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      {/* شريط العنوان وزر الرجوع الخفي عند الطباعة */}
      <div style={styles.headerRow} className="no-print">
        <h2 style={{ color: '#d97706', margin: 0 }}>💵 إدارة المصروفات والرواتب العامة</h2>
        <button onClick={onBack} style={styles.backBtn}>↩ رجوع للقائمة الحسابية</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
        
        {/* النصف الأول: نموذج إدخال وإضافة مصروف/راتب جديد */}
        <div style={styles.card} className="no-print">
          <div style={styles.tabRow}>
            <button type="button" style={styles.tabBtn(expenseType === 'payroll')} onClick={() => setExpenseType('payroll')}>💳 صرف راتب موظف/معلم</button>
            <button type="button" style={styles.tabBtn(expenseType === 'general')} onClick={() => setExpenseType('general')}>🧾 تسديد مصروفات عامة</button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* في حالة اختيار صرف راتب معلم */}
            {expenseType === 'payroll' ? (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>اختر المعلم / المستحق</label>
                  <select style={styles.input} value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} required>
                    <option value="">-- حدد الموظف من القائمة --</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>عن شهر</label>
                  <select style={styles.input} value={month} onChange={(e) => setMonth(e.target.value)}>
                    {monthsList.map((m, index) => (
                      <option key={index} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              /* في حالة اختيار مصروف عام للمدرسة */
              <div style={styles.formGroup}>
                <label style={styles.label}>البيان / وصف المصروف</label>
                <input 
                  type="text" 
                  placeholder="مثال: فاتورة كهرباء شهر يوليو / أدوات صيانة مكاتب" 
                  style={styles.input} 
                  value={generalDescription} 
                  onChange={(e) => setGeneralDescription(e.target.value)} 
                  required 
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>المبلغ المستحق الصرف (جنيه)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                style={styles.input} 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" style={styles.styles || styles.submitBtn}>
              {expenseType === 'payroll' ? 'تأكيد وصرف الراتب 💳' : 'تأكيد واعتماد سداد المصروف 🧾'}
            </button>
          </form>
        </div>

        {/* النصف الثاني: جدول مراجعة السجلات التاريخية للمصروفات والرواتب المدفوعة */}
        <div style={styles.card}>
          <h3 style={{ color: '#1f2937', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '10px' }}>📋 سجلات حركة الصرف والمخرجات الحالية</h3>
          <div style={{ overflowX: 'auto' }}>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', borderColor: '#e5e7eb' }}>
              <thead style={{ background: '#f8f9fa', color: '#4b5563' }}>
                <tr>
                  <th>التاريخ</th>
                  <th>الجهة / المستفيد</th>
                  <th>البيان والسبب</th>
                  <th>المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {expenseHistory.length > 0 ? expenseHistory.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td>{item.date}</td>
                    <td>{item.targetName || 'مصروف عام'}</td>
                    <td style={{ textAlign: 'right' }}>{item.statement}</td>
                    <td style={{ color: '#dc2626', fontWeight: 'bold' }}>{item.amount.toLocaleString()} ج</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', color: '#9ca3af' }}>لا توجد رواتب أو مصروفات مسجلة بالخزينة حتى الآن.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
