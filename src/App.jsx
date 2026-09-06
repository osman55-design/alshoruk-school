const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg('');

  try {
    // 1. الاستعلام المباشر من الجدول
    const { data, error } = await supabase
      .from('users') // أو users_list حسب الاسم الموجود لديكِ
      .select('*')
      .eq('username', username.trim())
      .eq('password', password.trim());

    if (error) {
      setErrorMsg(`خطأ من Supabase: ${error.message}`);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة!');
      setLoading(false);
      return;
    }

    const userData = data[0];

    // 2. معالجة آمنة للصلاحيات لضمان عدم حدوث Crash
    let userPermissions = { admin: true };
    if (userData.permissions) {
      if (typeof userData.permissions === 'string') {
        try {
          userPermissions = JSON.parse(userData.permissions);
        } catch (pErr) {
          userPermissions = { admin: true };
        }
      } else if (typeof userData.permissions === 'object') {
        userPermissions = userData.permissions;
      }
    }

    // 3. حفظ بيانات المستخدم والانتقال للوحة التحكم
    const userObj = {
      id: userData.id,
      name: userData.name || userData.username,
      username: userData.username,
      role: userData.role || 'admin',
      permissions: userPermissions
    };

    setCurrentUser(userObj);
    setShowLoginModal(false);
    setCurrentView('admin');
    setUsername('');
    setPassword('');
  } catch (err) {
    // هنا سيظهر سبب المشكلة الدقيق في حال وجود استثناء في جافاسكريبت
    console.error('Login Process Error:', err);
    setErrorMsg(`حدث خطأ أثناء معالجة البيانات: ${err.message || err}`);
  } finally {
    setLoading(false);
  }
};
