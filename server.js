const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Авторизация (демо)
const users = [
  { username: 'admin', password: 'admin123', role: 'admin', employee_id: null },
  { username: 'ivan', password: 'ivan123', role: 'employee', employee_id: 1 },
  { username: 'olga', password: 'olga123', role: 'employee', employee_id: 2 }
];

app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;
  const user = users.find(
    u => u.username === username && u.password === password && u.role === role
  );
  if (user) {
    return res.json({ success: true, role: user.role, employee_id: user.employee_id });
  }
  return res.json({ success: false });
});

// 📊 Отчетный период (общий)
app.get('/api/report', (req, res) => {
  const { start, end } = req.query;
  db.all(
    `SELECT e.full_name, d.name AS department
     FROM employees e
     LEFT JOIN Departments d ON e.department_number = d.id
     WHERE e.hire_date BETWEEN ? AND ?
     ORDER BY e.hire_date ASC`,
    [start, end],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
    }
  );
});

// 📅 Контракты до даты
app.get('/api/contracts', (req, res) => {
  const { until } = req.query;
  db.all(
    `SELECT e.full_name, c.end_date
     FROM employees e
     JOIN contracts c ON c.employee_id = e.id
     WHERE c.end_date <= ?`,
    [until],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
    }
  );
});

// ⏳ Контракты, истекающие в течение месяца
app.get('/api/expiring-soon', (req, res) => {
  db.all(
    `SELECT e.full_name, e.position, e.phone, c.end_date
     FROM employees e
     JOIN contracts c ON c.employee_id = e.id
     WHERE c.end_date BETWEEN date('now') AND date('now', '+1 month')
     ORDER BY c.end_date ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
    }
  );
});

// 👥 Принятые после даты
app.get('/api/hires', (req, res) => {
  const { after } = req.query;
  db.all(
    `SELECT * FROM employees WHERE hire_date > ?`,
    [after],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
    }
  );
});

// 🏢 Принятые по отделам после даты
app.get('/api/hired-by-department', (req, res) => {
  const { after } = req.query;
  db.all(
    `SELECT * FROM employees WHERE hire_date > ? ORDER BY department_number`,
    [after],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
    }
  );
});

// 📑 Мой контракт
app.get('/api/my-contract', (req, res) => {
  const { id } = req.query;
  const employeeId = Number(id);

  if (!employeeId) {
    return res.status(400).json({ error: 'Некорректный id сотрудника' });
  }

  db.get(
    `SELECT c.*, e.full_name, e.position, d.name AS department
     FROM contracts c
     JOIN employees e ON c.employee_id = e.id
     LEFT JOIN Departments d ON e.department_number = d.id
     WHERE c.employee_id = ?`,
    [employeeId],
    (err, row) => {
      if (err) return res.status(500).send(err.message);
      if (!row) return res.status(404).json({ error: 'Контракт не найден' });
      res.json(row);
    }
  );
});

// 📊 Мой отчет (с защитой от пустого id и явными логами)
app.get('/api/my-report', (req, res) => {
  const { id, start, end, type } = req.query;
  console.log('[my-report] query:', { id, start, end, type });

  const employeeId = Number(id);
  if (!employeeId || !start || !end) {
    return res.status(400).json({ error: 'Нужно передать корректные параметры id, start и end' });
  }

  // 1) Явная проверка существования сотрудника
  db.get(`SELECT id, full_name, department_number, position FROM employees WHERE id = ?`, [employeeId], (errEmp, emp) => {
    if (errEmp) return res.status(500).json({ error: errEmp.message });
    if (!emp) {
      return res.status(404).json({ error: `Сотрудник с id=${employeeId} не найден` });
    }

    // 2) Основной запрос с LEFT JOIN контракта и отдела
    const sql = `
      SELECT 
        e.id AS employee_id,
        e.full_name,
        e.position,
        d.name AS department,
        c.type AS contract_type,
        c.start_date,
        c.end_date,
        c.salary
      FROM employees e
      LEFT JOIN contracts c ON c.employee_id = e.id
      LEFT JOIN Departments d ON e.department_number = d.id
      WHERE e.id = ?
    `;

    db.get(sql, [employeeId], (errRow, row) => {
      if (errRow) return res.status(500).json({ error: errRow.message });

      // Дни в периоде
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Неверный формат даты: используйте YYYY-MM-DD' });
      }
      const periodDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      // Активность контракта
      let contractActive = false;
      if (row && row.start_date && row.end_date) {
        const contractStart = new Date(row.start_date);
        const contractEnd = new Date(row.end_date);
        contractActive = !(endDate < contractStart || startDate > contractEnd);
      }

      // Предупреждение: до конца контракта < 30 дней
      let warning = null;
      if (row && row.end_date) {
        const today = new Date();
        const endDateObj = new Date(row.end_date);
        const daysLeft = Math.ceil((endDateObj - today) / (1000 * 60 * 60 * 24));
        if (daysLeft > 0 && daysLeft < 30) {
          warning = `⚠️ До окончания контракта осталось ${daysLeft} дней. Рекомендуется продлить договор или рассмотреть увольнение.`;
        }
      }

      const result = {
        employee_id: emp.id,
        full_name: emp.full_name,
        position: emp.position,
        department: row ? (row.department || null) : null,
        period: { start, end, days: periodDays },
        warning
      };

      if (type === 'contract') {
        result.contract_summary = {
          type: row && row.contract_type ? row.contract_type : '—',
          start_date: row && row.start_date ? row.start_date : '—',
          end_date: row && row.end_date ? row.end_date : '—',
          active_in_period: contractActive
        };
      } else {
        result.salary_summary = {
          base_salary: row && row.salary ? row.salary : '—',
          active_contract_in_period: contractActive
        };
      }

      res.json(result);
    });
  });
});

// 📄 Страницы
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'start.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/main.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'main.html')));

// 🚀 Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});