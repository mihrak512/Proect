function loadReport() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
  
    fetch(`/api/report?start=${start}&end=${end}`)
      .then(res => res.json())
      .then(data => {
        const tbody = document.getElementById('reportTableBody');
        tbody.innerHTML = '';
        data.forEach(emp => {
          tbody.innerHTML += `
            <tr>
              <td>${emp.name}</td>
              <td>${emp.department}</td>
            </tr>`;
        });
      });
  }