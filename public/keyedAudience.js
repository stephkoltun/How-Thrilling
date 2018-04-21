// peer server configuration
var to = "keyFigure";
var from = "keyAud";

var options = {
  host: "sk6385.itp.io",
	port: "9000",
	path: '/peerjs',
  secure: "true",
};

console.log("make connections");

var peer = new Peer(from, options);
var kinectron = null;
var keyImage;

function setup() {
  console.log("setup");
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("#cnv");
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
    kinectron.setKeyCallback(keyCallback);

    background(0);
}

$("#cnv").css("z-index",10);
$("#back").css("z-index",0);

function draw() {
  clear();
  if (keyImage != null) {
    var offset = (1067-800)/2*(-1);
    image(keyImage,offset,0,1067,600);
  }
}

function keyCallback(img) {
  loadImage(img.src, function(loadedBodyImage) {
    keyImage = loadedBodyImage;
  })
}

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

function streamVideoToPartner(MediaStream) {
  console.log('now calling ' + to);
  // show our own video
  var video = document.getElementById('back');
  video.src = window.URL.createObjectURL(MediaStream);
  video.onloadedmetadata = function(){
      console.log('video loaded');
  }

  var call = peer.call(to, MediaStream);
  call.on('stream', onReceiveStream);
}

function getVideo(successCallback, errorCallback){
    navigator.getUserMedia({
        audio: false,
        video: true
    }, successCallback, errorCallback);
}

function videoError(err) {
  console.log('an error occured while getting the video');
  console.log(err);
}

function onReceiveCall(call){
    console.log('peer is calling...');
}

function onReceiveStream(stream){

}
