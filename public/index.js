/* index.js */

// دالة لجلب بيانات المستخدمين من الخادم
function getUsers() {
    return fetch('/api/users')
      .then(response => response.json());
  }
  
  // دالة لتحديث بيانات المستخدمين على الخادم
  function updateUsers(usersData) {
    return fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usersData)
    });
  }
  
  // دالة التحقق من البيانات في صفحة index.html
  function validateInputs() {
    const enteredServiceCode = document.getElementById('servicecode').value;
    const enteredIdNumber = document.getElementById('idNumber').value;
    const errorElement = document.getElementById('errorMessage');
  
    getUsers()
      .then(data => {
        const user = data.users.find(u => u.servicecode === enteredServiceCode && u.idNumber === enteredIdNumber);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          window.location.href = "data-display.html";
        } else {
          errorElement.textContent = "لا يوجد نتائج";
          errorElement.style.display = "block";
          errorElement.style.backgroundColor = "rgba(231, 106, 106, 0.63)";
          setTimeout(() => {
            errorElement.style.display = "none";
          }, 3000);
        }
      })
      .catch(err => console.error(err));
  }
  