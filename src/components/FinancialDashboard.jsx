import React, { useState, useEffect } from 'react';
import * as dbModule from '../db'; 

const db = dbModule.db || dbModule.default || dbModule;

const FinancialDashboard = () => {
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 10000, txCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStats = async () => {
      setLoading(true);
      try {
        if (!db || !db.getAllTransactions) {
          setLoading(false);
          return;
        }
        const txs = await db.getAllTransactions() || [];
        
        let income = 0;
        let expense = 0;
        let bal = 10000; // الخزينة الابتدائية الافتراضية

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
      } finally {
        setLoading(false);
      }
    };
    calculateStats();
  }, []);

  const netProfit = stats.totalIncome - stats.totalExpense;

  return (
    <div style={containerStyle}>
      {/* 🌟 ترويسة الصفحة */}
      <div style={headerStyle}>
        <div style={titleBadgeStyle}>💎</div>
        <h2 style={titleStyle}>واجهة لوحة التحكم المالية العامة</h2>
        <p style={subtitleStyle}>ملخص ذكي ومباشر للأرباح، الخسائر، وحالة السيولة الحالية في الخزينة</p>
      </div>

      {/* 📊 شبكة البطاقات الإحصائية الزجاجية */}
      <div style={gridStyle}>
        
        {/* 1. إجمالي الإيرادات */}
        <div style={{ ...glassCardStyle, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.85) 0%, rgba(5, 150, 105, 0.95) 100%)', color: '#fff' }}>
          <div style={cardHeaderStyle}>
            <span style={{ fontSize: '24px' }}>💰</span>
            <span style={cardTitleStyle}>إجمالي الإيرادات والتحصيل</span>
          </div>
          <h2 style={amountStyle}>
            {loading ? '...' : stats.totalIncome.toLocaleString()} <span style={unitStyle}>جنيه</span>
          </h2>
        </div>

        {/* 2. إجمالي المصروفات */}
        <div style={{ ...glassCardStyle, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.95) 100%)', color: '#fff' }}>
          <div style={cardHeaderStyle}>
            <span style={{ fontSize: '24px' }}>📉</span>
            <span style={cardTitleStyle}>إجمالي المصروفات والرواتب</span>
          </div>
          <h2 style={amountStyle}>
            {loading ? '...' : stats.totalExpense.toLocaleString()} <span style={unitStyle}>جنيه</span>
          </h2>
        </div>

        {/* 3. صافي الأرباح */}
        <div style={{ ...glassCardStyle, background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.85) 0%, rgba(109, 40, 217, 0.95) 100%)', color: '#fff' }}>
          <div style={cardHeaderStyle}>
            <span style={{ fontSize: '24px' }}>🏪</span>
            <span style={cardTitleStyle}>صافي أرباح الصندوق الحالية</span>
          </div>
          <h2 style={amountStyle}>
            {loading ? '...' : netProfit.toLocaleString()} <span style={unitStyle}>جنيه</span>
          </h2>
        </div>

        {/* 4. عدد العمليات الموثقة */}
        <div style={{ ...glassCardStyle, backgroundColor: 'rgba(255, 255, 255, 0.75)', color: '#1f2937', border: '1px solid rgba(255, 255, 255, 0.9)' }}>
          <div style={cardHeaderStyle}>
            <span style={{ fontSize: '24px' }}>📝</span>
            <span style={{ ...cardTitleStyle, color: '#4b5563' }}>عدد العمليات المالية الموثقة</span>
          </div>
          <h2 style={{ ...amountStyle, color: '#0f172a' }}>
            {loading ? '...' : stats.txCount} <span style={{ ...unitStyle, color: '#64748b' }}>عملية</span>
          </h2>
        </div>

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
  marginBottom: '36px'
};

const titleBadgeStyle = {
  width: '56px',
  height: '56px',
  margin: '0 auto 12px auto',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
  color: '#fff'
};

const titleStyle = {
  margin: 0,
  color: '#0f172a',
  fontWeight: '800',
  fontSize: '24px'
};

const subtitleStyle = {
  margin: '6px 0 0 0',
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '20px',
  maxWidth: '1100px',
  margin: '0 auto'
};

const glassCardStyle = {
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.3s ease, boxShadow 0.3s ease'
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px'
};

const cardTitleStyle = {
  margin: 0,
  fontSize: '14px',
  fontWeight: '700'
};

const amountStyle = {
  margin: 0,
  fontSize: '32px',
  fontWeight: '900',
  lineHeight: '1.2'
};

const unitStyle = {
  fontSize: '16px',
  fontWeight: '600',
  opacity: 0.85
};

export default FinancialDashboard;
