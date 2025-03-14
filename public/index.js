// دالة لجلب بيانات المستخدمين من الخادم
async function getUsers() {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data.users;
}

// دالة لتحديث بيانات المستخدمين على الخادم
async function updateUsers(usersData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usersData)
  });
  return response.text();
}

// دالة التحقق من البيانات في صفحة index.html
async function validateInputs() {
  const enteredServiceCode = document.getElementById('servicecode').value;
  const enteredIdNumber = document.getElementById('idNumber').value;
  const errorElement = document.getElementById('errorMessage');

  if (!enteredServiceCode || !enteredIdNumber) {
    alert('الرجاء تعبئة جميع الحقول المطلوبة.');
    return;
  }

  try {
    const users = await getUsers();
    const user = users.find(u => u.servicecode === enteredServiceCode && u.idNumber === enteredIdNumber);

    if (user) {
      // الانتقال إلى صفحة data-display.html مع إرسال البيانات كـ query parameters
      window.location.href = `data-display.html?servicecode=${enteredServiceCode}&idNumber=${enteredIdNumber}`;
    } else {
      errorElement.textContent = "لا يوجد نتائج";
      errorElement.style.display = "block";
      errorElement.style.backgroundColor = "rgba(231, 106, 106, 0.63)";
      setTimeout(() => {
        errorElement.style.display = "none";
      }, 3000);
    }
  } catch (err) {
    console.error('حدث خطأ أثناء جلب البيانات:', err);
    alert('حدث خطأ أثناء جلب البيانات.');
  }
}