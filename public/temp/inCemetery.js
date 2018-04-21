/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("sketch started");

// Declare kinectron
var kinectron = null;

// Mapping Kinect data to projecion
var scvar, xscl, yscl;
var xshift, yshift;
var scl = true;

var cemetery;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

    //load and draw background
    loadImage("assets/cemetery.jpg", function(loadedImage) {
  		cemetery = loadedImage;
      image(cemetery, 0, 0, width);
    });

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron(inCemeteryIP);  // use the camera here
    // Connect with application over peer
    kinectron.makeConnection();
    kinectron.startKey(keyCallback);
}

function keyCallback(img) {
	loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0);
  });
}

function draw() {
}
