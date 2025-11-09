function loadExpiringSoon() {
    fetch('/api/expiring-soon')
      .then(res => res.json())
      .then(data => {
        const tbody = document.getElementById('expiringTableBody');
        tbody.innerHTML = '';
        data.forEach(emp => {
          tbody.innerHTML += `
            <tr>
              <td>${emp.name}</td>
              <td>${emp.contract_type}</td>
              <td>${emp.contract_end}</td>
              <td>
                <button onclick="alert('Продлить или уволить: ${emp.name}')">Решить</button>
              </td>
            </tr>`;
        });
      });
  }