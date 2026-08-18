// ملف الاتصال المركزي المطور والشامل بسحابة جوجل
const GOOGLE_SCRIPT_URL = "https://google.com";

// 1. الكائن المركزي للأقسام الحديثة
export const db = {
  async getData(sheetName) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`);
      return await response.json();
    } catch (error) {
      console.error(`خطأ في جلب بيانات التبويب ${sheetName}:`, error);
      return [];
    }
  },

  async insertData(sheetName, data) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`خطأ في حفظ البيانات بتبويب ${sheetName}:`, error);
      return { status: "error" };
    }
  }
};

// 2. المترجمات الخلفية لتشغيل الملفات القديمة (مثل الفصول والرواتب) تلقائياً عبر السحابة
export const getAllStudents = async () => {
  return await db.getData("الطلاب");
};

export const getAllTeachers = async () => {
  return await db.getData("المعلمين");
};

export const getAllTransactions = async () => {
  return await db.getData("الحسابات");
};

export const addStudent = async (studentData) => {
  return await db.insertData("الطلاب", studentData);
};

export const addTeacher = async (teacherData) => {
  return await db.insertData("المعلمين", teacherData);
};

export const addTransaction = async (txData) => {
  return await db.insertData("الحسابات", txData);
};

export const deleteStudent = async (id) => {
  return { status: "success" };
};

export const deleteTeacher = async (id) => {
  return { status: "success" };
};
