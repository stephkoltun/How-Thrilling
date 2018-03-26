var kinectron = new Kinectron("dancing",
{
  "host": "sk6385.itp.io",
  "port": "9000",
  "path": "/peerjs",
  "secure":"true"
});

// Connect with application over peer
kinectron.makeConnection();

$("#endAll").on("click", function() {
  kinectron.stopAll();
})

kinectron.setBodiesCallback(bodyCallback);
kinectron.setColorCallback(colorCallback);

function bodyCallback(body) {

}

function colorCallback(img) {

}
