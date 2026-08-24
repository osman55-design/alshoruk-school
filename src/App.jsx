{/* القسم الترحيبي وبنّر مجلس الإدارة خلفية بيضاء ونظيفة بدون المربع الأخضر */}
<div style={{ 
  backgroundColor: '#ffffff', 
  padding: '20px', 
  borderRadius: '16px', 
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)', 
  border: '1px solid #e2e8f0',
  display: 'flex', 
  flexDirection: 'column', 
  gap: '16px' 
}}>
  
  {/* عنوان وترحيب بنفس النصوص */}
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ margin: '0 0 6px 0', fontSize: 'clamp(20px, 3.5vw, 26px)', fontWeight: '900', color: '#047857' }}>
      مرحباً لكم في صرح الشروق التعليمي 🏫
    </h2>
    <p style={{ margin: '0 auto 10px auto', fontSize: '13.5px', color: '#475569', maxWidth: '650px', fontWeight: '600' }}>
      بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #fde68a' }}>✨ توكل نجاح تفوق</span>
      <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #a7f3d0' }}>📚 المنهج السوداني المطور</span>
    </div>
  </div>

  {/* قسم مجلس الإدارة بدبابيس وبطاقات خفيفة أنيقة */}
  <div style={{ 
    backgroundColor: '#f8fafc', 
    padding: '14px', 
    borderRadius: '12px', 
    border: '1px solid #f1f5f9' 
  }}>
    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: '800' }}>🏛️ مجلس إدارة المدرسة</span>
    </div>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
      gap: '10px', 
      width: '100%' 
    }}>
      <div style={cleanCardStyle('#f59e0b')}>
        <img src="manager1.png" alt="رئيس مجلس الإدارة" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={cleanAvatarStyle('#f59e0b')} />
        <span style={cleanBadgeStyle('#b45309', '#fef3c7', '#fde68a')}>رئيس مجلس الإدارة</span>
        <h5 style={cleanNameStyle}>الأستاذ كمال الدين مجذوب</h5>
      </div>

      <div style={cleanCardStyle('#ec4899')}>
        <img src="mother.png" alt="الأم التربوية" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={cleanAvatarStyle('#ec4899')} />
        <span style={cleanBadgeStyle('#be185d', '#fce7f3', '#fbcfe8')}>الأم التربوية</span>
        <h5 style={cleanNameStyle}>ماما هند عبد الرازق</h5>
      </div>

      <div style={cleanCardStyle('#10b981')}>
        <img src="admin_manager.png" alt="المدير العام" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={cleanAvatarStyle('#10b981')} />
        <span style={cleanBadgeStyle('#047857', '#d1fae5', '#a7f3d0')}>المدير العام</span>
        <h5 style={cleanNameStyle}>الأستاذ محمد كمال الدين</h5>
      </div>

      <div style={cleanCardStyle('#8b5cf6')}>
        <img src="admin_manager2.png" alt="مديرة إدارية" onError={(e) => { e.target.src = "https://placehold.co/100"; }} style={cleanAvatarStyle('#8b5cf6')} />
        <span style={cleanBadgeStyle('#6d28d9', '#ede9fe', '#ddd6fe')}>مديرة إدارية</span>
        <h5 style={cleanNameStyle}>الأستاذة لينا كمال الدين</h5>
      </div>
    </div>
  </div>

</div>
