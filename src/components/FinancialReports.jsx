import React, { useState, useEffect } from 'react';
import * as dbModule from '../db'; 

const db = dbModule.db || dbModule.default || dbModule;

const FinancialReports = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('all');

  useEffect(() => {
    loadFilteredReports();
  }, [startDate, endDate, reportType]);

  const loadFilteredReports = async () => {
    try {
      if (!db || !db.getAllTransactions) return;
      const txs = await db.getAllTransactions() || [];

      let formattedRecords = txs.map(item => ({
        id: item.id || Math.floor(Math.random() * 10000),
        date: item.date || 'غير مححدد',
        title: item.statement || item.targetName || 'حركة مالية عامة',
        name: item.targetName || 'مصروف عام',
        type: item.type === 'قبض' ? 'income' : 'expense',
        amount: parseFloat(item.amount) || 0
      }));

      if (reportType === 'income') formattedRecords = formattedRecords.filter(r => r.type === 'income');
      if (reportType === 'expense') formattedRecords = formattedRecords.filter(r => r.type === 'expense');

      setReports(formattedRecords);
    } catch (error) { console.error(error); }
  };

  return (
    <div style={{ direction: 'rtl', padding: '25px', fontFamily: 'Arial' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#e11d48' }}>📝 كشف التقارير المادية الحسابية</h2>
        <p style={{ color: '#555' }}>تصدير وملفات حركة الحسابات وطباعة الكشوفات الرسمية</p>
      </div>

      <div className="no-print" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px', display: 'flex', gap: '15px', marginBottom: '25px', border: '1px solid #e5e7eb', alignItems: 'center' }}>
        <label><b>نوع الحركة:</b></label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={{ padding: '6px', borderRadius: '6px' }}>
          <option value="all">كل الحركات المالية</option>
          <option value="income">سندات القبض (+)</option>
          <option value="expense">سندات الصرف (-)</option>
        </select>
        <button onClick={() => window.print()} style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: 'auto', fontWeight: 'bold' }}>🖨️ طباعة الكشف</button>
      </div>

      <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead style={{ background: '#e11d48', color: '#fff' }}>
          <tr>
            <th>التاريخ</th><th>البيان والسبب</th><th>الاسم المالي</th><th>طبيعة الحركة</th><th>المبلغ</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, idx) => (
            <tr key={idx}>
              <td>{report.date}</td><td style={{ textAlign: 'right' }}>{report.title}</td><td>{report.name}</td>
              <td style={{ fontWeight: 'bold', color: report.type === 'income' ? '#16a34a' : '#dc2626' }}>{report.type === 'income' ? 'إيراد (+)' : 'مصروف (-)'}</td>
              <td>{report.amount.toLocaleString()} جنيه</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialReports;
