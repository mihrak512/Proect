const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Авторизация
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'ivan', password: 'ivan123', role: 'employee' },
  { username: 'olga', password: 'olga123', role: 'employee' }
];

app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;
  const user = users.find(u => u.username === username && u.password === password && u.role === role);
  res.json({ success: !!user });
});

// 📊 Отчетный период
app.get('/api/report', (req, res) => {
  const { start, end } = req.query;
  db.all(
    `SELECT * FROM employees WHERE hire_date BETWEEN ? AND ?`,
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
    `SELECT * FROM employees WHERE contract_end <= ?`,
    [until],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
    }
  );
});

// ⏳ Контракты, истекающие менее чем через месяц
app.get('/api/expiring-soon', (req, res) => {
  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);
  const today = now.toISOString().split('T')[0];
  const limit = oneMonthLater.toISOString().split('T')[0];

  db.all(
    `SELECT * FROM employees WHERE contract_end BETWEEN ? AND ?`,
    [today, limit],
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

// 🚀 Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});