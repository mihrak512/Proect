function loadByDepartment() {
    const after = document.getElementById('hireDate').value;
    fetch(`/api/hired-by-department?after=${after}`)
      .then(res => res.json())
      .then(data => {
        const tbody = document.getElementById('departmentTableBody');
        tbody.innerHTML = '';
        data.forEach(emp => {
          tbody.innerHTML += `
            <tr>
              <td>${emp.name}</td>
              <td>${emp.department_number}</td>
              <td>${emp.position}</td>
              <td>${emp.hire_date}</td>
            </tr>`;
        });
      });
  }