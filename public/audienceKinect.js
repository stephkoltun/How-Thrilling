/*
Stephanie Koltun
Accumulation of Movement
*/


// Declare kinectron
var kinectron = null;

var song;

function preload() {
  song = loadSound('assets/thriller.mp3');
}

function setup() {
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

    song.loop();
}

function bodiesCallback(bodies) {
  // ignore
}

function audienceCallback(img) {
    loadImage(img.src, function(loadedImage) {
        image(loadedImage, 0, 0, windowWidth, windowHeight);
    });
}
