const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();
const routes = require('./src/routes/routes')
const cartRoutes = require('./src/routes/cartRoutes')
const wss = require('./src/controllers/WebSocketController');
const routesName = require("./src/common/routesName");

// Web Socket
wss.wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
        client.send('This is a broadcast message from the server');
    }
});


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

// Api routes
app.use(routesName.api, routes);
app.use(routesName.cart, cartRoutes);

// for image
app.use('/public', express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
