const sqlite3 = require('sqlite3').verbose();

// افتح قاعدة البيانات (إذا لم تكن موجودة، سيتم إنشاؤها تلقائيًا)
const db = new sqlite3.Database('./seha.db', (err) => {
  if (err) {
    console.error('خطأ في فتح قاعدة البيانات:', err.message);
  } else {
    console.log('تم الاتصال بقاعدة البيانات SQLite بنجاح.');
  }
});

// إنشاء جدول المستخدمين إذا لم يكن موجودًا
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servicecode TEXT NOT NULL,
      idNumber TEXT NOT NULL,
      name TEXT NOT NULL,
      issueDate TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      duration INTEGER NOT NULL,
      doctor TEXT NOT NULL,
      jobTitle TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('خطأ في إنشاء الجدول:', err.message);
    } else {
      console.log('تم إنشاء الجدول بنجاح أو كان موجودًا بالفعل.');
    }
  });
});

// تصدير كائن قاعدة البيانات
module.exports = db;