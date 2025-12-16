async function loadExpiringContracts() {
  const dateInput = document.getElementById('contractEndDate');
  const untilDate = dateInput.value;

  if (!untilDate) {
    alert('Выберите дату!');
    return;
  }

  try {
    // Запрос к серверу
    const res = await fetch(`/api/contracts?until=${untilDate}`);
    const data = await res.json();

    // Заполнение таблицы
    const tbody = document.getElementById('contractsTableBody');
    tbody.innerHTML = '';

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="2">Нет данных</td></tr>';
      return;
    }

    data.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.full_name}</td>
        <td>${emp.contract_end}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    alert('Не удалось загрузить данные');
  }
}