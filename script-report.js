async function loadReport() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    alert('Выберите обе даты!');
    return;
  }

  try {
    // Запрос к серверу
    const res = await fetch(`/api/report?start=${startDate}&end=${endDate}`);
    const data = await res.json();

    // Заполнение таблицы
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="2">Нет данных</td></tr>';
      return;
    }

    data.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.full_name}</td>
        <td>${emp.department_number}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    alert('Не удалось загрузить данные');
  }
}