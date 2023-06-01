const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'emp'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create Employee
app.post('/employees', (req, res) => {
  const { name, email, phone } = req.body;

  // Insert the employee record
  db.query(
    'INSERT INTO employees (name, email, phone) VALUES (?, ?, ?)',
    [name, email, phone],
    (err, result) => {
      if (err) {
        console.error('Error creating employee:', err);
        res.status(500).send('An error occurred');
      } else {
        res.status(201).send('Employee created successfully');
      }
    }
  );
});

// List Employees with pagination
app.get('/employees', (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  // Fetch employees with pagination
  db.query(
    'SELECT * FROM employees LIMIT ? OFFSET ?',
    [Number(limit), Number(offset)],
    (err, results) => {
      if (err) {
        console.error('Error listing employees:', err);
        res.status(500).send('An error occurred');
      } else {
        res.json(results);
      }
    }
  );
});


// Update Employee
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  // Update the employee record
  db.query(
    'UPDATE employees SET name = ?, email = ?, phone = ? WHERE id = ?',
    [name, email, phone, id],
    (err, result) => {
      if (err) {
        console.error('Error updating employee:', err);
        res.status(500).send('An error occurred');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Employee not found');
      } else {
        res.send('Employee updated successfully');
      }
    }
  );
});

// Delete Employee
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;

  // Delete the employee record
  db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send('An error occurred');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Employee not found');
    } else {
      res.send('Employee deleted successfully');
    }
  });
});

// Get Employee
app.get('/employees/:id', (req, res) => {
  const { id } = req.params;

  // Fetch the employee by ID
  db.query('SELECT * FROM employees WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).send('An error occurred');
    } else if (results.length === 0) {
      res.status(404).send('Employee not found');
    } else {
      res.json(results[0]);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
