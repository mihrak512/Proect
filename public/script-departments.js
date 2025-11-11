async function loadByDepartment() {
  const dateInput = document.getElementById('hireDate');
  const afterDate = dateInput.value;

  if (!afterDate) {
    alert('Выберите дату!');
    return;
  }

  try {
    // Запрос к серверу
    const res = await fetch(`/api/hired-by-department?after=${afterDate}`);
    const data = await res.json();

    // Заполнение таблицы
    const tbody = document.getElementById('departmentTableBody');
    tbody.innerHTML = '';

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="4">Нет данных</td></tr>';
      return;
    }

    data.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.full_name}</td>
        <td>${emp.department}</td>
        <td>${emp.position}</td>
        <td>${emp.hire_date}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    alert('Не удалось загрузить данные');
  }
}