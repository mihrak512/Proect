async function loadExpiringSoon() {
  try {
    // Запрос к серверу
    const res = await fetch('/api/expiring-soon');
    const data = await res.json();

    // Заполнение таблицы
    const tbody = document.getElementById('expiringTableBody');
    tbody.innerHTML = '';

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="4">Нет данных</td></tr>';
      return;
    }

    data.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.full_name}</td>
        <td>${emp.position}</td>
        <td>${emp.phone}</td>
        <td>${emp.contract_end}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    alert('Не удалось загрузить данные');
  }
}