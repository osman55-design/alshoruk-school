import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AccountsSection({ onBack }) {
  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments' أو 'expenses'
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [loading, setLoading] = useState(false);

  // بيانات وسجلات
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // نموذج رسوم الطلاب
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('الصف الأول');
  const [amountPaid, setAmountPaid] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // نموذج المصروفات
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('رواتب');

  useEffect(() => {
    fetchPayments();
    fetchExpenses();
  }, [academicYear]);

  // جلب المقبوضات
  const fetchPayments = async () => {
    setLoading(true);
    const { data } = await supabase.from('payments_list').select('*').order('id', { ascending: false });
    setPayments(data || []);
    setLoading(false);
  };

  // جلب المصروفات
  const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses_list').select('*').order('id', { ascending: false });
    setExpenses(data || []);
  };

  // إضافة سند قبض للطلبة
  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!studentName || !amountPaid) return alert('يرجى إدخال اسم الطالب والمبلغ المدفوع');

    const { error } = await supabase.from('payments_list').insert([
      {
        student_name: studentName.trim(),
        class_name: className,
        amount_paid: parseFloat(amountPaid) || 0,
        remaining_amount: parseFloat(remainingAmount) || 0,
        notes: paymentNotes
      }
    ]);

    if (!error) {
      alert('تم تسجيل الدفعة المالية بنجاح 💵');
      setStudentName('');
      setAmountPaid('');
      setRemainingAmount('');
      setPaymentNotes('');
      fetchPayments();
    }
  };

  // إضافة مصروف جديد
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return alert('يرجى إدخال البيان والمبلغ');

    const { error } = await supabase.from('expenses_list').insert([
      {
        title: expenseTitle.trim(),
        amount: parseFloat(expenseAmount) || 0,
        category: expenseCategory
      }
    ]);

    if (!error) {
      alert('تم تسجيل المصروف بنجاح 📝');
      setExpenseTitle('');
      setExpenseAmount('');
      fetchExpenses();
    }
  };

  // حساب الإحصائيات المالية
  const totalPaid = payments.reduce((acc, item) => acc + Number(item.amount_paid || 0), 0);
  const totalRemaining = payments.reduce((acc, item) => acc + Number(item.remaining_amount || 0), 0);
  const totalExpenses = expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const netBalance = totalPaid - totalExpenses;

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#047857', fontWeight: '900', fontSize: '22px' }}>💰 الخزينة والحسابات المالية</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>إدارة المتحصلات الدراسية والمصروفات والرواتب</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ⬅️ رجوع
          </button>
        )}
      </div>

      {/* 📊 بطاقات الإحصائيات المالية */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '24px' }}>
        <div style={cardStyle('#047857', '#ecfdf5')}>
          <span style={cardLabelStyle}>إجمالي المقبوضات 💵</span>
          <h3 style={cardValueStyle}>{totalPaid.toLocaleString()}</h3>
        </div>
        <div style={cardStyle('#dc2626', '#fef2f2')}>
          <span style={cardLabelStyle}>المبالغ المتبقية (ديون) ⏳</span>
          <h3 style={cardValueStyle}>{totalRemaining.toLocaleString()}</h3>
        </div>
        <div style={cardStyle('#d97706', '#fffbeb')}>
          <span style={cardLabelStyle}>إجمالي المصروفات 📉</span>
          <h3 style={cardValueStyle}>{totalExpenses.toLocaleString()}</h3>
        </div>
        <div style={cardStyle(netBalance >= 0 ? '#2563eb' : '#dc2626', '#eff6ff')}>
          <span style={cardLabelStyle}>صافي الخزينة 🏦</span>
          <h3 style={cardValueStyle}>{netBalance.toLocaleString()}</h3>
        </div>
      </div>

      {/* أزرار التبديل الفرعية */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveSubTab('payments')} style={tabBtnStyle(activeSubTab === 'payments')}>
          📥 متحصلات الطلاب والرسوم
        </button>
        <button onClick={() => setActiveSubTab('expenses')} style={tabBtnStyle(activeSubTab === 'expenses')}>
          📤 المصروفات والرواتب
        </button>
      </div>

      {/* 1️⃣ تبويب المقبوضات والرسوم */}
      {activeSubTab === 'payments' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '20px' }}>
          
          <form onSubmit={handleAddPayment} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a' }}>➕ تسجيل دفعة طالب</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>اسم الطالب:</label>
              <input type="text" placeholder="اسم الطالب..." value={studentName} onChange={e => setStudentName(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>الفصل الدراسي:</label>
              <select value={className} onChange={e => setClassName(e.target.value)} style={inputStyle}>
                <option value="الصف الأول">الصف الأول</option>
                <option value="الصف الثاني">الصف الثاني</option>
                <option value="الصف الثالث">الصف الثالث</option>
                <option value="الصف الرابع">الصف الرابع</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>المبلغ المدفوع:</label>
              <input type="number" placeholder="0.00" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>المبلغ المتبقي:</label>
              <input type="number" placeholder="0.00" value={remainingAmount} onChange={e => setRemainingAmount(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>ملاحظات / البيان:</label>
              <input type="text" placeholder="مثال: القسط الأول" value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} style={inputStyle} />
            </div>

            <button type="submit" style={{ width: '100%', padding: '11px', backgroundColor: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              حفظ السند 💾
            </button>
          </form>

          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}>
                  <th style={thStyle}>الطالب</th>
                  <th style={thStyle}>الفصل</th>
                  <th style={thStyle}>المدفوع</th>
                  <th style={thStyle}>المتبقي</th>
                  <th style={thStyle}>البيان</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{row.student_name}</td>
                    <td style={tdStyle}>{row.class_name}</td>
                    <td style={{ ...tdStyle, color: '#047857', fontWeight: 'bold' }}>{row.amount_paid}</td>
                    <td style={{ ...tdStyle, color: '#dc2626', fontWeight: 'bold' }}>{row.remaining_amount}</td>
                    <td style={tdStyle}>{row.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        /* 2️⃣ تبويب المصروفات */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '20px' }}>
          
          <form onSubmit={handleAddExpense} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a' }}>➕ تسجيل مصروف جديد</h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>نوع المصروف:</label>
              <select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)} style={inputStyle}>
                <option value="رواتب">رواتب الكادر</option>
                <option value="صيانة">صيانة وتشغيل</option>
                <option value="مستلزمات">مستلزمات مكتبية</option>
                <option value="خدمات">كهرباء وماء وإنترنت</option>
                <option value="أخرى">مصروفات أخرى</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>بيان المصروف:</label>
              <input type="text" placeholder="مثال: راتب الأستاذ أحمد" value={expenseTitle} onChange={e => setExpenseTitle(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>المبلغ:</label>
              <input type="number" placeholder="0.00" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} style={inputStyle} required />
            </div>

            <button type="submit" style={{ width: '100%', padding: '11px', backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              تسجيل المصروف 📉
            </button>
          </form>

          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: '13px' }}>
                  <th style={thStyle}>البيان</th>
                  <th style={thStyle}>التصنيف</th>
                  <th style={thStyle}>المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{row.title}</td>
                    <td style={tdStyle}>{row.category}</td>
                    <td style={{ ...tdStyle, color: '#dc2626', fontWeight: 'bold' }}>{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}

// التنسيقات
const cardStyle = (color, bg) => ({
  backgroundColor: bg,
  padding: '16px',
  borderRadius: '14px',
  border: `1px solid ${color}30`
});
const cardLabelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#475569' };
const cardValueStyle = { margin: '8px 0 0 0', fontSize: '20px', fontWeight: '900', color: '#0f172a' };
const tabBtnStyle = (active) => ({
  padding: '10px 18px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: active ? '#047857' : '#e2e8f0',
  color: active ? '#ffffff' : '#475569',
  fontWeight: 'bold',
  cursor: 'pointer'
});
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' };
const thStyle = { padding: '12px 14px' };
const tdStyle = { padding: '12px 14px', fontSize: '13.5px' };
