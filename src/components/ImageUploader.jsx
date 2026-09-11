import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // نقطتان للخروج من مجلد components والوصول لملف الربط في src

export default function ImageUploader({ folderName = 'students', onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      // 1. عرض معاينة للصورة مباشرة على الشاشة
      setPreviewUrl(URL.createObjectURL(file));

      // 2. إعطاء اسم فريد للصورة لكي لا يتكرر
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`;

      // 3. رفع الصورة إلى سوبابيس في الـ Bucket (school-files)
      const { error: uploadError } = await supabase.storage
        .from('school-files') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 4. جلب رابط الصورة الجاهز
      const { data: publicData } = supabase.storage
        .from('school-files')
        .getPublicUrl(filePath);

      const finalUrl = publicData.publicUrl;
      
      // إرسال الرابط للصفحة لحفظه مع بيانات الطالب
      if (onImageUploaded) {
        onImageUploaded(finalUrl);
      }

    } catch (error) {
      console.error('خطأ في الرفع:', error.message);
      alert('حدث خطأ أثناء رفع الصورة!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <label style={{ backgroundColor: '#0f766e', color: '#fff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
        {uploading ? 'جاري الرفع... ⏳' : '📁 اختر صورة'}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
          disabled={uploading}
        />
      </label>

      {/* معاينة الصورة بعد اختيارها */}
      {previewUrl && (
        <img src={previewUrl} alt="معاينة" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
      )}
    </div>
  );
}
