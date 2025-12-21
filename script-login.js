
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const role = document.getElementById('role').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, username, password })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Ответ от сервера:', data); // лог для проверки

    if (data.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', role);

      // 🔑 сохраняем employeeId
      if (data.employee_id) {
        localStorage.setItem('employeeId', data.employee_id);
        console.log('employeeId сохранён:', localStorage.getItem('employeeId'));
      }

      window.location.href = 'main.html';
    } else {
      document.getElementById('loginMessage').textContent = 'Неверный логин или пароль';
    }
  })
  .catch(err => {
    document.getElementById('loginMessage').textContent = 'Ошибка соединения с сервером';
    console.error(err);
  });
});
