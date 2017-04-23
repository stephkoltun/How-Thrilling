var express = require('express');
var app = express();

var exposed = false;
var exposedTime = 0;
var maxExposure = 30 * 6;

var isTheBodyExposed = false;

var trackBody = {
	"exposed": false,
	"exposedTime": 0, 
	"performTime": 0
};

app.listen(1234, function () {
  console.log('Server listening on port 1234!');
});

app.get('/okay', function (req, res) {
	trackBody.exposed = false;
	trackBody.performTime++;
	res.send(trackBody);
});

app.get('/expose', function (req, res) {
	trackBody.exposed = true;
	trackBody.performTime = 0;
	res.send(trackBody);
})

app.use(express.static('public'));