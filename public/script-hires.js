function loadRecentHires() {
    const after = document.getElementById('hireDate').value;
  
    fetch(`/api/hires?after=${after}`)
      .then(res => res.json())
      .then(data => {
        const tbody = document.getElementById('hiresTableBody');
        tbody.innerHTML = '';
        data.forEach(emp => {
          tbody.innerHTML += `
            <tr>
              <td>${emp.full_name}</td>
              <td>${emp.hire_date}</td>
            </tr>`;
        });
      });
  }