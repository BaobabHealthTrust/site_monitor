
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');
var portfinder = require('portfinder');

var router = express.Router();

// for forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.set('view options', {
    layout: true
});

// Routes

app.use('/', require("./routes/index.js")(router));

portfinder.basePort = 3016;

process.env.APPLICATION = "Site Monitoring Dashboard";

if(process.env.BHT_MODULE) {

    module.exports = router;

} else {

    portfinder.getPort(function (err, port) {

        app.listen(port, function () {
            console.log("✔ Site Monitoring Dashboard server listening on port %d in %s mode", port, app.get('env'));
        });

    });

}