var express = require('express');
var app = express();

app.use('/static', express.static("Public"));

app.get("/hello", function(req, res) {
    res.send("<h1>Hello Express!</h1>")
});

app.get("/goodbye", function(req, res) {
    res.send("<h1>Goodbye!</h1>")
});

app.listen(3000);