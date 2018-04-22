// peer server configuration
var to = "stickFigures";
var from = "webcamAud";

var options = {
  host: "sk6385.itp.io",
	port: "9000",
	path: '/peerjs',
  secure: "true",
};

console.log("make connections");

var peer = new Peer(from, options);

var kinectron = null;
function setup() {
  console.log("setup");
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron("dancing",
    {
      "host": "sk6385.itp.io",
      "port": "9000",
      "path": "/peerjs",
      "secure":"true"
    });

    // Connect with application over peer
    kinectron.makeConnection();
    // Set individual frame callbacks for KINECT 1
    kinectron.setColorCallback(audienceCallback);
    kinectron.setBodiesCallback(bodiesCallback);

    background(0);
}

function bodiesCallback(body) {
  //do nothing
}

function audienceCallback(img) {
  var mapheight = (540 / 960) * windowWidth;

  loadImage(img.src, function(loadedImage) {
      image(loadedImage, 0, 0, windowWidth, mapheight);
  });
}

$("#back").hide();


peer.on('open', function(id) {
  console.log("My peer id is: " + id);
})

peer.on('call', onReceiveCall);

peer.on('connection', function(connection) {
  console.log(connection);
  console.log("we're connected!")
})

peer.on('close', function() {
  console.log("connection closed");
});

$('#start-call').click(function(){
    console.log('starting call with ' + to + '...');
    getVideo(streamVideoToPartner, videoError);
    // arguments: success callback, error callback
});

$('#end-call').click(function(){
    peer.destroy();
});

function streamVideoToPartner(MediaStream) {
  console.log('now calling ' + to);
  var call = peer.call(to, MediaStream);
  call.on('stream', onReceiveStream);
}


function videoError(err) {
  console.log('an error occured while getting the video');
  console.log(err);
}

function getVideo(successCallback, errorCallback){
    navigator.getUserMedia({
        audio: false,
        video: true
    }, successCallback, errorCallback);
}

function onReceiveCall(call){
    console.log('peer is calling...');
    console.log(call);

    getVideo(
      // get our video stream
      // answer the call by sending the video stream
      function(MediaStream){
        // answer the call
        call.answer(MediaStream);
        console.log('answering call started...');
      },
    videoError);

    //commented this out because we dont need to see anything
    // call.on('stream', onReceiveStream);
}

function onReceiveStream(stream){
  // console.log(stream);
  //   var video = document.querySelector('video');
  //   video.src = window.URL.createObjectURL(stream);
  //   video.onloadedmetadata = function(){
  //       console.log('video loaded');
  //   }
}
