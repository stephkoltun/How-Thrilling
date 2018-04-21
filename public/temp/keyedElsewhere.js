/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("sketch started");

var debug = true;
var mode = 1;
var speed = 1;

var exposed = false;
var exposedTime = 0;
var maxExposure = 30 * 12;

var danceTime = 0;
var maxDance = 30 * 12;

// Declare kinectron
var kinectron = null;
var audience = null;

// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 3000;

var skelColor = "rgba(137,35,253,1)";
var skelAction = "rgba(217,124,238,"
var mjColor = "rgba(24,210,255,1)";
var mjAction = "rgba(140,207,203,";
var boneWeight = 10;

// Mapping Kinect data to projecion
var scvar, xscl, yscl;
var xshift, yshift;
var scl = true;

// Mapping Michael to projection
var mjxscl, mjyscl;
var mjxshift, mjyshift;
var mjscl = true;

// variable to track frame number of MJ dance
var fr = 0;
var accumfr = 1;

// variables for saving
var oldSkeleton = [];
var oldJointsNum = 20;
var allOldSkels = [];

var thrillerVid;
var keyImage;

function setup() {
    //make sure the body is hidden to begin with
    $.ajax({
        url: "https://" + liveIP + "/hide",
        dataType: 'json',
        success: function(data) {
            // do nothing
        },
        error: function() {
            alert("error");
        },
    });
    var cnv = createCanvas(800, 600);
    cnv.parent("cnv");  // set parent of canvas
    frameRate(30);
    //background(0);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    // connect to our peer server
    kinectron = new Kinectron("audience",
    {
      "host": "sk6385.itp.io",
      "port": "9000",
      "path": "/peerjs",
      "secure":"true"
    });

    elsewhereKinect = new Kinectron("dancing",
    {
      "host": "sk6385.itp.io",
      "port": "9000",
      "path": "/peerjs",
      "secure":"true"
    });

    // Connect with application over peer
    kinectron.makeConnection();
    // Set individual frame callbacks for KINECT 1
    kinectron.setBodiesCallback(bodyCallback);
    kinectron.startBodies();

    elsewhereKinect.makeConnection();
    elsewhereKinect.setKeyCallback(keyCallback);
    // the other kinect will start the key frame

    thrillerVid = createVideo('assets/thriller.mp4');
    thrillerVid.hide();
    thrillerVid.loop();

    scvar = 0.45;
    mjscale = .8;

    xscl = (width / 2) * scvar;
    yscl = -(width / 2) * scvar;
    xshift = width / 2;
    yshift = height / 2 - 75;

    mjxscl = 1.45 * mjscale;
    mjyscl = 1.45 * mjscale;
    mjxshift = 0;
    mjyshift = -60;

    // populate 2D array
    oldSkeleton["head"] = [];
    oldSkeleton["leftwrist"] = [];
    oldSkeleton["rightwrist"] = [];
    oldSkeleton["leftfoot"] = [];
    oldSkeleton["rightfoot"] = [];
}

function draw() {

  // manage the different screens
  switch (mode) {
    case (1): // we are stickfigures with a keyed body

      var bodies = bm.getBodies();
      // save the old skeletons
      if (bodies.length != 0) {
              var body = bodies[0];
              saveBodyPoints();

          if (danceTime < maxDance) {
              danceTime++;
          } else {
              danceTime = 0;
              // switch to something else
              mode = 2;
          }
      }
      background(0);
      if (keyImage != null) {
        var offset = (1067-800)/2*(-1);
        image(keyImage,0,0,960/2,540/2);
      }
      drawSkeleton();
      break;
    case (2): // we are stickfigures with michael jackson video
      //keep track of timing
      // hide the sketch
      var vidWidth = 600 / 480 * 654;
      image(thrillerVid,0,0,vidWidth,600);
      if (exposedTime < maxExposure) {
          exposedTime++;
      } else {
          exposedTime = 0;
          // go back to dancing
          mode = 1;
      }
      break;
  }



  if (debug) {
    showDebugText()
  }
}

function showDebugText() {
  textSize(16);
  fill(255);
  noStroke();
  text("mode (>): " + mode, 20, 40);
  text("yshift (y/h): " + round(yshift), 20, 120);
  text("xscale (t/g): " + round(xscl), 20, 140);
  text("yscale: (t/g)" + round(yscl), 20, 160);

  text("framerate: " + frameRate().toFixed(2), 280, 20);
}

function keyCallback(img) {
  loadImage(img.src, function(loadedBodyImage) {
    keyImage = loadedBodyImage;
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

function saveBodyPoints() {
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
