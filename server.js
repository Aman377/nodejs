const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();
const userRoutes = require('./src/routes/userRoutes')

const app = express();
const port = process.env.PORT;
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

// Connect mongodb
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log(`Connected to MongoDB`);
});
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});


app.use(express.json());
app.get("/", (req, res) => {
    res.send("Node.js project connected");
});

// User api routes
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
