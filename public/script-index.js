window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const loginBlock = document.getElementById('loginBlock');
  const mainButtons = document.getElementById('mainButtons');

  if (isLoggedIn === 'true') {
    // Пользователь авторизован → показываем функции
    loginBlock.style.display = 'none';
    mainButtons.style.display = 'flex';
  } else {
    // Пользователь не авторизован → только кнопка входа
    loginBlock.style.display = 'block';
    mainButtons.style.display = 'none';
  }
});

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  location.reload();
}