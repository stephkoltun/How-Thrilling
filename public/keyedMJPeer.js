// connect to the peer network
// for getting webcam streams from non-Kinect cameras
// peerOptions
var from = "keyFigure";
var to = "keyAud";

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

peer.on('call', onReceiveCall);

function onReceiveCall(call){
    console.log('peer is calling...');

    call.answer();
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
