import React, { useState, useEffect } from 'react';
import './App.css';

// استيراد الملفات الستة المفصولة لحماية النظام
import StudentsSection from './components/StudentsSection';
import ClassesSection from './components/ClassesSection';
import TeachersSection from './components/TeachersSection';
import AccountsSection from './components/AccountsSection';
import ResultsSection from './components/ResultsSection';
import DashboardSection from './components/DashboardSection';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);

  // دالة جلب بيانات المستخدمين من سحابة جوجل المحدثة لحل مشكلة CORS
  const fetchUsersFromCloud = async () => {
    try {
      // ⚠️ ضع هنا رابط الـ Web App الطويل الذي ينتهي بـ /exec والذي أخذته من جوجل بعد عمل Deploy
      const googleScriptUrl = "https://script.google.com/macros/library/d/1kA8M_-qbeJ850LYJB0gjlc4tIJRZ1_gw7gE3mdqOK4RQb8lgKdonhrA5/1"; 
      
      const response = await fetch(googleScriptUrl, {
        method: 'GET', // نستخدم GET لجلب البيانات بشكل مبسط لتخطي قيود CORS
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const cloudData = await response.json();
      
      // تحويل البيانات القادمة من الأعمدة لتتوافق مع نظام الصلاحيات في موقعك
      const formattedUsers = cloudData.map((u, index) => {
        const isAdmin = String(u.role).trim() === "أدمن";
        return {
          id: index + 1,
          name: u.name,
          loginName: String(u.username).trim(),
          role: u.role,
          pin: String(u.password).trim(),
          permissions: { 
            students: true, 
            classes: true, 
            teachers: isAdmin, 
            finance: isAdmin, 
            admin: isAdmin 
          }
        };
      });
      
      setUsersList(formattedUsers);
      return formattedUsers;
    } catch (error) {
      console.error("حدث خطأ في الاتصال بسحابة جوجل وجلب المستخدمين:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchUsersFromCloud();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const freshUsers = await fetchUsersFromCloud();

    const foundUser = freshUsers.find(
      u => u.loginName === username.trim() && u.pin === password.trim()
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setIsLoggedIn(true);
      if (foundUser.permissions.admin) {
        setActiveTab('dashboard');
      } else if (foundUser.permissions.students) {
        setActiveTab('students');
      } else {
        setActiveTab('classes');
      }
    } else {
      alert('اسم المستخدم أو كلمة المرور غير مسجلة بالنظام السحابي لجوجل!');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
  };
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var users = [];
  
  // تحويل صفوف الجدول إلى مصفوفة ليفهمها كود الـ React
  for (var i = 1; i < data.length; i++) {
    users.push({
      name: data[i][0],        // العمود A
      username: data[i][1],    // العمود B
      password: data[i][2],    // العمود C
      role: data[i][3],        // العمود D
      permissions: data[i][4]  // العمود E
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(users))
                       .setMimeType(ContentService.MimeType.JSON);
}
