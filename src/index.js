require('./db/mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 9000;


app.get("/", (req, res) => {
    res.send("good to go.")
})

app.listen(PORT, () => {
    console.log("Server running on local port 9000")
});