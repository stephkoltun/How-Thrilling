/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("sketch started");

var debug = true;

var mode = 1;
var speed = 1;
var connect = false;

var danceTime = 0;
var maxDance = 30 * 30;

var exposedTime = 0;
var maxExposure = 30 * 6;

// Declare kinectron
var kinectron = null;

// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 3000;

var skelColor = "rgba(137,35,253,1)";
var skelAction = "rgba(217,124,238,"
var boneWeight = 10;

// Mapping Kinect data to projecion
var scvar, xscl, yscl;
var xshift, yshift;
var scl = true;

// variables for saving
var oldSkeleton = [];
var oldJointsNum = 20;
var allOldSkels = [];

var rgbImage;
var keyImage;

function setup() {
  var cnv = createCanvas(800, 600);
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

  elsewhereKinect = new Kinectron("audience",
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
  kinectron.startKey();

  elsewhereKinect.makeConnection();
  elsewhereKinect.setColorCallback(setColorCallback);
  // the other kinect will start the color frames

  thrillerVid = createVideo('assets/thriller.mp4');
  thrillerVid.hide();
  thrillerVid.loop();

  scvar = 0.45;
  xscl = (width / 2) * scvar;
  yscl = -(width / 2) * scvar;
  xshift = width / 2;
  yshift = height / 2 - 75;


  // populate 2D array
  oldSkeleton["head"] = [];
  oldSkeleton["leftwrist"] = [];
  oldSkeleton["rightwrist"] = [];
  oldSkeleton["leftfoot"] = [];
  oldSkeleton["rightfoot"] = [];

}

function draw() {
    // draw the correct background
  switch (mode) {
    case (1): // mj video
      var vidWidth = 600 / 480 * 654;
      image(thrillerVid,0,0,vidWidth,600);

      if (danceTime < maxDance) {
          danceTime++;
      } else {
          mode = 2;
          danceTime = 0;
      }
      break;

    case (2): // elsewhere audience
      if (rgbImage != null) {
        var offset = (1067-800)/2*(-1);
        image(rgbImage,offset,0,1067,600);
      } else {
        background(0);
      }
      //keep track of timing
      if (exposedTime < maxExposure) {
          exposedTime++;
      } else {
          exposedTime = 0;
          // go back to dancing
          mode = 1;
      }
      break;
  }
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

function colorCallback(img) {
  loadImage(img.src, function(loadedColorImage) {
    rgbImage = loadedColorImage;
  })
}

function bodyCallback(body) {
    //find tracked bodies
    for (var i = 0; i < body.length; i++) {
        if (body[i].tracked === true) {
            bodyTracked(body[i]);
        }
    }
}

function bodyTracked(body) {
    var id = body.trackingId;
    // When there is a new body, add it
    // only do this if bm is empty

    if (bm.getBodies().length == 0) {
        console.log("new body");
        bm.add(body);
    } else if (bm.getBodies().length > 0) {
        // Otherwise, update it
        if (bm.contains(id)) {
            bm.update(body)
        }
        else {
            // disregard this extra body
        };
    }
}

function saveBodyPoints(body) {
  // save only the particular joints
  oldSkeleton["head"].push(getPos(body.getPosition(kinectron.HEAD)));
  if (oldSkeleton["head"].length > oldJointsNum) {
      oldSkeleton["head"].shift();
  }
  oldSkeleton["leftwrist"].push(getPos(body.getPosition(kinectron.WRISTLEFT)));
  if (oldSkeleton["leftwrist"].length > oldJointsNum) {
      oldSkeleton["leftwrist"].shift();
  }
  oldSkeleton["rightwrist"].push(getPos(body.getPosition(kinectron.WRISTRIGHT)));
  if (oldSkeleton["rightwrist"].length > oldJointsNum) {
      oldSkeleton["rightwrist"].shift();
  }

  oldSkeleton["leftfoot"].push(getPos(body.getPosition(kinectron.ANKLELEFT)));
  if (oldSkeleton["leftfoot"].length > oldJointsNum) {
      oldSkeleton["leftfoot"].shift();
  }

  oldSkeleton["rightfoot"].push(getPos(body.getPosition(kinectron.ANKLERIGHT)));
  if (oldSkeleton["rightfoot"].length > oldJointsNum) {
      oldSkeleton["rightfoot"].shift();
  }
}
