console.log("TODO: learn how to use NPM");

var figlet = require('figlet');

figlet('CSSE280 using NodeJS', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});