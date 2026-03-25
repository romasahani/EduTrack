const router = require('express').Router();
const db = require('../db');

// GET all teachers
router.get('/', (req, res) => {
    const query = 'SELECT * FROM teachers';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ADD a new teacher
router.post('/', (req, res) => {
    const { name, department } = req.body;
    if (!name || !department) return res.status(400).send("Missing fields");

    const query = 'INSERT INTO teachers (name, department) VALUES (?, ?)';
    db.query(query, [name, department], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Teacher added successfully');
    });
});

// UPDATE a teacher
router.put('/:id', (req, res) => {
    const { name, department } = req.body;
    if (!name || !department) return res.status(400).send("Missing fields");

    const query = 'UPDATE teachers SET name=?, department=? WHERE id=?';
    db.query(query, [name, department, req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Teacher updated successfully');
    });
});

// DELETE a teacher
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM teachers WHERE id=?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Teacher deleted successfully');
    });
});

module.exports = router;