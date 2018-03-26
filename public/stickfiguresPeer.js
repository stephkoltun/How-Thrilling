// connect to the peer network
// for getting webcam streams from non-Kinect cameras
// peerOptions
var from = "stickFigures";
var to = "webcamAud";

var options = {
  host: "sk6385.itp.io",
	port: "9000",
	path: '/peerjs',
  secure: "true",
};
// connect to peer server
console.log("make connections");
var peer = new Peer(from, options);

peer.on('open', function(id) {
  console.log("My peer id is: " + id);
})

peer.on('call', onReceiveCall);

peer.on('connection', function(connection) {
  console.log(connection);
  console.log("we're connected to " + to)
})

peer.on('close', function() {
  console.log("connection closed");
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
    call.on('stream', onReceiveStream);
}

function onReceiveStream(stream){
  console.log(stream);
    var video = document.getElementById('back');
    video.src = window.URL.createObjectURL(stream);
    video.onloadedmetadata = function(){
        console.log('video loaded');
    }
}
