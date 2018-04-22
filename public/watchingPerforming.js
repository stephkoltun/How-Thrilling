var debug = true;
// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 2000;

var skelColors = ["rgba(177,35,253,1)", "rgba(37,135,253,1)", "rgba(250,130,37,1)", "rgba(240,90,80,1)", "rgba(255,250,56,1)", "rgba(37,203,157,1)"];
var boneWeight = 10;

// Mapping Kinect data to projecion
var scvar, xscl, yscl;
var xshift, yshift;
var scl = true;

var watching = true;
var performerImage;

var seconds = 12;
var currentTiming = 0;
var maxTiming = 30 * seconds;


// Declare kinectron
var kinectron = null;
var elsewhereKinectron = null;

const mapheight = (540 / 960) * $(window).width;

var thrillerCutout;
var vidWidth = $(window).width / 480 * 654;

function setup() {
    //make sure the body is hidden to begin with
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("cnv");  // set parent of canvas
    frameRate(30);
    //background(0);

    thrillerCutout = createVideo('assets/thriller.mp4');
    thrillerCutout.hide();
    thrillerCutout.loop();

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

    elsewhereKinectron = new Kinectron("dancing",
    {
      "host": "sk6385.itp.io",
      "port": "9000",
      "path": "/peerjs",
      "secure":"true"
    });

    // Connect with application over peer
    kinectron.makeConnection();
    kinectron.setBodiesCallback(bodyCallback);

    elsewhereKinectron.makeConnection();
    elsewhereKinectron.setColorCallback(rgbCallback);

    scvar = 0.6;

    xscl = (width / 2) * scvar;
    yscl = -(width / 2) * scvar;
    xshift = width / 2;
    yshift = height / 2 - 25;
}

function draw() {
  var bodies = bm.getBodies();

  if (watching) {
    if (performerImage != null) {
      image(performerImage, 0, 0, windowWidth, windowHeight);
    }

    if (bodies.length != 0) {
      if (currentTiming < maxTiming) {
        currentTiming++;
      } else {
        console.log("switch");
        watching = false;
        currentTiming = 0;
      }
    }
  } else {
    clear();
    // draw cutout michael and stick figures
    var thrillerCrop = thrillerCutout.get(250,250,100,350);
    image(thrillerCrop,250,250,100,350);
    //image(thrillerCutout,0,0,vidWidth,windowHeight);
    if (bodies.length > 0) {
      drawSkeleton(bodies.length, skelColors);
    }

    if (currentTiming < maxTiming) {
      currentTiming++;
    } else {
      console.log("switch");
      watching = true;
      currentTiming = 0;
    }
  }

  if (debug) {
    showDebugText()
  }
}

function showDebugText() {
  textSize(16);
  fill(255);
  noStroke();
  text("yshift (y/h): " + round(yshift), 20, 20);
  text("xscale (t/g): " + round(xscl), 20, 40);
  text("yscale: (t/g)" + round(yscl), 20, 60);

  text("framerate: " + frameRate().toFixed(2), 20, 90);
}


function rgbCallback(img) {
  // do nothing here
  loadImage(img.src, function(loadedImage) {
      if (watching) {
        performerImage = loadedImage;
      }
  });
}

function bodyCallback(bodyArray) {
    //find tracked bodies
    for (var i = 0; i < bodyArray.bodies.length; i++) {
        if (bodyArray.bodies[i].tracked === true) {
            bodyTracked(bodyArray.bodies[i]);
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
        } else {
          bm.add(body);
        };
    }
}

function keyPressed() {
    switch (keyCode) {
        case 68: // d
            debug = !debug;
            break;
    }
}
