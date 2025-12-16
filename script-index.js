window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');
  const loginBlock = document.getElementById('loginBlock');
  const mainButtons = document.getElementById('mainButtons');

  if (isLoggedIn === 'true') {
    loginBlock.style.display = 'none';
    mainButtons.style.display = 'flex';

    if (userRole === 'employee') {
      mainButtons.innerHTML = `
        <a href="my-contract.html" class="main-btn">📑 Мой контракт</a>
        <a href="my-report.html" class="main-btn">📊 Отчет за период</a>
        <button onclick="logout()">🚪 Выйти</button>
      `;
    } else if (userRole === 'admin') {
      mainButtons.innerHTML = `
        <a href="report.html" class="main-btn">📊 Отчетный период</a>
        <a href="contracts.html" class="main-btn">📅 Контракты до даты</a>
        <a href="hires.html" class="main-btn">👥 Принятые после даты</a>
        <a href="expiring.html" class="main-btn">⏳ Истекающие контракты</a>
        <a href="departments.html" class="main-btn">🏢 По отделам</a>
        <button onclick="logout()">🚪 Выйти</button>
      `;
    }
  } else {
    loginBlock.style.display = 'block';
    mainButtons.style.display = 'none';
  }
});

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  location.reload();
}