const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();

app.use(express.json());

app.get('/',(req,res) => res.send('management service'));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:',err));


app.listen (PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
});



