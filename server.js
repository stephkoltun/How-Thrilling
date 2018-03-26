var port = 9000;
var https = require('https');
var http = require('http');

var fs = require('fs'); // Using the filesystem module
var credentials = {
    key: fs.readFileSync('certs/my-key.pem'),
    cert: fs.readFileSync('certs/my-cert.pem')
};

var express = require('express');
var app = express();


var ExpressPeerServer = require('peer').ExpressPeerServer;
var serverOptions = {
    debug: true
}

var exposed = false;

var trackBody = {
	"exposed": false,
};

app.get('/hide', function (req, res) {
	trackBody.exposed = false;
	res.send(trackBody);
});

app.get('/expose', function (req, res) {
	trackBody.exposed = true;
	res.send(trackBody);
})

app.get('/check', function (req, res) {
	res.send(trackBody);
})


// this runs after the server successfully starts:
function serverStart() {
  var p = server.address().port;
  console.log('Server listening on port '+ p);
}


// start the server
//var server = http.createServer(app);
var server = https.createServer(credentials, app);
app.use('/peerjs', ExpressPeerServer(server, serverOptions));
app.use(express.static('public'));
server.listen(port, serverStart);
