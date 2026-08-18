import React, { useState, useEffect } from 'react';
// الاستيراد الشامل لضمان قراءة قاعدة البيانات مهما كانت طريقة تصديرها
import * as dbModule from '../db'; 

// تحديد كائن قاعدة البيانات الصحيح برمجياً
const db = dbModule.db || dbModule.default || dbModule;

export default function QuickInputs({ onBack }) {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  const [receiptStudentId, setReceiptStudentId] = useState('');
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptStatement, setReceiptStatement] = useState('');

  const [paymentTeacherId, setPaymentTeacherId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentStatement, setPaymentStatement] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (db && db.students) {
          const localStudents = await db.students.toArray() || [];
          setStudents(localStudents);
        }
        if (db && db.teachers) {
          const localTeachers = await db.teachers.toArray() || [];
          setTeachers(localTeachers);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات الحسابية:", error);
      }
    };
    loadData();
  }, []);

  const handleSaveReceipt = async (e) => {
    e.preventDefault();
    if (!receiptAmount || !receiptStudentId) {
      alert("الرجاء اختيار الطالب وتحديد المبلغ");
      return;
    }
    try {
      const selectedStudent = students.find(s => String(s.id) === String(receiptStudentId));
      if (db && db.tuitions) {
        await db.tuitions.add({
          date: new Date().toISOString().split('T')[0],
          studentName: selectedStudent ? selectedStudent.name : 'طالب غير معروف',
          amount: parseFloat(receiptAmount),
          note: receiptStatement
        });
        alert(`تم حفظ سند القبض بنجاح!\nالمبلغ: ${receiptAmount} جنيه`);
        setReceiptStudentId(''); setReceiptAmount(''); setReceiptStatement('');
      }
    } catch (error) { console.error(error); }
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount) {
      alert("الرجاء تحديد مبلغ الصرف");
      return;
    }
    try {
      const selectedTeacher = teachers.find(t => String(t.id) === String(paymentTeacherId));
      if (db && db.payrolls) {
        await db.payrolls.add({
          date: new Date().toISOString().split('T')[0],
          employeeName: selectedTeacher ? selectedTeacher.name : '',
          description: paymentStatement || 'مصروفات عامة',
          amount: parseFloat(paymentAmount)
        });
        alert(`تم حفظ سند الصرف بنجاح!\nالمبلغ: ${paymentAmount} جنيه`);
        setPaymentTeacherId(''); setPaymentAmount(''); setPaymentStatement('');
      }
    } catch (error) { console.error(error); }
  };

  const styles = {
    container: { fontFamily: 'sans-serif', direction: 'rtl', padding: '20px', backgroundColor: '#f9fafb', minHeight: '100vh' },
    backBtn: { backgroundColor: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginBottom: '25px', fontSize: '14px', fontWeight: 'bold' },
    title: { color: '#1f2937', marginBottom: '25px', fontSize: '20px', fontWeight: 'bold', textAlign: 'right' },
    cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' },
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' },
    cardTitle: (color) => ({ color: color, fontSize: '18px', fontWeight: 'bold', borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px' }),
    formGroup: { marginBottom: '16px', textAlign: 'right' },
    label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4b5563' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px', textAlign: 'right' },
    submitBtn: (bgColor) => ({ width: '100%', backgroundColor: bgColor, color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', marginTop: '10px' })
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>↩ العودة لقسم الحسابات الرئيسي</button>
      <h2 style={styles.title}>⚡ شاشات الإدخال السريع الحسابية</h2>
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardTitle('#059669')}>سند قبض (+)</div>
          <form onSubmit={handleSaveReceipt}>
            <div style={styles.formGroup}>
              <label style={styles.label}>اختر الطالب</label>
              <select style={styles.input} value={receiptStudentId} onChange={(e) => setReceiptStudentId(e.target.value)} required>
                <option value="">-- حدد الطالب المـُسدِّد --</option>
                {students.map(student => <option key={student.id} value={student.id}>{student.name}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>المبلغ (جنيه)</label>
              <input type="number" placeholder="0.00" style={styles.input} value={receiptAmount} onChange={(e) => setReceiptAmount(e.target.value)} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>البيان / السبب</label>
              <input type="text" placeholder="مثال: قسط شهر أكتوبر" style={styles.input} value={receiptStatement} onChange={(e) => setReceiptStatement(e.target.value)} />
            </div>
            <button type="submit" style={styles.submitBtn('#059669')}>تأكيد وحفظ سند القبض</button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle('#dc2626')}>سند صرف (-)</div>
          <form onSubmit={handleSavePayment}>
            <div style={styles.formGroup}>
              <label style={styles.label}>الجهة المستفيدة (معلم / جهة خارجية)</label>
              <select style={styles.input} value={paymentTeacherId} onChange={(e) => setPaymentTeacherId(e.target.value)}>
                <option value="">-- مصروفات عامة (ليست لمعلم) --</option>
                {teachers.map(teacher => <option key={teacher.id} value={teacher.id}>المعلم: {teacher.name}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>المبلغ (جنيه)</label>
              <input type="number" placeholder="0.00" style={styles.input} value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>البيان / السبب</label>
              <input type="text" placeholder="مثال: أدوات صيانة" style={styles.input} value={paymentStatement} onChange={(e) => setPaymentStatement(e.target.value)} required />
            </div>
            <button type="submit" style={styles.submitBtn('#dc2626')}>تأكيد وحفظ سند الصرف</button>
          </form>
        </div>
      </div>
    </div>
  );
}
