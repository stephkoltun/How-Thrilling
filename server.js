var express = require('express');
var app = express();

var exposed = false;
var exposedTime = 0;
var maxExposure = 30 * 6;

var trackBody = {
	"exposed": false,
};

app.listen(1234, function () {
  console.log('Server listening on port 1234!');
});

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

app.use(express.static('public'));