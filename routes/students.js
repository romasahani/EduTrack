const router = require('express').Router();
const db = require('../db');

// Get all students
router.get('/', async (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if(err) return res.send(err);
        res.json(results);
    });
});

// Add a new student
router.post('/', async (req, res) => {
    const { name, department, year } = req.body;
    db.query('INSERT INTO students (name, department, year) VALUES (?, ?, ?)', [name, department, year], (err, results) => {
        if(err) return res.send(err);
        res.send('Student added successfully');
    });
});

// UPDATE student
router.put('/:id', (req, res) => {
    const { name, department, year } = req.body;

    db.query(
        "UPDATE students SET name=?, department=?, year=? WHERE id=?",
        [name, department, year, req.params.id],
        (err) => {
            if (err) return res.send(err);
            res.send("Student updated");
        }
    );
});

// DELETE student
router.delete('/:id', (req, res) => {
    db.query(
        "DELETE FROM students WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.send(err);
            res.send("Student deleted");
        }
    );
});

module.exports = router;