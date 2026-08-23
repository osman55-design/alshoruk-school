// 🌐 رابط الاتصال المركزي المطور بسحابة جوجل (App Script URL)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

/**
 * 🎨 دالة استدعاء إشعارات عصرية بتأثير الزجاج (Glassmorphism Toast)
 */
const showGlassToast = (message, type = 'success') => {
  const existingToast = document.getElementById('glass-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.id = 'glass-toast';
  
  // الألوان والأنماط بناءً على نوع الإشعار
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
  const borderColor = isSuccess ? 'rgba(52, 211, 153, 0.5)' : 'rgba(248, 113, 113, 0.5)';
  const textColor = isSuccess ? '#ecfdf5' : '#fef2f2';
  const icon = isSuccess ? '✨' : '⚠️';

  // تطبيق تنسيقات Glassmorphism
  Object.assign(toast.style, {
    position: 'fixed',
    top: '24px',
    left: '50%',
    transform: 'translateX(-50%) translateY(-20px)',
    backgroundColor: bgColor,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${borderColor}`,
    color: textColor,
    padding: '12px 24px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    zIndex: '99999',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    direction: 'rtl',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    opacity: '0',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
  });

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  // أنيميشن الظهور
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);

  // إخفاء الإشعار تلقائياً
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

// 1️⃣ الكائن المركزي للأقسام والبيانات (Modern DB Client)
export const db = {
  // جلب البيانات
  async getData(sheetName) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`);
      if (!response.ok) throw new Error("فشل الاتصال بالسيرفر");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ خطأ جلب البيانات [${sheetName}]:`, error);
      showGlassToast(`تعذر جلب بيانات ${sheetName}`, 'error');
      return [];
    }
  },

  // إضافة بيانات جديدة
  async insertData(sheetName, data) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'insert', data })
      });
      const result = await response.json();
      showGlassToast(`تم حفظ البيانات في ${sheetName} بنجاح`, 'success');
      return result;
    } catch (error) {
      console.error(`❌ خطأ حفظ البيانات [${sheetName}]:`, error);
      showGlassToast(`فشل حفظ البيانات في ${sheetName}`, 'error');
      return { status: "error" };
    }
  },

  // تعديل بيانات سابقة
  async updateData(sheetName, id, updatedData) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'update', id, data: updatedData })
      });
      const result = await response.json();
      showGlassToast(`تم تعديل السجل في ${sheetName}`, 'success');
      return result;
    } catch (error) {
      console.error(`❌ خطأ تعديل البيانات [${sheetName}]:`, error);
      showGlassToast(`فشل تعديل السجل`, 'error');
      return { status: "error" };
    }
  },

  // حذف سجل
  async deleteData(sheetName, id) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'delete', id })
      });
      const result = await response.json();
      showGlassToast(`تم حذف العنصر بنجاح`, 'success');
      return result;
    } catch (error) {
      console.error(`❌ خطأ الحذف [${sheetName}]:`, error);
      showGlassToast(`فشل حذف العنصر`, 'error');
      return { status: "error" };
    }
  }
};

// 2️⃣ المترجمات الخلفية لتشغيل المكونات والملفات القديمة تلقائياً
export const getAllStudents = async () => await db.getData("الطلاب");
export const getAllTeachers = async () => await db.getData("المعلمين");
export const getAllTransactions = async () => await db.getData("الحسابات");

export const addStudent = async (studentData) => await db.insertData("الطلاب", studentData);
export const addTeacher = async (teacherData) => await db.insertData("المعلمين", teacherData);
export const addTransaction = async (txData) => await db.insertData("الحسابات", txData);

export const deleteStudent = async (id) => await db.deleteData("الطلاب", id);
export const deleteTeacher = async (id) => await db.deleteData("المعلمين", id);
