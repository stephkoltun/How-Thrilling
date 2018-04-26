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

  thrillerVid = createVideo('assets/thriller-cutout.mp4');
  thrillerVid.hide();
  thrillerVid.loop();
}

function draw() {
  if (firstSet == false && frameCount % 2 == 0) {
    background(0);

    thrillerVid.loadPixels();

    for (var i = 0; i < thrillerVid.pixels.length; i += 4) {
      var r = thrillerVid.pixels[i];
      var g = thrillerVid.pixels[i+1];
      var b = thrillerVid.pixels[i+2];

      var total = r+g+b;

      if (total < 15) {
        thrillerVid.pixels[i+3] = 0;
      }
    }

    thrillerVid.updatePixels();

    image(thrillerVid,windowWidth/2-200,0,windowWidth,windowHeight);
    image(playFrames[curPlayFrame], -200, 0, windowWidth, windowHeight);

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
