function loadExpiringContracts() {
    const until = document.getElementById('contractEndDate').value;
  
    fetch(`/api/contracts?until=${until}`)
      .then(res => res.json())
      .then(data => {
        const tbody = document.getElementById('contractsTableBody');
        tbody.innerHTML = '';
        data.forEach(emp => {
          tbody.innerHTML += `
            <tr>
              <td>${emp.name}</td>
              <td>${emp.contract_end}</td>
            </tr>`;
        });
      });
  }