var kinectron = null;

var playFrames = [];
var nextFrames = [];

var totalFrames = 40;
var curPlayFrame = 0;
var curNextFrame = 0;

var curLoop = 0;
var maxLoop = 4;

var firstSet = true;

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("cnv");  // set parent of canvas
  frameRate(30);
  //background(0);

  // KINECTRON SETUP
  // Define and create an instance of kinectron
  // connect to our peer server
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
  //kinectron.startKey();

  thrillerVid = createVideo('assets/thriller.mp4');
  thrillerVid.hide();
  thrillerVid.loop();
}

function draw() {
  if (firstSet == false && frameCount % 2 == 0) {
    background(255);
    image(playFrames[curPlayFrame], 0, 0, windowWidth, windowHeight);
    image(thrillerVid,windowWidth/2,0,windowWidth,windowHeight);

    if (curPlayFrame < totalFrames-1) {
      curPlayFrame++;
    } else {
      curPlayFrame = 0;
      if (curLoop < maxLoop-1) {
        curLoop++;
        console.log("loop " + curLoop);
      } else {
        curLoop = 0;
        console.log("next recording");
        if (nextFrames.length == totalFrames) {
          playFrames = nextFrames.slice();
          nextFrames = [];
        }
      }
    }
  }
}

function keyCallback(img) {
  loadImage(img.src, function(loadedImage) {
    if (firstSet) {
      if (playFrames.length < totalFrames) {
        playFrames.push(loadedImage)
      } else {
        console.log("done saving first");
        firstSet = false;
      }
    } else {
      // save for next loop
      if (nextFrames.length < totalFrames) {
        nextFrames.push(loadedImage);
      }
    }
  })

}
