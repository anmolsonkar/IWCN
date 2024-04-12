import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Database connection configuration
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'your_password',
    database: 'notes'
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database!');
        connection.release();
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
})();


// Get all notes
app.get('/notes', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM notes');
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching notes');
    }
});

// Add a new note
app.post('/notes', async (req, res) => {
    const newNote = req.body;
    try {
        const [result] = await pool.query('INSERT INTO notes SET ?', newNote);
        res.status(201).json({ message: 'Note added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding note');
    }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
    const noteId = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM notes WHERE id = ?', noteId);
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting note');
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));