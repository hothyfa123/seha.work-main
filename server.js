const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware لتحليل JSON
app.use(express.json());

// تقديم الملفات الثابتة (مثل HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// مسار للصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// نقطة نهاية لجلب بيانات المستخدمين
app.get('/api/users', (req, res) => {
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('خطأ في قراءة البيانات.');
    }
    res.json(JSON.parse(data));
  });
});

// نقطة نهاية لحفظ البيانات إلى ملف JSON
app.post('/api/saveToJSON', (req, res) => {
  const newData = req.body;

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('خطأ في قراءة البيانات.');
    }

    const jsonData = JSON.parse(data);
    jsonData.users.push(newData); // إضافة البيانات الجديدة

    fs.writeFile(DB_PATH, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('خطأ في حفظ البيانات.');
      }
      res.send('تم حفظ البيانات إلى JSON بنجاح.');
    });
  });
});

// نقطة نهاية لتحديث بيانات المستخدمين
app.post('/api/users', (req, res) => {
  const newData = req.body;

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('خطأ في قراءة البيانات.');
    }

    const jsonData = JSON.parse(data);
    const userIndex = jsonData.users.findIndex(u => u.servicecode === newData.servicecode && u.idNumber === newData.idNumber);
    if (userIndex !== -1) {
      jsonData.users[userIndex] = newData; // تحديث البيانات
    } else {
      jsonData.users.push(newData); // إضافة بيانات جديدة
    }

    fs.writeFile(DB_PATH, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('خطأ في حفظ البيانات.');
      }
      res.send('تم تحديث البيانات بنجاح.');
    });
  });
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});