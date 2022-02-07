var express = require('express');
var app = express();

app.use('/static', express.static("Public"));

app.get("/hello", function(req, res) {
    let name = req.query.name;  
    let age = req.query.age;





    res.send("<h1>Hello "+name+" ! </h1>" + 
        "You are " + age + " years old.")
});

app.get("/goodbye", function(req, res) {
    res.send("<h1>Goodbye!</h1>")
});

app.post("/myPost", function(req,res) {
    res.send("HTML code. Done via post");
});

app.get("/users/:username", function(req,res) {
    let username = req.params.username;
    res.send("<h1>Profile for "+username+"</h1>");
});

app.set('views', './views')

app.listen(3000);