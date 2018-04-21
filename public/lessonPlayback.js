// Declare kinectron
var kinectron = null;

const saveForSeconds = 8;
const maxFramesToSave = 30*saveForSeconds;
var savedFrames = [];
var playbackFrame = 0;  // tracking number

var timingSwitch = saveForSeconds * 1000;

var currentImage;

var live = true;
const mapheight = (540 / 960) * windowWidth;

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
    kinectron.setColorCallback(rgbCallback);

    background(0);

    song.play();
    song.jump(71);
}

function draw() {
  if (live) {
    if (currentImage != null) {
      image(currentImage, 0, 0, windowWidth, mapheight);
    }
  } else {
    image(savedFrames[playbackFrame], 0, 0, windowWidth, mapheight);

    if (Date.now() % timingSwitch == 0) {
      live = true;
      song.jump(71);
      savedFrames = [];
      playbackFrame = 0;
    } else {
      if (playbackFrame < savedFrames.length-1) {
        playbackFrame++;
      } else {
        playbackFrame = 0;
      }
    }

    // if (playbackFrame < savedFrames.length-1) {
    //   playbackFrame++;
    // } else {
    //   live = true;
    //   song.jump(71);
    //   // reset tracking
    //   playbackFrame = 0;
    //   // empty array
    //   savedFrames = [];
    // }
  }
}

function rgbCallback(img) {
    loadImage(img.src, function(loadedImage) {
        currentImage = loadedImage;
        if (live) {
          savedFrames.push(loadedImage);
          if (Date.now() % timingSwitch == 0) {
            live = false;
            song.jump(71);
          }
          // if (savedFrames.length == maxFramesToSave) {
          //   live = false;
          //   song.jump(71);
          // }
        }
    });
}
