const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');


const app = express();
const PORT = 2000;

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ZErotohero1212',
  database: 'nutech_test_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


// Create an item
app.post('/items', (req, res) => {
    const newItem = req.body;
    db.query(
      'INSERT INTO items (image, name, purchasePrice, sellingPrice, stock) VALUES (?, ?, ?, ?, ?)',
      [newItem.image, newItem.name, newItem.purchasePrice, newItem.sellingPrice, newItem.stock],
      (err, result) => {
        if (err) {
          console.error('Error creating item:', err);
          res.status(500).send('Error creating item');
        } else {
          const createdItem = { ...newItem, id: result.insertId };
          res.status(201).json(createdItem);
        }
      }
    );
  });
  
  // Read all items
  app.get('/items', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Error fetching items');
      } else {
        res.status(200).json(results);
      }
    });
  });
  
  // Update an item
// Update an item
app.put('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;
    db.query(
      'UPDATE items SET name = ?, purchasePrice = ?, sellingPrice = ?, stock = ? WHERE id = ?',
      [
        updatedItem.name,
        updatedItem.purchasePrice,
        updatedItem.sellingPrice,
        updatedItem.stock,
        itemId,
      ],
      (err) => {
        if (err) {
          console.error('Error updating item:', err);
          res.status(500).send('Error updating item');
        } else {
          res.status(200).json(updatedItem);
        }
      }
    );
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  // Delete an item
  app.delete('/items/:id', (req, res) => {
    const itemId = req.params.id;
    db.query('DELETE FROM items WHERE id = ?', itemId, (err) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).send('Error deleting item');
      } else {
        res.status(204).end();
      }
    });
  });
  
