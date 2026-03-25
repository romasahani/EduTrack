const express = require('express');
const cors = require('cors');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/students', require('./routes/students'));
app.use('/teachers', require('./routes/teachers'));
app.use('/classes', require('./routes/classes'));
app.use('/attendance', require('./routes/attendance'));

//test route
app.get('/', (req, res) => {
    res.send('ECRKSI Backend is running');
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');});
