      <div style={{ padding: '40px 5%', flex: '1' }}>
        
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* 🌅 الهيرو بانر المطور بالتدرج اللوني الهادئ والمريح للعين */}
            <div style={{ background: 'linear-gradient(135deg, #0d2814 0%, #111e40 100%)', color: '#fff', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* القسم الأيمن: الشعار والترحيب الأنيق */}
              <div style={{ flex: '1', minWidth: '290px', textAlign: 'center', padding: '10px' }}>
                <img src="logo.png" alt="شعار مدرسة الشروق" onError={(e) => { e.target.src = "https://placehold.co🇸🇩"; }} style={{ width: '110px', height: '110px', marginBottom: '15px', borderRadius: '50%', backgroundColor: '#fff', padding: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', border: '3px solid #cc9933' }} />
                <h1 style={{ margin: '0 0 12px 0', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', color: '#fff' }}>مرحباً بكم في مدرسة الشروق السودانية</h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#cbd5e1', lineHeight: '1.6' }}>بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز عبر جميع مراحلنا التعليمية الثلاث المتكاملة</p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(204,153,51,0.15)', color: '#cc9933', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #cc9933' }}>🚀 بيئة رقمية ذكية</span>
                  <span style={{ backgroundColor: 'rgba(15,41,22,0.4)', color: '#4ade80', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #0f2916' }}>📚 المنهج السوداني المعتمد</span>
                </div>
              </div>

              {/* القسم الأيسر: لوحة الهيكل الإداري مع الأيقونات الجرافيكية الفخمة البديلة للصور */}
              <div style={{ flex: '1.2', minWidth: '300px', background: 'rgba(255, 255, 255, 0.04)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#cc9933', borderBottom: '2px solid rgba(204,153,51,0.2)', paddingBottom: '10px', fontSize: '19px', fontWeight: 'bold', textAlign: 'center' }}>🏛️ مجلس إدارة المدرسة الموقر</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', direction: 'rtl' }}>
                  
                  {/* كارت كمال الدين */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#cc9933', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 10px rgba(204,153,51,0.3)' }}>ك</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: '#fed7aa', fontSize: '11px', fontWeight: 'bold' }}>المدير العام</span><span style={{ fontSize: '14.5px', fontWeight: 'bold' }}>كمال الدين مجذوب الطيب</span></div>
                  </div>

                  {/* كارت ماما هند */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#10351a', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 10px rgba(16,53,26,0.3)', border: '1px solid #cc9933' }}>هـ</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: '#fed7aa', fontSize: '11px', fontWeight: 'bold' }}>الأم التربوية الحنون</span><span style={{ fontSize: '14.5px', fontWeight: 'bold' }}>ماما هند عبد الرازق</span></div>
                  </div>

                  {/* كارت محمد كمال */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#cc9933', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 10px rgba(204,153,51,0.3)' }}>م</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: '#fed7aa', fontSize: '11px', fontWeight: 'bold' }}>مدير إداري</span><span style={{ fontSize: '14.5px', fontWeight: 'bold' }}>محمد كمال الدين مجذوب</span></div>
                  </div>

                  {/* كارت لينا كمال */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#10351a', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 10px rgba(16,53,26,0.3)', border: '1px solid #cc9933' }}>ل</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: '#fed7aa', fontSize: '11px', fontWeight: 'bold' }}>مديرة إدارية</span><span style={{ fontSize: '14.5px', fontWeight: 'bold' }}>لينا كمال الدين مجذوب</span></div>
                  </div>

                </div>
              </div>

            </div>

            {/* بطاقات معلومات مَن نحن وأهدافنا المتناسقة والداعمة للجوال */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '30px' }}>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #172554', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>📖</span><h3 style={{ color: '#172554', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>مَن نحن؟</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة آمنة تعبر بهم بنجاح عبر ثلاث مراحل دراسية متكاملة: <strong>الابتدائية، المتوسطة، والثانوية</strong>.</p>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #0f2916', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>🎯</span><h3 style={{ color: '#0f2916', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>أهدافنا ورسالتنا</h3></div>
                <ul style={{ color: '#475569', lineHeight: '1.8', fontSize: '14.5px', paddingRight: '20px', margin: 0 }}>
                  <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة والمطورة.</li>
                  <li>بناء شخصية الطالب القيادية وتعزيز القيم الأخلاقية والوطنية الراسخة.</li>
                  <li>توظيف الأنظمة الرقمية والسحابية لتسهيل العمليات الإدارية والتعليمية.</li>
                  <li>مد جسور المتابعة الدقيقة والتواصل الفعال المستمر بين المدرسة وأولياء الأمور.</li>
                </ul>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #cc9933', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>💼</span><h3 style={{ color: '#cc9933', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>الحلول الرقمية الذكية</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>تتضمن هذه البوابة الإلكترونية المتقدمة لوحة تحكم ونظاماً برمجياً لإدارة شؤون المعلمين، الفصول والمستويات الدراسية، الحسابات والرسوم المالية، وسجلات الفرز للطلاب، لضمان الدقة الكاملة والسرعة الفائقة في تنفيذ العمليات المدرسية اليومية تحت إشراف طاقم متميز.</p>
              </div>
            </div>

          </div>
        )}

        {isLoggedIn && (
          <div className="content-fade-in">
            {activeTab === 'students' && <StudentsSection />}
            {activeTab === 'classes' && <ClassesSection />}
            {activeTab === 'teachers' && <TeachersSection />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'dashboard' && (
      <div style={{ padding: '40px 5%', flex: '1' }}>
        
        {activeTab === 'landing' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* 🌅 الهيرو بانر المطور بالتدرج اللوني الهادئ والمريح للعين ودعم الشاشات المتكامل */}
            <div style={{ background: 'linear-gradient(135deg, #0d2814 0%, #111e40 100%)', color: '#fff', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* القسم الأيمن: الشعار والترحيب الأنيق */}
              <div style={{ flex: '1', minWidth: '290px', textAlign: 'center', padding: '10px' }}>
                <img src="logo.png" alt="شعار مدرسة الشروق" onError={(e) => { e.target.src = "https://placehold.co🇸🇩"; }} style={{ width: '110px', height: '110px', marginBottom: '15px', borderRadius: '50%', backgroundColor: '#fff', padding: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', border: '3px solid #cc9933' }} />
                <h1 style={{ margin: '0 0 12px 0', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', color: '#fff' }}>مرحباً بكم في مدرسة الشروق السودانية</h1>
                <p style={{ margin: '0 auto', fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#cbd5e1', lineHeight: '1.6' }}>بوابتكم التعليمية الذكية لترسيخ المعرفة العريقة وبناء مستقبل أكاديمي متميز عبر جميع مراحلنا التعليمية الثلاث المتكاملة</p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(204,153,51,0.15)', color: '#cc9933', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #cc9933' }}>🚀 بيئة رقمية ذكية</span>
                  <span style={{ backgroundColor: 'rgba(15,41,22,0.4)', color: '#4ade80', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #0f2916' }}>📚 المنهج السوداني المعتمد</span>
                </div>
              </div>

              {/* القسم الأيسر: لوحة الهيكل الإداري المتميز النصي النظيف والعصري */}
              <div style={{ flex: '1.2', minWidth: '300px', background: 'rgba(255, 255, 255, 0.04)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 25px 0', color: '#cc9933', borderBottom: '2px solid rgba(204,153,51,0.2)', paddingBottom: '10px', fontSize: '19px', fontWeight: 'bold', textAlign: 'center' }}>🏛️ مجلس إدارة المدرسة الموقر</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', direction: 'rtl' }}>
                  
                  {/* 1. المدير العام */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'linear-gradient(90deg, rgba(204,153,51,0.1) 0%, rgba(255,255,255,0.02) 100%)', borderRadius: '12px', border: '1px solid rgba(204,153,51,0.2)' }}>
                    <span style={{ color: '#cc9933', fontWeight: 'bold', fontSize: '15px' }}>1. المدير العام:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>كمال الدين مجذوب الطيب</span>
                  </div>

                  {/* 2. الأم الحنون */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#fed7aa', fontWeight: 'bold', fontSize: '15px' }}>2. الأم التربوية الحنون:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>ماما هند عبد الرازق</span>
                  </div>

                  {/* 3. مدير إداري */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#fed7aa', fontWeight: 'bold', fontSize: '15px' }}>3. مدير إداري:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>محمد كمال الدين مجذوب</span>
                  </div>

                  {/* 4. مديرة إدارية */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#fed7aa', fontWeight: 'bold', fontSize: '15px' }}>4. مديرة إدارية:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>لينا كمال الدين مجذوب</span>
                  </div>

                </div>
              </div>

            </div>

            {/* بطاقات معلومات مَن نحن وأهدافنا المتناسقة والداعمة للجوال والكمبيوتر */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '30px' }}>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #172554', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>📖</span><h3 style={{ color: '#172554', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>مَن نحن؟</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>مدرسة الشروق السودانية المتكاملة هي صرح تعليمي رائد مخصص لتقديم المنهج السوداني الرصين بكفاءة وجودة عالية. نحتضن الطلاب في بيئة تربوية محفزة آمنة تعبر بهم بنجاح عبر ثلاث مراحل دراسية متكاملة: <strong>الابتدائية، المتوسطة، والثانوية</strong>.</p>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #0f2916', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>🎯</span><h3 style={{ color: '#0f2916', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>أهدافنا ورسالتنا</h3></div>
                <ul style={{ color: '#475569', lineHeight: '1.8', fontSize: '14.5px', paddingRight: '20px', margin: 0 }}>
                  <li>تقديم تعليم متميز يتوافق مع المعايير التربوية الحديثة والمطورة.</li>
                  <li>بناء شخصية الطالب القيادية وتعزيز القيم الأخلاقية والوطنية الراسخة.</li>
                  <li>توظيف الأنظمة الرقمية والسحابية لتسهيل العمليات الإدارية والتعليمية.</li>
                  <li>مد جسور المتابعة الدقيقة والتواصل الفعال المستمر بين المدرسة وأولياء الأمور.</li>
                </ul>
              </div>

              <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.015)', borderTop: '5px solid #cc9933', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><span style={{ fontSize: '22px' }}>💼</span><h3 style={{ color: '#cc9933', margin: 0, fontWeight: 'bold', fontSize: '18px' }}>الحلول الرقمية الذكية</h3></div>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>تتضمن هذه البوابة الإلكترونية المتقدمة لوحة تحكم ونظاماً برمجياً لإدارة شؤون المعلمين، الفصول والمستويات الدراسية، الحسابات والرسوم المالية، وسجلات الفرز للطلاب، لضمان الدقة الكاملة والسرعة الفائقة في تنفيذ العمليات المدرسية اليومية تحت إشراف طاقم متميز.</p>
              </div>
            </div>

          </div>
        )}

        {isLoggedIn && (
          <div className="content-fade-in">
            {activeTab === 'students' && <StudentsSection />}
            {activeTab === 'classes' && <ClassesSection />}
            {activeTab === 'teachers' && <TeachersSection />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'dashboard' && (
              <DashboardSection users={usersList} setUsers={setUsersList} onBack={() => setActiveTab('dashboard')} />
            )}
          </div>
        )}
      </div>

      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(4px)' }}>
          <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px 35px', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '350px', position: 'relative', borderTop: '6px solid #cc9933' }}>
            <button type="button" onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            <h3 style={{ textAlign: 'center', color: '#1e3a8a', margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>تسجيل دخول الإدارة</h3>
