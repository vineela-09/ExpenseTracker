const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Redirect home
app.get('/', (req, res) => {
  res.redirect('/expenses');
});

// Expense List Page
app.get('/expenses', async (req, res) => {
  const result = await pool.query('SELECT * FROM expenses ORDER BY date ASC');
  res.render('expenseList', { expenses: result.rows });
});

// Add New Expense
app.post('/expenses', async (req, res) => {
  const { description, amount, date } = req.body;
  await pool.query('INSERT INTO expenses (description, amount, date) VALUES ($1, $2, $3)', [description, amount, date]);
  res.redirect('/expenses');
});

// Delete Expense
app.post('/expenses/delete/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
  res.redirect('/expenses');
});

// Dashboard Page
app.get('/dashboard', async (req, res) => {
  const result = await pool.query('SELECT * FROM expenses');
  res.render('dashboard', { expenses: result.rows });
});

// Monthly Report Page
app.get('/monthly', async (req, res) => {
  const result = await pool.query('SELECT * FROM expenses');
  res.render('monthly', { expenses: result.rows });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
