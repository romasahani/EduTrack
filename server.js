require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors({
    origin: 'https://edu-track-kappa.vercel.app/'
}));
//app.use(cors());
app.use(express.json());

// Routes
app.use('/students', require('./routes/students'));
app.use('/teachers', require('./routes/teachers'));
app.use('/classes', require('./routes/classes'));
app.use('/attendance', require('./routes/attendance'));

// Test route
app.get('/', (req, res) => {
    res.send('ECRKSI Backend is running');
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
