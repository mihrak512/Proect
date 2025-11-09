// 1. Отчетный период
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
  
  // 2. Контракты, заканчивающиеся до даты
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
  
  // 3. Контракты, истекающие менее чем через месяц
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
  
  // 4. Принятые после даты, сгруппированные по отделам
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