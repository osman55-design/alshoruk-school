import React, { useState, useEffect } from 'react';
import * as dbModule from '../db'; 

const db = dbModule.db || dbModule.default || dbModule;

const FinancialReports = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFilteredReports();
  }, [startDate, endDate, reportType]);

  const loadFilteredReports = async () => {
    setLoading(true);
    try {
      if (!db || !db.getAllTransactions) {
        setLoading(false);
        return;
      }
      const txs = await db.getAllTransactions() || [];

      let formattedRecords = txs.map(item => ({
        id: item.id || Math.floor(Math.random() * 10000),
        date: item.date || 'غير محدد',
        title: item.statement || item.targetName || 'حركة مالية عامة',
        name: item.targetName || 'مصروف عام',
        type: item.type === 'قبض' ? 'income' : 'expense',
        amount: parseFloat(item.amount) || 0
      }));

      // تصفية حسب نوع الحركة
      if (reportType === 'income') formattedRecords = formattedRecords.filter(r => r.type === 'income');
      if (reportType === 'expense') formattedRecords = formattedRecords.filter(r => r.type === 'expense');

      // تصفية حسب التاريخ
      if (startDate) {
        formattedRecords = formattedRecords.filter(r => r.date >= startDate);
      }
      if (endDate) {
        formattedRecords = formattedRecords.filter(r => r.date <= endDate);
      }

      setReports(formattedRecords);
    } catch (error) {
      console.error("خطأ جلب التقارير المالية:", error);
    } finally {
      setLoading(false);
    }
  };

  // حساب الإجمالي الحالي للتقرير المفلتر
  const totalAmount = reports.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const exportToExcel = () => {
    if (reports.length === 0) {
      alert("لا يوجد بيانات لتصديرها!");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "التاريخ,البيان والسبب,الاسم المالي,طبيعة الحركة,المبلغ\n";

    reports.forEach(r => {
      const row = `"${r.date}","${r.title}","${r.name}","${r.type === 'income' ? 'إيراد (+)' : 'مصروف (-)'}","${r.amount}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `تقرير_مالي_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={containerStyle}>
      {/* 🌟 ترويسة الصفحة */}
      <div style={headerStyle}>
        <div style={titleBadgeStyle}>📝</div>
        <h2 style={titleStyle}>كشف التقارير المادية الحسابية</h2>
        <p style={subtitleStyle}>تصدير وملفات حركة الحسابات وطباعة الكشوفات الرسمية</p>
      </div>

      {/* 📊 شريط الفلاتر والتحكم الزجاجي */}
      <div className="no-print" style={glassCardStyle}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
          
          <div style={filterGroupStyle}>
            <label style={labelStyle}>📌 نوع الحركة:</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)} 
              style={selectStyle}
            >
              <option value="all">🌐 كل الحركات المالية</option>
              <option value="income">💚 سندات القبض (+)</option>
              <option value="expense">❤️ سندات الصرف (-)</option>
            </select>
          </div>

          <div style={filterGroupStyle}>
            <label style={labelStyle}>📅 من تاريخ:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <div style={filterGroupStyle}>
            <label style={labelStyle}>📅 إلى تاريخ:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <div style={{ marginRight: 'auto', display: 'flex', gap: '10px' }}>
            <button onClick={exportToExcel} style={btnSuccessStyle}>
              📊 تصدير Excel
            </button>
            <button onClick={() => window.print()} style={btnPrimaryStyle}>
              🖨️ طباعة الكشف
            </button>
          </div>

        </div>
      </div>

      {/* 📈 بطاقة إجمالي الصندوق المفلتر */}
      <div style={summaryCardStyle}>
        <span>صافي إجمالي الحركة في الكشف المحدد:</span>
        <strong style={{ fontSize: '20px', color: totalAmount >= 0 ? '#10b981' : '#ef4444' }}>
          {totalAmount.toLocaleString()} جنيه
        </strong>
      </div>

      {/* 📋 الجدول الزجاجي العصري */}
      <div style={tableWrapperStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>التاريخ</th>
              <th style={thStyle}>البيان والسبب</th>
              <th style={thStyle}>الاسم المالي</th>
              <th style={thStyle}>طبيعة الحركة</th>
              <th style={thStyle}>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                  ✨ جاري تحميل التقارير الحسابية...
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report, idx) => (
                <tr key={report.id || idx} style={tableRowStyle}>
                  <td style={tdStyle}>{report.date}</td>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#0f172a' }}>{report.title}</td>
                  <td style={tdStyle}>{report.name}</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...badgeStyle,
                      backgroundColor: report.type === 'income' ? 'rgba(220, 252, 231, 0.9)' : 'rgba(254, 226, 226, 0.9)',
                      color: report.type === 'income' ? '#15803d' : '#b91c1c'
                    }}>
                      {report.type === 'income' ? 'إيراد (+)' : 'مصروف (-)'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: '800', direction: 'ltr', textAlign: 'right' }}>
                    {report.amount.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>جنيه</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '35px', textAlign: 'center', color: '#64748b' }}>
                  🔍 لا توجد حركات مالية مسجلة تطابق الشروط المختارة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

// ----------------------------------------------------
// 💎 التنسيقات والأنماط الزجاجية (Glassmorphism Styles)
// ----------------------------------------------------

const containerStyle = {
  direction: 'rtl',
  padding: '30px 20px',
  fontFamily: "'Segoe UI', Roboto, sans-serif",
  minHeight: '100vh'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '28px'
};

const titleBadgeStyle = {
  width: '50px',
  height: '50px',
  margin: '0 auto 10px auto',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  boxShadow: '0 8px 18px rgba(225, 29, 72, 0.3)',
  color: '#fff'
};

const titleStyle = {
  margin: 0,
  color: '#0f172a',
  fontWeight: '800',
  fontSize: '22px'
};

const subtitleStyle = {
  margin: '4px 0 0 0',
  color: '#64748b',
  fontSize: '14px'
};

const glassCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '18px',
  padding: '16px 20px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
  marginBottom: '20px'
};

const filterGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#475569'
};

const selectStyle = {
  padding: '8px 12px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  outline: 'none',
  fontSize: '13px',
  fontWeight: '600',
  color: '#334155'
};

const inputStyle = {
  ...selectStyle
};

const btnPrimaryStyle = {
  padding: '10px 18px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '13px',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
};

const btnSuccessStyle = {
  ...btnPrimaryStyle,
  backgroundColor: '#16a34a',
  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
};

const summaryCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(12px)',
  borderRadius: '12px',
  padding: '12px 20px',
  border: '1px solid rgba(255, 255, 255, 0.9)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  fontWeight: '700',
  color: '#334155'
};

const tableWrapperStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '18px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
};

const tableHeaderStyle = {
  backgroundColor: 'rgba(225, 29, 72, 0.95)',
  color: '#ffffff',
  fontSize: '14px'
};

const tableRowStyle = {
  borderBottom: '1px solid rgba(226, 232, 240, 0.6)'
};

const thStyle = {
  padding: '14px 16px',
  fontWeight: '700'
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#334155'
};

const badgeStyle = {
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '700'
};

export default FinancialReports;
