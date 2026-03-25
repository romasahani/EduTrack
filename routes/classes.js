const router = require('express').Router();
const db = require('../db');

// GET classes
router.get('/', (req, res) => {
    db.query("SELECT * FROM classes", (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

// ADD class
router.post('/', (req, res) => {
    const { subject, date, teacher_id } = req.body;
    db.query(
        "INSERT INTO classes (subject, date, teacher_id) VALUES (?, ?, ?)",
        [subject, date, teacher_id],
        (err) => {
            if (err) return res.send(err);
            res.send("Class added");
        }
    );
});

// UPDATE class ✅
router.put('/:id', (req, res) => {
    const { subject, date, teacher_id } = req.body;

    db.query(
        "UPDATE classes SET subject=?, date=?, teacher_id=? WHERE id=?",
        [subject, date, teacher_id, req.params.id],
        (err) => {
            if (err) return res.send(err);
            res.send("Class updated");
        }
    );
});

// DELETE class ✅
router.delete('/:id', (req, res) => {
    db.query(
        "DELETE FROM classes WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.send(err);
            res.send("Class deleted");
        }
    );
});

module.exports = router;