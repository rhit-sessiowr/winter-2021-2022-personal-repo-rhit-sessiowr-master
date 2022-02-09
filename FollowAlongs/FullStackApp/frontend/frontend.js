var express = require('express');
var app = express();



app.use('/static', express.static("Public"));





app.listen(8080);