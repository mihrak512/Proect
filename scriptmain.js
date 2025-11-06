function loadReport() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    fetch(`/api/employees/report?start=${start}&end=${end}`)
        .then(res => res.json())
        .then(data => renderTable(data));
}

function loadExpiringContracts() {
    const date = document.getElementById('contractEndDate').value;

    fetch(`/api/employees/expiring?date=${date}`)
        .then(res => res.json())
        .then(data => renderTable(data));
}

function loadRecentHires() {
    const date = document.getElementById('hireDate').value;

    fetch(`/api/employees/hired-after?date=${date}`)
        .then(res => res.json())
        .then(data => renderTable(data));
}

function renderTable(employees) {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';

    const alerts = document.getElementById('alerts');
    alerts.innerHTML = '';

    employees.forEach(emp => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${emp.fullName}</td>
            <td>${emp.departmentNumber}</td>
            <td>${emp.position}</td>
            <td>${emp.startDate}</td>
            <td>${emp.endDate || '-'}</td>
            <td>${emp.contractType}</td>
            <td>${emp.contractEnd}</td>
        `;

        tbody.appendChild(row);

        const today = new Date();
        const contractEnd = new Date(emp.contractEnd);
        const diffDays = (contractEnd - today) / (1000 * 60 * 60 * 24);

        if (diffDays < 30 && diffDays > 0) {
            const message = document.createElement('div');
            message.textContent = `⚠️ У ${emp.fullName} истекает ${emp.contractType} через ${Math.floor(diffDays)} дней. Продлить или уволить?`;
            alerts.appendChild(message);
        }
    });
}