const DB_NAME = 'SchoolDB';
// قمنا برفع الإصدار إلى 3 ليتعرف المتصفح على مخزن المعاملات المالية الجديد تلقائياً
const DB_VERSION = 3; 
const STORE_NAME = 'students';
const TEACHERS_STORE = 'teachers'; 
const TRANSACTIONS_STORE = 'transactions'; // مخزن الحسابات الجديد

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // إنشاء مخزن الطلاب إذا لم يكن موجوداً
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      
      // إنشاء مخزن المعلمين إذا لم يكن موجوداً
      if (!db.objectStoreNames.contains(TEACHERS_STORE)) {
        db.createObjectStore(TEACHERS_STORE, { keyPath: 'id', autoIncrement: true });
      }

      // إنشاء مخزن المعاملات المالية الجديد
      if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
        db.createObjectStore(TRANSACTIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

/* ================= دوال التحكم في الطلاب ================= */
export const addStudent = async (student) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(student);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllStudents = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteStudent = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/* ================= دوال التحكم في المعلمين ================= */
export const addTeacher = async (teacher) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TEACHERS_STORE, 'readwrite');
    const store = transaction.objectStore(TEACHERS_STORE);
    const request = store.add(teacher);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllTeachers = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TEACHERS_STORE, 'readonly');
    const store = transaction.objectStore(TEACHERS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteTeacher = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TEACHERS_STORE, 'readwrite');
    const store = transaction.objectStore(TEACHERS_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/* ================= دوال التحكم في الحسابات الجديدة ================= */
export const addTransaction = async (tx) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TRANSACTIONS_STORE, 'readwrite');
    const store = transaction.objectStore(TRANSACTIONS_STORE);
    const request = store.add(tx);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllTransactions = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TRANSACTIONS_STORE, 'readonly');
    const store = transaction.objectStore(TRANSACTIONS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
