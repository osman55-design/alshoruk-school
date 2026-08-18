// ملف الاتصال المركزي بقاعدة بيانات سحابة جوجل
const GOOGLE_SCRIPT_URL = "https://google.com";

export const db = {
  // دالة جلب البيانات من أي تبويب
  async getData(sheetName) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`);
      return await response.json();
    } catch (error) {
      console.error(`خطأ في جلب بيانات التبويب ${sheetName}:`, error);
      return [];
    }
  },

  // دالة إرسال وحفظ سطر جديد في السحابة
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
