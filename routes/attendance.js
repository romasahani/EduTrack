const router = require('express').Router();
const db = require('../db');

// GET all attendance
router.get('/', (req, res) => {
    db.query("SELECT * FROM attendance", (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

// ADD attendance
router.post('/', (req, res) => {
    const { student_id, class_id, status } = req.body;

    db.query(
        "INSERT INTO attendance (student_id, class_id, status) VALUES (?, ?, ?)",
        [student_id, class_id, status],
        (err) => {
            if (err) return res.send(err);
            res.send("Attendance added");
        }
    );
});

// UPDATE attendance
router.put('/:id', (req, res) => {
    const { student_id, class_id, status } = req.body;

    db.query(
        "UPDATE attendance SET student_id=?, class_id=?, status=? WHERE id=?",
        [student_id, class_id, status, req.params.id],
        (err) => {
            if (err) return res.send(err);
            res.send("Attendance updated");
        }
    );
});

// DELETE attendance
router.delete('/:id', (req, res) => {
    db.query(
        "DELETE FROM attendance WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.send(err);
            res.send("Attendance deleted");
        }
    );
});

module.exports = router;