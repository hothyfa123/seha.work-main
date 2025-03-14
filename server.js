const express = require('express');
const db = require('./database'); // استيراد قاعدة البيانات
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware لتحليل JSON
app.use(express.json());

// تقديم الملفات الثابتة (مثل HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// مسار للصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// نقطة نهاية لجلب جميع بيانات المستخدمين
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).send('خطأ في قراءة البيانات.');
    }
    res.json({ users: rows });
  });
});

// نقطة نهاية لحفظ البيانات إلى SQLite
app.post('/api/saveToJSON', (req, res) => {
  const newData = req.body;

  const query = `
    INSERT INTO users (servicecode, idNumber, name, issueDate, startDate, endDate, duration, doctor, jobTitle)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    newData.servicecode,
    newData.idNumber,
    newData.name,
    newData.issueDate,
    newData.startDate,
    newData.endDate,
    newData.duration,
    newData.doctor,
    newData.jobTitle
  ];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).send('خطأ في حفظ البيانات.');
    }
    res.send('تم حفظ البيانات إلى SQLite بنجاح.');
  });
});

// نقطة نهاية لتحديث بيانات المستخدمين
app.post('/api/users', (req, res) => {
  const newData = req.body;

  const query = `
    UPDATE users
    SET name = ?, issueDate = ?, startDate = ?, endDate = ?, duration = ?, doctor = ?, jobTitle = ?
    WHERE servicecode = ? AND idNumber = ?
  `;
  const params = [
    newData.name,
    newData.issueDate,
    newData.startDate,
    newData.endDate,
    newData.duration,
    newData.doctor,
    newData.jobTitle,
    newData.servicecode,
    newData.idNumber
  ];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).send('خطأ في تحديث البيانات.');
    }
    if (this.changes === 0) {
      // إذا لم يتم تحديث أي سجل، قم بإضافة مستخدم جديد
      const insertQuery = `
        INSERT INTO users (servicecode, idNumber, name, issueDate, startDate, endDate, duration, doctor, jobTitle)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(insertQuery, params, function (err) {
        if (err) {
          return res.status(500).send('خطأ في إضافة البيانات.');
        }
        res.send('تم إضافة البيانات بنجاح.');
      });
    } else {
      res.send('تم تحديث البيانات بنجاح.');
    }
  });
});

// نقطة نهاية لحذف مستخدم
app.delete('/api/users/:servicecode/:idNumber', (req, res) => {
  const { servicecode, idNumber } = req.params;
  const query = 'DELETE FROM users WHERE servicecode = ? AND idNumber = ?';

  db.run(query, [servicecode, idNumber], function (err) {
    if (err) {
      return res.status(500).send('خطأ في حذف المستخدم.');
    }
    if (this.changes === 0) {
      return res.status(404).send('لم يتم العثور على المستخدم.');
    }
    res.send('تم حذف المستخدم بنجاح.');
  });
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});