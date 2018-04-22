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

peer.on('connection', function(connection) {
  console.log(connection);
  console.log("we're connected to " + to)
})

peer.on('close', function() {
  console.log("connection closed");
});

peer.on('open', function(id) {
  console.log("My peer id is: " + id);
})

peer.on('call', onReceiveCall);



function onReceiveCall(call){
    console.log('peer is calling...');

    call.answer();
    call.on('stream', onReceiveStream);

    // getVideo(
    //   // get our video stream
    //   // answer the call by sending the video stream
    //   function(MediaStream){
    //     // answer the call
    //     call.answer(MediaStream);
    //     console.log('answering call started...');
    //   },
    // videoError);

    //commented this out because we dont need to see anything

}

function onReceiveStream(stream){
  // if (mode == 2) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);
    video.onloadedmetadata = function(){
        console.log('video loaded');
    }
  // }
}
