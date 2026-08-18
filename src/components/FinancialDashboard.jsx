import React, { useState, useEffect } from 'react';
import * as dbModule from '../db'; 

const db = dbModule.db || dbModule.default || dbModule;

const FinancialDashboard = () => {
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 10000, txCount: 0 });

  useEffect(() => {
    const calculateStats = async () => {
      try {
        if (!db || !db.getAllTransactions) return;
        const txs = await db.getAllTransactions() || [];
        
        let income = 0;
        let expense = 0;
        let bal = 10000; // الخزينة الابتدائية الافتراضية لديك

        txs.forEach(tx => {
          const amt = parseFloat(tx.amount) || 0;
          if (tx.type === 'قبض') {
            income += amt;
            bal += amt;
          } else {
            expense += amt;
            bal -= amt;
          }
        });

        setStats({ totalIncome: income, totalExpense: expense, balance: bal, txCount: txs.length });
      } catch (error) {
        console.error("خطأ في حساب إحصائيات لوحة التحكم:", error);
      }
    };
    calculateStats();
  }, []);

  const cardStyle = (bg, color) => ({
    backgroundColor: bg, color: color, padding: '25px', borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flex: '1', minWidth: '220px', textAlign: 'center'
  });

  return (
    <div style={{ direction: 'rtl', padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#7c3aed' }}>📊 واجهة لوحة التحكم المالية العامة</h2>
        <p style={{ color: '#555' }}>ملخص ذكي ومباشر للأرباح، الخسائر، وحالة السيولة الحالية في الخزينة</p>
      </div>

      {/* شبكة البطاقات الإحصائية الملونة */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={cardStyle('#10b981', '#fff')}>
          <h3 style={{ margin: '0 0 10px 0' }}>💰 إجمالي الإيرادات والتحصيل</h3>
          <h2 style={{ margin: '0' }}>{stats.totalIncome.toLocaleString()} جنيه</h2>
        </div>

        <div style={cardStyle('#ef4444', '#fff')}>
          <h3 style={{ margin: '0 0 10px 0' }}>📉 إجمالي المصروفات والرواتب</h3>
          <h2 style={{ margin: '0' }}>{stats.totalExpense.toLocaleString()} جنيه</h2>
        </div>

        <div style={cardStyle('#7c3aed', '#fff')}>
          <h3 style={{ margin: '0 0 10px 0' }}>🏪 صافي أرباح الصندوق الحالية</h3>
          <h2 style={{ margin: '0' }}>{(stats.totalIncome - stats.totalExpense).toLocaleString()} جنيه</h2>
        </div>

        <div style={cardStyle('#fff', '#1f2937', '1px solid #e5e7eb')}>
          <h3 style={{ margin: '0 0 10px 0', color: '#4b5563' }}>📝 عدد العمليات المالية الموثقة</h3>
          <h2 style={{ margin: '0', color: '#1f2937' }}>{stats.txCount} عملية</h2>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
