const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.get("/",(req,res) => {
    res.send("Node js project connected");
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})